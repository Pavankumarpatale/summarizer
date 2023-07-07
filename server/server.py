from flask import Flask, request
from flask_cors import CORS
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

app = Flask(__name__)
CORS(app=app)

# Load the tokenizer and model from a local directory
tokenizer = AutoTokenizer.from_pretrained("pegasus-samsum-model")
model = AutoModelForSeq2SeqLM.from_pretrained("pegasus-samsum-model")

@app.route("/")
def hello():
    return "<p>Hello World</p>"

@app.route("/summarize/", methods=["POST"])
def summarize_wrapper():
    text = request.form.get("text")
    return summarize_text(text)

def summarize_text(input_text):
    # Tokenize the input text
    input_ids = tokenizer.encode(input_text, truncation=True, max_length=1024, return_tensors="pt")

    # Generate the summary
    summary_ids = model.generate(input_ids.to(model.device))

    # Decode the summary
    summarized_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summarized_text

if __name__ == "__main__":
    app.run(debug=True, port=8080)
