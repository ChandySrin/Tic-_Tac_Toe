from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/P_VS_Pchoices", methods=["GET","POST"])
def choices():
    return render_template("P_VS_Pchoices.html")

@app.route("/P_VS_Cchoices", methods=["GET","POST"])
def P_VS_Cchoicess():
    return render_template("P_VS_Cchoices.html") 

@app.route("/player", methods=(["GET","POST"]))
def player3x3():
    return render_template("player3x3.html")

@app.route("/player5x5", methods=(["GET","POST"]))
def player5x5():
    return render_template("player5x5.html")

@app.route("/player7x7", methods=(["GET","POST"]))
def player7x7():
    return render_template("player7x7.html")

@app.route("/computer7x7")
def computer7x7():
    return render_template("computer7x7.html")

@app.route("/computer5x5")
def computer5x5():
    return render_template("computer5x5.html")

@app.route("/computer3x3")
def computer3x3():
    return render_template("computer3x3.html")

if __name__ == "__main__":
    app.run(debug=True)
