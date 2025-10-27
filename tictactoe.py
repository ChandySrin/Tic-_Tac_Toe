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

if __name__ == "__main__":
    app.run(debug=True)
