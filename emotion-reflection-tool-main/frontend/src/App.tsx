import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ReflectionInput from './components/ReflectionInput';
import EmotionCard from './components/EmotionCard';
import HistorySidebar from './components/HistorySidebar';
import { EmotionResult, HistoryItem } from './types';
import { Menu } from 'lucide-react';

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      // console.error("Failed to fetch history:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResult(data);
      
      // Refresh history silently
      fetchHistory();
      
      // Scroll to result
      setTimeout(() => {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }, 100);

    } catch (err) {
        alert("Something went wrong. Please check if the backend is running.");
        // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-6 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100 text-gray-700"
      >
        <Menu className="w-6 h-6" />
      </button>

      <HistorySidebar 
        history={history} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}`}>
         <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
            
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 tracking-tight">
                    Emotion Reflection
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Uncover the hidden emotions in your words with our AI-powered analysis tool.
                </p>
            </div>

            <ReflectionInput 
                value={text} 
                onChange={setText} 
                onSubmit={handleSubmit} 
                isLoading={loading} 
            />

            {result && (
                <EmotionCard {...result} />
            )}
         </div>
      </div>
    </Layout>
  );
}

export default App;