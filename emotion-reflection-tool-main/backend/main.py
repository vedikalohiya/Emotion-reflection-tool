from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import random
import re
from typing import Dict, List, Optional
import sqlite3
from datetime import datetime
import os

app = FastAPI(
    title="Emotion Reflection API",
    description="An API that analyzes emotional content in text reflections.",
    version="1.0.0"
)

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Database Setup
DB_NAME = "reflections.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS reflections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            emotion TEXT NOT NULL,
            confidence REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class Reflection(BaseModel):
    text: str
    
    @field_validator('text')
    @classmethod
    def text_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Text cannot be empty')
        if len(v.strip()) < 3:
            raise ValueError('Text must be at least 3 characters long')
        return v.strip()

class EmotionResponse(BaseModel):
    emotion: str
    confidence: float
    description: str
    suggestions: List[str]
    quote: Optional[str] = None

class HistoryItem(BaseModel):
    id: int
    text: str
    emotion: str
    confidence: float
    timestamp: str

# Enhanced emotion detection with keyword mapping
EMOTION_KEYWORDS = {
    "happy": ["happy", "joy", "great", "awesome", "amazing", "wonderful", "fantastic", "love", "excited", "thrilled"],
    "sad": ["sad", "down", "depressed", "upset", "hurt", "disappointed", "heartbroken", "miserable", "blue"],
    "angry": ["angry", "mad", "furious", "irritated", "annoyed", "frustrated", "rage", "hate", "pissed"],
    "anxious": ["anxious", "worried", "nervous", "stressed", "panic", "fear", "scared", "overwhelmed", "tense"],
    "calm": ["calm", "peaceful", "relaxed", "serene", "tranquil", "content", "balanced", "zen", "mindful"],
    "excited": ["excited", "enthusiastic", "pumped", "energetic", "eager", "thrilled", "hyped", "motivated"]
}

EMOTION_DESCRIPTIONS = {
    "happy": "You're experiencing positive emotions and joy!",
    "sad": "You seem to be going through some difficult emotions.",
    "angry": "You're feeling frustrated or upset about something.",
    "anxious": "You appear to be experiencing worry or stress.",
    "calm": "You're in a peaceful and balanced state of mind.",
    "excited": "You're feeling energetic and enthusiastic!"
}

EMOTION_SUGGESTIONS = {
    "happy": ["Keep doing what makes you happy!", "Share your joy with others", "Practice gratitude"],
    "sad": ["It's okay to feel sad sometimes", "Consider talking to someone", "Try some self-care activities"],
    "angry": ["Take deep breaths", "Try physical exercise to release tension", "Consider what's triggering your anger"],
    "anxious": ["Practice breathing exercises", "Try meditation or mindfulness", "Break down worries into manageable steps"],
    "calm": ["Maintain this peaceful state", "Practice mindfulness regularly", "Share your calmness with others"],
    "excited": ["Channel your energy positively", "Share your enthusiasm", "Make plans to pursue your interests"]
}

EMOTION_QUOTES = {
    "happy": "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
    "sad": "Sadness flies away on the wings of time. - Jean de La Fontaine",
    "angry": "For every minute you remain angry, you give up sixty seconds of peace of mind. - Ralph Waldo Emerson",
    "anxious": "Nothing diminishes anxiety faster than action. - Walter Anderson",
    "calm": "Calmness is the cradle of power. - Josiah Gilbert Holland",
    "excited": "Enthusiasm is the yeast that makes your hopes shine to the stars. - Henry Ford"
}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Emotion Reflection API is running"}

@app.post("/analyze", response_model=EmotionResponse)
async def analyze_emotion(reflection: Reflection):
    """Analyze a reflection and return emotion analysis with suggestions."""
    try:
        text_lower = reflection.text.lower()
        
        # Score emotions based on keyword matches
        emotion_scores = {}
        for emotion, keywords in EMOTION_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        # If no keywords match, use random selection
        if not emotion_scores:
            detected_emotion = random.choice(list(EMOTION_KEYWORDS.keys()))
            confidence = round(random.uniform(0.3, 0.6), 2)
        else:
            # Select emotion with highest score
            detected_emotion = max(emotion_scores, key=emotion_scores.get)
            max_score = emotion_scores[detected_emotion]
            # Calculate confidence based on keyword matches
            confidence = min(0.95, 0.6 + (max_score * 0.1))
            confidence = round(confidence, 2)
        
        emotion_title = detected_emotion.title()
        
        # Save to DB
        try:
            conn = sqlite3.connect(DB_NAME)
            c = conn.cursor()
            c.execute('INSERT INTO reflections (text, emotion, confidence) VALUES (?, ?, ?)',
                      (reflection.text, emotion_title, confidence))
            conn.commit()
            conn.close()
        except Exception as db_err:
            # print(f"Database error: {db_err}")
            pass
            # Continue even if DB save fails, but log it

        return EmotionResponse(
            emotion=emotion_title,
            confidence=confidence,
            description=EMOTION_DESCRIPTIONS[detected_emotion],
            suggestions=EMOTION_SUGGESTIONS[detected_emotion],
            quote=EMOTION_QUOTES.get(detected_emotion)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing emotion: {str(e)}")

@app.get("/history", response_model=List[HistoryItem])
async def get_history():
    """Retrieve past reflections from the database."""
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute('SELECT id, text, emotion, confidence, timestamp FROM reflections ORDER BY timestamp DESC LIMIT 50')
        rows = c.fetchall()
        conn.close()
        
        return [
            HistoryItem(
                id=row['id'],
                text=row['text'],
                emotion=row['emotion'],
                confidence=row['confidence'],
                timestamp=row['timestamp']
            ) for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")