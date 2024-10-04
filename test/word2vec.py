from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity

# Load PhoBERT model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
model = AutoModel.from_pretrained("vinai/phobert-base")

# Function to get sentence embedding from PhoBERT
def get_sentence_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state
    sentence_embedding = embeddings[:, 0, :]  # CLS token
    return sentence_embedding

# Define sentences to compare
sentence1 = "Tôi thích ăn phở"
sentence2 = "Tôi thích ăn cơm"
sentence3 = "Thời tiết hôm nay rất đẹp"

# Get embeddings
embedding1 = get_sentence_embedding(sentence1)
embedding2 = get_sentence_embedding(sentence2)
embedding3 = get_sentence_embedding(sentence3)

# Convert to numpy arrays
embedding1_np = embedding1.numpy()
embedding2_np = embedding2.numpy()
embedding3_np = embedding3.numpy()

# Compute cosine similarities
similarity_1_2 = cosine_similarity(embedding1_np, embedding2_np)
similarity_1_3 = cosine_similarity(embedding1_np, embedding3_np)
similarity_2_3 = cosine_similarity(embedding2_np, embedding3_np)

# Print results
print(f"Similarity between sentence 1 and 2: {similarity_1_2}")
print(f"Similarity between sentence 1 and 3: {similarity_1_3}")
print(f"Similarity between sentence 2 and 3: {similarity_2_3}")
