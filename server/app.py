from flask import Flask
import requests

app = Flask(__name__)

WB_API_URL = 'http://api.worldbank.org/v2'
# countries for WDI db: http://api.worldbank.org/v2/sources/2/country/data?format=json

with open('../server/config/supported_countries.csv', newline='') as file:
    reader = csv.reader(file)
    SUPPORTED_COUNTRIES = [item[0] for item in list(reader)]

with open('../server/config/supported_metrics.csv', newline='') as file:
    reader = csv.reader(file)
    SUPPORTED_METRICS = [item[0] for item in list(reader)]


@app.route('/')
def info():
    # return str(wb.source.info())
    return get_metric('POL')


def get_metric(country: str):
    # timeframe = 'all'
    # timeframe = '2000:2020'
    timeframe = 'YTD'
    params = {'format': 'json'}
    # url = WB_API_URL + '/sources/2/country/%s/series/NY.GDP.MKTP.KD.ZG/time/%s?format=json' % (country, timeframe)
    url = WB_API_URL + '/sources/2/country/%s/series/NY.GDP.MKTP.KD.ZG?date=%s' % (country, timeframe)
    res = requests.get(url, params)
    print('Sending GET to %s' % res.url)

    data = res.json()
    return data


if __name__ == '__main__':
    app.run()
