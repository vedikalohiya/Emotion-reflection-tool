# Emotion Reflection Tool 💭

An AI-powered application that helps you analyze and reflect on your emotions. Built with a modern, premium UI and robust backend analysis.

![Emotion Reflection Tool](https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=2670&auto=format&fit=crop)

## 🚀 Features

-   **Premium UI**: Glassmorphism design with dynamic gradient backgrounds.
-   **AI Analysis**: Keyword-based emotion detection with confidence scoring.
-   **History Tracking**: Locally persists your reflections using SQLite.
-   **Smart Suggestions**: Personalized advice based on your emotional state.
-   **Inspirational Quotes**: Context-aware quotes to uplift or ground you.
-   **Responsive Design**: optimized for both desktop and mobile.

## 🛠 Tech Stack

-   **Frontend**: React (TypeScript), Tailwind CSS, Framer Motion, Lucide React
-   **Backend**: FastAPI (Python), SQLite
-   **Styling**: Modern CSS3, Glassmorphism effects

## 🏁 Getting Started

### Prerequisites

-   Node.js (v16+)
-   Python (3.8+)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```
The application will open at `http://localhost:3000`.

## 📸 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
