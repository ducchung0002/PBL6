import pickle

from pyvi.ViTokenizer import ViTokenizer
import re
import os

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

STOPWORDS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vietnamese-stopwords-dash.txt')
MODEL_CKP = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Text_GRU_model.keras')
TOKENIZER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tokenizer.pickle')
model = load_model(MODEL_CKP)
SEQUENCE_LENGTH = 100
with open(TOKENIZER_PATH, 'rb') as handle:
    tokenizer = pickle.load(handle)

with open(STOPWORDS, "r", encoding="utf-8") as ins:
    stopwords = []
    for line in ins:
        dd = line.strip('\n')
        stopwords.append(dd)
    stopwords = set(stopwords)


def filter_stop_words(train_sentences, stop_words):
    new_sent = [word for word in train_sentences.split() if word not in stop_words]
    train_sentences = ' '.join(new_sent)

    return train_sentences


def deEmojify(text):
    regrex_pattern = re.compile(pattern="["
                                        u"\U0001F600-\U0001F64F"  # emoticons
                                        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                        u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                        "]+", flags=re.UNICODE)
    return regrex_pattern.sub(r'', text)


def preprocess(text, tokenized=True, lowercased=True):
    text = ViTokenizer.tokenize(text) if tokenized else text
    text = filter_stop_words(text, stopwords)
    text = deEmojify(text)
    text = text.lower() if lowercased else text
    return text


def make_features(X, tokenizer):
    X = tokenizer.texts_to_sequences(X)
    X = pad_sequences(X, maxlen=SEQUENCE_LENGTH)
    return X


def hate_speech_detection(input_text):
    text = preprocess(input_text)
    text = make_features([text], tokenizer)
    print(f"text: {text}, shape: {text.shape}")
    return model.predict(text)[0]


if __name__ == "__main__":
    input_text = "dm hát ngu vl"
    print(hate_speech_detection(input_text))
