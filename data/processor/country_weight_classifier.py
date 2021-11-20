import csv

import pandas as pd
import psycopg2
from typing import List

from config import config


def get_weight(population):
    if population is None:
        return 1
    return 3 if population > 40_000_000 else 2 if population > 5_000_000 else 1


def get_countries_weights():
    connection = psycopg2.connect(**config())
    cursor = connection.cursor()

    with open('./supported_countries.csv', newline='') as file:
        reader = csv.reader(file)
        supported_countries = [item[0] for item in list(reader)]

        query = f'select "Country Code", "Value" from "Data"' \
                f"""where "Indicator Code" = 'SP.POP.TOTL'""" \
                f"""and "Year" = '2016' order by "Country Code" """

        cursor.execute(query)
        return [[record[0], get_weight(record[1])] for record in cursor.fetchall()]


if __name__ == '__main__':
    weights = get_countries_weights()
    weights_df = pd.DataFrame(weights, columns=['Country Code', 'Weight'])
    weights_df.to_csv('./supported_countries_weights.csv', index=False, quoting=csv.QUOTE_NONE, header=False)
