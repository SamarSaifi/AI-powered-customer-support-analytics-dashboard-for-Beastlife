from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS (keep at top)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "API is running 🚀"}

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