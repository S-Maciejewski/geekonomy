import csv
import random
import json
import time

import pandas as pd
import psycopg2
from typing import List

from config import config

# QUIZ_DIRECTORY_PATH = '../../quiz_data'
QUIZ_DIRECTORY_PATH = './test_quiz_data'


def get_dwh_query_result(cursor, countries: List[str], indicators: List[str]):
    countries_formatted = "'" + "','".join(countries) + "'"
    indicators_formatted = "'" + "','".join(indicators) + "'"

    query = f'select "Indicator Code", "Country Code", "Year", "Value" from "Data"' \
            f'where "Country Code" in ({countries_formatted}) and "Indicator Code" in ({indicators_formatted})' \
            f'order by "Country Code", "Indicator Code", "Year"'
    cursor.execute(query)
    return cursor.fetchall()


# Two approaches to quiz completeness validation:
# 1. Heuristic: if correctCountry has an indicator with no (or little) data, repeat the generation with this indicator skipped
#    same goes for indicators that have i.e. less than 50% of data for all countries combined -> heavy on generator
# 2. Query the DWH beforehand: after getting the random country list and correct country, query the DWH for a list
#    of indicators that are sufficiently filled for correct country and other countries. -> heavy on DWH
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

        with open('./banned_metric_groups.csv', newline='') as file:
            reader = csv.reader(file)
            self.banned_metric_groups = [[metric for metric in group if metric != ''] for group in list(reader)]

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
        choices = []
        while len(list(set(choices))) != k:
            choices = random.choices(
                population=population,
                k=k
            )
        return choices

    def parse_series(self, query_result: List[List[str]], country: str, indicator: str):
        if self.skip_nulls:
            return list(map(lambda x: [int(x[2]), float(x[3]) if x[3] is not None else None],
                            filter(lambda x: x[0] == indicator and x[1] == country and x[3] is not None,
                                   query_result)))
        return list(map(lambda x: [int(x[2]), float(x[3]) if x[3] is not None else None],
                        filter(lambda x: x[0] == indicator and x[1] == country,
                               query_result)))

    def generate_single_quiz(self):
        countries, indicators = self.get_weighted_random_countries(), self.get_random_indicators()
        cursor = self.connection.cursor()

        correct_country = random.choice(countries)

        skipped_indicators = []

        def is_quiz_valid(query_result: List[List[str]]):
            query_df = pd.DataFrame(query_result, columns=['Indicator Code', 'Country Code', 'Year', 'Value'])
            # check if indicator codes do not belong to banned metric groups
            for group in self.banned_metric_groups:
                if set(group).issubset(set(query_df['Indicator Code'])):
                    print(f'Indicator group {group} found in quiz, skipping {set(query_df["Indicator Code"])}')
                    return False

            # Check if there aren't too many nulls in the correct country's data
            correct_country_df = query_df[query_df['Country Code'] == correct_country]
            null_values_df = correct_country_df[correct_country_df['Value'].isnull()].groupby('Indicator Code').count()[
                'Year']
            invalid_indicators = list(null_values_df.index[null_values_df > 30])

            if len(invalid_indicators) > 0:
                skipped_indicators.extend(invalid_indicators)
                return False
            return True

        query_result = get_dwh_query_result(cursor, countries, indicators)

        while not is_quiz_valid(query_result):
            # print('Quiz not valid, skipping indicators:', set(skipped_indicators))
            indicators = self.get_random_indicators(skipped_indicators)
            query_result = get_dwh_query_result(cursor, countries, indicators)

        indicators_data = []
        for country in countries:
            for indicator in indicators:
                indicators_data.append({
                    'indicator': indicator,
                    'country': country,
                    'series': self.parse_series(query_result, country, indicator)})

        quiz = {'countries': countries, 'indicators': indicators_data, 'correctCountry': correct_country}

        return quiz

    def generate_quiz_files(self, n: int = 10):
        start_time = time.time()
        for i in range(n):
            quiz = self.generate_single_quiz()
            with open(f'{QUIZ_DIRECTORY_PATH}/quiz_{i}.json', 'w') as file:
                json.dump(quiz, file)
                print(f'Quiz {i + 1} of {n} generated in {time.time() - start_time} seconds')
                file.close()


if __name__ == '__main__':
    quiz_generator = QuizGenerator()

    quiz_generator.generate_quiz_files(5)

    # quiz = quiz_generator.get_single_quiz(quiz_generator.get_weighted_random_countries(),
    #                                       quiz_generator.get_random_indicators())
    # print(quiz)
    # with open('quiz_without_nulls.json', 'w+') as file:
    #     json.dump(quiz, file)
