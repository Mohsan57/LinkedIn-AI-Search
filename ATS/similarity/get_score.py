# from typing import List

# from qdrant_client import QdrantClient, models
# from qdrant_client.http.models import Batch

# client = QdrantClient(":memory:")
# client.set_model("BAAI/bge-base-en-v1.5")
# client.set_model("BAAI/bge-large-en-v1.5")
# client.set_model("sentence-transformers/paraphrase-multilingual-mpnet-base-v2")


def get_score(resume_string, job_description_string):
    print("Started getting similarity score")

    documents: List[str] = [resume_string]
    client.add(
        collection_name="demo_collection",
        documents=documents,
    )

    search_result = client.query(
        collection_name="demo_collection", query_text=job_description_string
    )
    print("Finished getting similarity score")
    return search_result


# def get_similarity_score(resume_dict, job_dict):
#     # To give your custom resume use this code
#     resume_keywords = resume_dict["extracted_keywords"]
#     job_description_keywords = job_dict["extracted_keywords"]

#     resume_string = " ".join(resume_keywords)
#     jd_string = " ".join(job_description_keywords)
#     final_result = get_score(resume_string, jd_string)
#     score = final_result[0].score
#     return score
      
from sentence_transformers import SentenceTransformer
import torch
from sklearn.metrics.pairwise import cosine_similarity
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", device=device)

def get_similarity_score(resume_dict, job_dict):
    resume_keywords = resume_dict["extracted_keywords"]
    job_description_keywords = job_dict["extracted_keywords"]

    resume_text = " ".join(resume_keywords)
    job_text = " ".join(job_description_keywords)

    # Load a pre-trained BERT-based model

    # Encode resume and job description
    resume_embedding = model.encode(resume_text, convert_to_tensor=False).reshape(1, -1)
    job_embedding = model.encode(job_text, convert_to_tensor=False).reshape(1, -1)


    # Compute cosine similarity between the embeddings
    similarity_score = cosine_similarity(resume_embedding, job_embedding)
    
    return similarity_score[0][0]