import React from 'react';
import { motion } from 'framer-motion';
import { History, Clock, X } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: isOpen ? 0 : -300, opacity: isOpen ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 w-80 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-2xl z-50 p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2">
          <History className="w-6 h-6 text-purple-600" />
          History
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-black/5 rounded-full transition-colors md:hidden"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center italic mt-10">No reflections yet.</p>
        ) : (
          history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                   item.emotion === 'Happy' ? 'bg-green-100 text-green-700' :
                   item.emotion === 'Sad' ? 'bg-blue-100 text-blue-700' :
                   item.emotion === 'Angry' ? 'bg-red-100 text-red-700' :
                   item.emotion === 'Anxious' ? 'bg-orange-100 text-orange-700' :
                   item.emotion === 'Calm' ? 'bg-teal-100 text-teal-700' :
                   'bg-gray-100 text-gray-700'
                }`}>
                  {item.emotion}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{item.text}</p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default HistorySidebar;
