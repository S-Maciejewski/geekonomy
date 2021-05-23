from flask import Flask
import wbgapi as wb

app = Flask(__name__)


@app.route('/')
def info():
    return str(wb.source.info())


if __name__ == '__main__':
    app.run()
