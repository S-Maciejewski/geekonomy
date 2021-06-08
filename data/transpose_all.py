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
# TODO: take into account only relevant countries and metrics, as parsing the whole database would take approx. 260 days

def parse():
    conn = None
    try:
        params = config()
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        cur = conn.cursor()
        cur.execute('select count(*) from "WDIData"')
        data_table_len = cur.fetchone()[0]
        print('%d rows left to process' % data_table_len)

        for i in range(0, data_table_len):
            cur.execute('SELECT * from "WDIData" limit 1')
            res = cur.fetchone()

            df = pd.DataFrame(index=WDI_COLS).transpose()
            df = df.append(pd.Series(res, index=WDI_COLS), ignore_index=True)

            values = df.loc[:, '1960':'2020'].transpose()
            values.replace('', 'null', inplace=True)
            # values.dropna(0, inplace=True)

            insert_statement = ''
            for idx, row in values.iterrows():
                insert_statement += "insert into \"Data\" values ('%s', '%s', '%s', '%s', %s, %s);\n" % (res[0].replace("'", "''"), res[1], res[2].replace("'", "''"), res[3], idx, row[0])
                
            # print(insert_statement)
            cur.execute(insert_statement)
            delete_statement = "delete from \"WDIData\" where \"Country Code\" = '%s' and \"Indicator Code\" = '%s';\n" % (res[1], res[3])
            # print(delete_statement)
            cur.execute(delete_statement)
            print('%s - %s processed, %d left to process' % (res[1], res[3], data_table_len - i - 1))
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
