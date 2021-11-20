import csv

import psycopg2
from typing import List

from config import config


class QuizGenerator:
    def __init__(self):
        self.connection = psycopg2.connect(**config())
        with open('./supported_countries.csv', newline='') as file:
            reader = csv.reader(file)
            self.supported_countries = [item[0] for item in list(reader)]

        with open('./supported_indicators.csv', newline='') as file:
            reader = csv.reader(file)
            self.supported_indicators = [item[0] for item in list(reader)]

    def __del__(self):
        self.connection.close()

    def get_countries(self):
        pass

    def get_single_quiz(self, countries: List[str], indicators: List[str]):
        cursor = self.connection.cursor()
        countries_formatted = "'" + "','".join(countries) + "'"
        indicators_formatted = "'" + "','".join(indicators) + "'"
        print(countries_formatted)

        query = f'select "Indicator Code", "Country Code", "Year", "Value" from "Data"' \
                f'where "Country Code" in ({countries_formatted}) and "Indicator Code" in ({indicators_formatted})' \
                f'order by "Country Code", "Indicator Code", "Year"'

        cursor.execute(query)
        print(cursor.fetchall())


if __name__ == '__main__':
    quiz_generator = QuizGenerator()
    quiz_generator.get_single_quiz(['ARG', 'BRA'], ['SP.POP.TOTL'])