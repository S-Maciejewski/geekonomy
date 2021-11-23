import csv
import random
import json
import time

import psycopg2
from typing import List

from config import config

QUIZ_DIRECTORY_PATH = '../../quiz_data'


def get_dwh_query_result(cursor, countries: List[str], indicators: List[str]):
    countries_formatted = "'" + "','".join(countries) + "'"
    indicators_formatted = "'" + "','".join(indicators) + "'"

    query = f'select "Indicator Code", "Country Code", "Year", "Value" from "Data"' \
            f'where "Country Code" in ({countries_formatted}) and "Indicator Code" in ({indicators_formatted})' \
            f'order by "Country Code", "Indicator Code", "Year"'
    cursor.execute(query)
    return cursor.fetchall()


class QuizGenerator:
    def __init__(self, skip_nulls: bool = False):
        self.skip_nulls = skip_nulls
        self.connection = psycopg2.connect(**config())
        with open('./supported_countries_weights.csv', newline='') as file:
            reader = csv.reader(file)
            self.supported_countries_weights = [[item[0], item[1]] for item in list(reader)]

        with open('./supported_indicators.csv', newline='') as file:
            reader = csv.reader(file)
            self.supported_indicators = [item[0] for item in list(reader)]

    def __del__(self):
        self.connection.close()

    def get_weighted_random_countries(self, k: int = 4):
        # random.choices is very quick but can draw duplicates - they should be filtered out in a fast way
        choices = []
        while len(list(set(choices))) != k:
            choices = random.choices(population=[item[0] for item in self.supported_countries_weights],
                                     weights=[float(item[1]) for item in self.supported_countries_weights], k=k)
        return choices

    def get_random_indicators(self, skipped_indicators: List[str] = [], k: int = 4):
        population = self.supported_indicators if skipped_indicators == [] else \
            [x for x in self.supported_indicators if x not in skipped_indicators]
        return random.choices(
            population=population,
            k=k
        )

    def parse_series(self, query_result, country: str, indicator: str):
        if self.skip_nulls:
            return list(map(lambda x: [int(x[2]), float(x[3]) if x[3] is not None else None],
                            filter(lambda x: x[0] == indicator and x[1] == country and x[3] is not None,
                                   query_result)))
        return list(map(lambda x: [int(x[2]), float(x[3]) if x[3] is not None else None],
                        filter(lambda x: x[0] == indicator and x[1] == country,
                               query_result)))

    def get_single_quiz(self, countries: List[str], indicators: List[str]):
        cursor = self.connection.cursor()

        query_result = get_dwh_query_result(cursor, countries, indicators)

        indicators_data = []
        for country in countries:
            for indicator in indicators:
                indicators_data.append({
                    'indicator': indicator,
                    'country': country,
                    'series': self.parse_series(query_result, country, indicator)})

        quiz = {'countries': countries, 'indicators': indicators_data, 'correctCountry': random.choice(countries)}
        # TODO: validate quiz completeness, repeat the random generation if indicators insufficiently filled
        # Two approaches:
        # 1. Heuristic: if correctCountry has an indicator with no (or little) data, repeat the generation with this indicator skipped
        #    same goes for indicators that have i.e. less than 50% of data for all countries combined -> heavy on generator
        # 2. Query the DWH beforehand: after getting the random country list and correct country, query the DWH for a list
        #    of indicators that are sufficiently filled for correct country and other countries. -> heavy on DWH

        return quiz

    def generate_quiz_files(self, n: int = 10):
        start_time = time.time()
        for i in range(n):
            quiz = self.get_single_quiz(self.get_weighted_random_countries(), self.get_random_indicators())
            with open(f'{QUIZ_DIRECTORY_PATH}/quiz_{i}.json', 'w') as file:
                json.dump(quiz, file)
                print(f'Quiz {i + 1} of {n} generated in {time.time() - start_time} seconds')
                file.close()


if __name__ == '__main__':
    quiz_generator = QuizGenerator()

    quiz_generator.generate_quiz_files(10)

    # quiz = quiz_generator.get_single_quiz(quiz_generator.get_weighted_random_countries(),
    #                                       quiz_generator.get_random_indicators())
    # print(quiz)
    # with open('quiz_without_nulls.json', 'w+') as file:
    #     json.dump(quiz, file)
