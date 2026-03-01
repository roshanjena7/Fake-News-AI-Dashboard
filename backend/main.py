from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
import pickle
import re
import requests
import os
import hashlib

from database import SessionLocal, User


# ================= CONFIG =================

SECRET_KEY = "secret123"
ALGORITHM = "HS256"

NEWS_API_KEY = "YOUR_NEWSAPI_KEY"   # Put your key here


# ================= APP =================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================= PASSWORD HASH =================

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str):
    return hash_password(password) == hashed


# ================= LOAD MODEL =================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model loading failed:", e)
    model = None


# ================= MODELS =================

class News(BaseModel):
    text: str


class Login(BaseModel):
    username: str
    password: str


# ================= TOKEN =================

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=2)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# ================= TEXT =================

def clean_text(text):
    text = re.sub(r'[^a-zA-Z ]', '', text)
    return text.lower()


def important_words(text):
    return text.split()[:5]


# ================= HOME =================

@app.get("/")
def home():
    return {"message": "Fake News AI Backend Running 🚀"}


# ================= REGISTER =================

@app.post("/register")
def register(user: Login):

    db = SessionLocal()

    existing = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)

    new_user = User(
        username=user.username,
        password=hashed,
        role="user"
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created successfully"}


# ================= LOGIN =================

@app.post("/login")
def login(user: Login):

    db = SessionLocal()

    db_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({
        "sub": db_user.username,
        "role": db_user.role
    })

    return {
        "token": token,
        "role": db_user.role
    }


# ================= PREDICT =================

@app.post("/predict")
def predict(news: News):

    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    cleaned = clean_text(news.text)

    try:
        pred = model.predict([cleaned])[0]
        prob = model.predict_proba([cleaned])[0]

        confidence = round(max(prob) * 100, 2)

        explanation = (
            "This news appears suspicious due to exaggerated or misleading language."
            if pred == 0 else
            "The content appears factual with neutral tone."
        )

        return {
            "prediction": "Real" if pred == 1 else "Fake",
            "confidence": confidence,
            "keywords": important_words(news.text),
            "probabilities": prob.tolist(),
            "explanation": explanation
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ================= LIVE NEWS =================

@app.get("/live-news")
def live_news():

    if NEWS_API_KEY == "YOUR_NEWSAPI_KEY":
        return {"error": "Add your NewsAPI key in backend"}

    url = f"https://newsapi.org/v2/top-headlines?country=us&apiKey={NEWS_API_KEY}"

    try:
        data = requests.get(url).json()

        headlines = []

        for article in data.get("articles", []):
            headlines.append(article["title"])

        return {"headlines": headlines}

    except Exception as e:
        return {"error": str(e)}


# ================= ADMIN: GET USERS =================

@app.get("/admin/users")
def get_users():

    db = SessionLocal()

    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "username": u.username,
            "role": u.role
        }
        for u in users
    ]


# ================= ADMIN: DELETE USER =================

@app.delete("/admin/delete/{user_id}")
def delete_user(user_id: int):

    db = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if user:
        db.delete(user)
        db.commit()

    return {"message": "User deleted"}