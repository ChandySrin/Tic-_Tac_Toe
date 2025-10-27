from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/choicesPage", methods=["GET","POST"])
def choices():
    return render_template("choicesPage.html")

@app.route("/player", methods=(["GET","POST"]))
def player():
    return render_template("player3x3.html")

@app.route("/player5x5", methods=(["GET","POST"]))
def players():
    return render_template("player5x5.html")

@app.route("/player7x7", methods=(["GET","POST"]))
def player7x7():
    return render_template("player7x7.html")

if __name__ == "__main__":
    app.run(debug=True)
