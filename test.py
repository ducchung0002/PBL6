# from sentence_transformers import SentenceTransformer
# import chromadb
# from chromadb.utils import embedding_functions
#
# # Load the pre-trained model from Hugging Face
# model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
#
# # Create a ChromaDB client
# client = chromadb.Client()
#
# # Create a collection with the sentence transformer embedding function
# embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="sentence-transformers/all-MiniLM-L6-v2")
# collection = client.create_collection("sentences", embedding_function=embedding_function)
#
# # Add some example sentences to the collection
# sentences = [
#     "Ngày hôm nay trời trong xanh",
#     "One tree cannot make a forest, three trees together can make a high mountain",
#     "When drinking water, remember its source",
#     "When eating fruit, remember the person who planted the tree",
#     "Learning from a teacher is not as good as learning from friends"
# ]
#
# collection.add(
#     documents=sentences,
#     ids=[f"sentence_{i}" for i in range(len(sentences))]
# )
#
# # Query the collection
# query = "Tầm quan trọng của sự đoàn kết"
# results = collection.query(
#     query_texts=[query],
#     n_results=3
# )
#
# # Display the results and distances
# print(f"Query: {query}")
# print("Results:")
# for i, (doc, distance) in enumerate(zip(results['documents'][0], results['distances'][0])):
#     print(f"{i+1}. Document: {doc}")
#     print(f"   Distance: {distance}")
#     print()


from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions

# Load the pre-trained multilingual model from Hugging Face
model = SentenceTransformer('distiluse-base-multilingual-cased-v2')

# Create a ChromaDB client
client = chromadb.Client()

# Create a collection with the sentence transformer embedding function
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="distiluse-base-multilingual-cased-v2")
collection = client.create_collection("vietnamese_sentences", embedding_function=embedding_function)

# Add some example Vietnamese sentences to the collection
sentences = [
    "Ngày hôm nay trời trong xanh",
    "Mùa thu mang giấc mơ quay về",
    "Là áng mây bên trời vội vàng ngang qua",
    "Lời tôi nhỏ bé, tiếng gió thét cao, biển tràn nỗi đau",
    "Liệu mai sau phai vội mau không bước bên cạnh nhau"
]

collection.add(
    documents=sentences,
    ids=[f"sentence_{i}" for i in range(len(sentences))]
)

# Query the collection with a Vietnamese query
query = "áng mây bên trời"
results = collection.query(
    query_texts=[query],
    n_results=3
)

# Display the results and distances
print(f"Query: {query}")
print("Results:")
for i, (doc, distance) in enumerate(zip(results['documents'][0], results['distances'][0])):
    print(f"{i+1}. Document: {doc}")
    print(f"   Distance: {distance}")
    print()