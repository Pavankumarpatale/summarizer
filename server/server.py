from flask import Flask, request
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer

app = Flask(__name__)
CORS(app=app)

# Load the tokenizer and model from a local directory
tokenizer = AutoTokenizer.from_pretrained("pegasus-samsum-model")
model = AutoModelForSeq2SeqLM.from_pretrained("pegasus-samsum-model")

@app.route("/")
def hello():
    return "<p>Hello World</p>"


tokenizer = AutoTokenizer.from_pretrained("tokenizer")
pipe = pipeline("summarization", model="pegasus-samsum-model", tokenizer=tokenizer)


@app.route("/summarize/", methods=["POST"])
def summarize_wrapper():
    request_data = request.get_json()
    input_text = request_data["text"]
    config = request_data.get("config", {})

    length_penalty = config.get("length_penalty", 0.8)
    num_beams = config.get("num_beams", 8)
    max_length = config.get("max_length", 128)

    pipe = pipeline(
        "summarization",
        model="pegasus-samsum-model",
        tokenizer=tokenizer,
        length_penalty=length_penalty,
        num_beams=num_beams,
        max_length=max_length,
    )

    summary = summarize_text(input_text, pipe)
    return {"summary": summary}


def summarize_text(input_text, pipe):
    # Generate the summary
    summary = pipe(input_text, truncation=True, max_length=1024)[0]["summary_text"]
    return summary


if __name__ == "__main__":
    app.run(debug=True, port=8080)
