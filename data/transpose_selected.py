#!/usr/bin/python
import psycopg2
from config import config
import pandas as pd
import numpy as np

WDI_COLS = [
    'Country Name',
    'Country Code',
    'Indicator Name',
    'Indicator Code',
    '1960',
    '1961',
    '1962',
    '1963',
    '1964',
    '1965',
    '1966',
    '1967',
    '1968',
    '1969',
    '1970',
    '1971',
    '1972',
    '1973',
    '1974',
    '1975',
    '1976',
    '1977',
    '1978',
    '1979',
    '1980',
    '1981',
    '1982',
    '1983',
    '1984',
    '1985',
    '1986',
    '1987',
    '1988',
    '1989',
    '1990',
    '1991',
    '1992',
    '1993',
    '1994',
    '1995',
    '1996',
    '1997',
    '1998',
    '1999',
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    'remarks'
]

SUPPORTED_COUNTRIES = [
    'ARE',
    'ARG',
    'AUS',
    'AUT',
    'BEL',
    'BGD',
    'BGR',
    'BLR',
    'BRA',
    'CAN',
    'CHE',
    'CHL',
    'CHN',
    'COL',
    'CZE',
    'DEU',
    'DNK',
    'EGY',
    'ESP',
    'EST',
    'EUU',
    'FIN',
    'FRA',
    'GBR',
    'GRC',
    'HRV',
    'HUN',
    'IND',
    'ISR',
    'ITA',
    'JPN',
    'KEN',
    'KOR',
    'LTU',
    'LVA',
    'MDG',
    'MEX',
    'MLT',
    'MOZ',
    'NGA',
    'NLD',
    'NOR',
    'NZL',
    'PAK',
    'PHL',
    'POL',
    'PRT',
    'RUS',
    'SVN',
    'TZA',
    'UKR',
    'USA',
    'VEN',
    'VNM',
    'WLD'
]


SUPPORTED_METRICS = [
    'NY.GDP.MKTP.KD.ZG',  # GDP growth
    'NY.GDP.MKTP.CD',  # GDP (current US$)
    'SP.POP.TOTL',  # Population, total
    'SP.POP.GROW',  # Population growth (annual %)
    'SE.SEC.ENRR',  # School enrollment, secondary (% gross)
    'SE.XPD.TOTL.GD.ZS',  # Govt expenditure on education (% of GDP)
    'SP.RUR.TOTL.ZS',  # Rural population (% of total population)
    'SP.URB.TOTL.IN.ZS',  # Urban population (% of total population)
    'AG.LND.CROP.ZS',  # Permanent cropland (% of land area)

]


def parse():
    conn = None
    try:
        params = config()
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        cur = conn.cursor()

        delete_from_data_statement = 'delete from "Data" where "Country Code" is not null;'
        cur.execute(delete_from_data_statement)

        for i in range(0, len(SUPPORTED_METRICS)):
            select_query = 'select * from "WDIData" where "Indicator Code" = \'%s\' and "Country Code" in (%s);' % (
                SUPPORTED_METRICS[i], str(SUPPORTED_COUNTRIES).replace('[', '').replace(']', '')
            )
            cur.execute(select_query)
            fetched_records = cur.fetchall()
            for record in fetched_records:
                df = pd.DataFrame(index=WDI_COLS).transpose()
                df = df.append(pd.Series(record, index=WDI_COLS), ignore_index=True)

                values = df.loc[:, '1960':'2020'].transpose()
                values.replace('', 'null', inplace=True)

                insert_statement = ''
                for idx, row in values.iterrows():
                    insert_statement += "insert into \"Data\" values ('%s', '%s', '%s', '%s', %s, %s);\n" % (record[0].replace("'", "''"), record[1], record[2].replace("'", "''"), record[3], idx, row[0])
                    
                # print(insert_statement)
                cur.execute(insert_statement)
            print('%s processed, %d metrics left to process' % (record[3], len(SUPPORTED_METRICS) - i - 1))
            conn.commit()

        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


if __name__ == '__main__':
    parse()
