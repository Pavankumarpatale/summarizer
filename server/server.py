from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__)
CORS(app=app)


@app.route("/")
def hello():
    return "<p>Hello World</p>"


def split_string_by_length(string, length):
    string_buf = ""
    split_list = string.split(".")
    res = []
    for i in split_list:
        if len(i) > length - 2:
            # If the sentence is longer than the specified length,
            # split it into smaller chunks of length `length - 2`
            chunks = [i[j : j + length - 2] for j in range(0, len(i), length - 2)]
            for chunk in chunks:
                res.append(chunk.strip() + ".")
        elif len(i) + len(string_buf) > length - 2:
            res.append(string_buf.strip())
            string_buf = i + ". "
        else:
            string_buf += i + ". "
    res.append(string_buf)
    return res


# Load the tokenizer and model from a local directory
model = AutoModelForSeq2SeqLM.from_pretrained("pegasus-samsum-model")
tokenizer = AutoTokenizer.from_pretrained("tokenizer")
pipe = pipeline("summarization", model="pegasus-samsum-model", tokenizer=tokenizer)


@app.route("/summarize/", methods=["POST"])
def summarize_wrapper():
    request_data = request.get_json()
    input_text = request_data["text"]
    batches = split_string_by_length(input_text, 1024)

    config = request_data.get(
        "config",
        jsonify({"max_length": 512, "num_beams": 8, "length_penalty": 1.2}),
    )

    pipe = pipeline("summarization", model="pegasus-samsum-model", tokenizer=tokenizer)
    summary_list = []
    for string in batches:
        summary_list.append(pipe(string, **config)[0]["summary_text"])
    summary = ""
    for i in summary_list:
        summary += i
    return {"summary": summary}


if __name__ == "__main__":
    app.run(debug=False, port=8080)
