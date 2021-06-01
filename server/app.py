from flask import Flask
import requests

app = Flask(__name__)

WB_API_URL = 'http://api.worldbank.org/v2'
# countries for WDI db: http://api.worldbank.org/v2/sources/2/country/data?format=json
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
