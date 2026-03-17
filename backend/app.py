from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    text: str

@app.post("/analyze")
def analyze_query(query: Query):
    text = query.text.lower()

    if "refund" in text:
        category = "Refund"
    elif "delay" in text:
        category = "Delivery Issue"
    elif "broken" in text:
        category = "Damaged Product"
    else:
        category = "Other"

    return {"category": category}