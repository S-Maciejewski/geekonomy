import csv

import psycopg2

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

    def get_single_quiz(self):
        cursor = self.connection.cursor()
        #  select "Indicator Code", "Country Code", "Year", "Value"
        #                                                      from "Data"
        #                                                      where "Country Code" in ('${countries.join("','")}')
        #                                                        and "Indicator Code" in ('${indicators.join("','")}')
        #                                                      order by "Country Code", "Indicator Code", "Year";

        # TODO: translate query
        # cursor.execute('');
