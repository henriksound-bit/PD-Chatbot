from flask import Flask, render_template, url_for, request, jsonify
import numpy as np
import json
import torch
from transformers import pipeline
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Initialize chat pipeline from HF model
# chatbot = pipeline("conversational", model="llSourcell/medllama2_7b")
# Route to index.html
@app.route('/')
def index():
    return render_template('index.html')

# Route to "How to Use" page
@app.route('/usage')
def how_to_use():
    return render_template('usage.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route("/get", methods=["POST"])
def test_bot_response():
    userText = request.form.get('msg')
    app.logger.debug(f"Received message: {userText}")  # Log received message
    return jsonify({'response': 'Praesent varius, odio venenatis fermentum tristique, nisl metus feugiat risus, in mollis velit velit ac neque. Donec tincidunt venenatis velit, at lacinia enim ornare eget. Ut sit amet malesuada arcu, sit amet ullamcorper risus. Praesent finibus pellentesque cursus. Nunc a purus sem. Duis fermentum pretium enim vitae malesuada. Etiam dignissim aliquam turpis, vitae accumsan quam rutrum sed. Maecenas porta elementum tempus. Pellentesque tristique tortor id tellus euismod, nec tempor mi rhoncus.'})


# TODO: Add route to get pump/injection data as JSON
@app.route("/save_data", methods=["POST"])
def save_date():
    data = request.form.get('data')
    app.logger.debug(f"Received data: {data}")  # Log received message
    json_data = json.loads(data)

    return jsonify({"message": "Data received"})

# @app.route("/get", methods=["POST"])
# def get_bot_response():
#     userText = request.form['msg']
#     # Using the chatbot pipeline to get the model's response
#     bot_response = chatbot(userText)[0]['generated_text']
#     # We'll return a JSON object for ease of use on the client side
#     return jsonify({'response': bot_response})


if __name__ == "__main__":
    app.run(debug=True)
