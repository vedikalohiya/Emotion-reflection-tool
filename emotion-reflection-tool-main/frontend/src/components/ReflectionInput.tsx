import React from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

interface ReflectionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ReflectionInput: React.FC<ReflectionInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  return (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={onSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <label htmlFor="reflection" className="block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 mb-4">
                How are you feeling today?
            </label>
            
            <textarea
                id="reflection"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Share your thoughts... (e.g., 'I successfully finished a big project today!')"
                className="w-full h-40 p-4 text-lg text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none bg-gray-50 transition-all placeholder:text-gray-400"
                maxLength={1000}
                required
            />
            
            <div className="flex justify-between items-center mt-4">
                <span className={`text-sm ${value.length > 900 ? 'text-red-500' : 'text-gray-400'}`}>
                    {value.length}/1000
                </span>
                
                <button
                    type="submit"
                    disabled={isLoading || !value.trim()}
                    className={`
                        flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-purple-200
                        transition-all duration-300 transform
                        ${isLoading || !value.trim() 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-purple-300 active:translate-y-[1px]'}
                    `}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Analyze Reflection
                        </>
                    )}
                </button>
            </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ReflectionInput;
