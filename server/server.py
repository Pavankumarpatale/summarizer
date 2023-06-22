from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app=app)


@app.route("/")
def hello():
    return "<p>Hello World</p>"


if __name__ == "__main__":
    app.run(debug=True, port=8080)
