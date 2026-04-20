import React from 'react';
import { motion } from 'framer-motion';
import { EmotionResult } from '../types';
import { Sparkles, Activity, Quote, Lightbulb, Smile, Flame, CloudRain, Wind, Rocket, Leaf } from 'lucide-react';

interface EmotionCardProps extends EmotionResult {}

const EmotionCard: React.FC<EmotionCardProps> = ({ emotion, confidence, description, suggestions, quote }) => {
  const getIcon = (emotion: string) => {
    const className = "w-20 h-20 mb-4 drop-shadow-lg";
    switch(emotion.toLowerCase()) {
      case 'happy': return <Smile className={className} />;
      case 'sad': return <CloudRain className={className} />;
      case 'angry': return <Flame className={className} />;
      case 'anxious': return <Wind className={className} />;
      case 'calm': return <Leaf className={className} />;
      case 'excited': return <Rocket className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const getColor = (emotion: string) => {
      switch(emotion.toLowerCase()) {
        case 'happy': return 'from-yellow-400 to-orange-500';
        case 'sad': return 'from-blue-400 to-indigo-500';
        case 'angry': return 'from-red-400 to-pink-600';
        case 'anxious': return 'from-orange-400 to-red-500';
        case 'calm': return 'from-teal-400 to-emerald-500';
        case 'excited': return 'from-fuchsia-500 to-purple-600';
        default: return 'from-gray-400 to-gray-600';
      }
  };

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-2xl mx-auto mt-12 mb-20"
    >
        {/* Main Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            {/* Header / Emotion Banner */}
            <div className={`bg-gradient-to-r ${getColor(emotion)} p-10 text-white text-center relative overflow-hidden`}>
                 <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                 <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10"
                 >
                     <div className="flex justify-center">{getIcon(emotion)}</div>
                     <h2 className="text-4xl font-bold mb-2">{emotion}</h2>
                     <p className="text-white/90 text-lg font-medium max-w-md mx-auto">{description}</p>
                 </motion.div>
            </div>

            <div className="p-8">
                 {/* Confidence Bar */}
                 <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Confidence Score
                        </span>
                        <span className="text-2xl font-bold text-gray-800">{(confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${getColor(emotion)}`}
                        />
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    {/* Suggestions */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Suggestions for you
                        </h3>
                        <ul className="space-y-3">
                            {suggestions.map((s, i) => (
                                <motion.li 
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="flex items-start gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                                    <span>{s}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Quote */}
                    {quote && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 flex flex-col justify-center relative">
                            <Quote className="absolute top-4 left-4 w-8 h-8 text-indigo-200" />
                            <blockquote className="relative z-10 text-center italic text-gray-700 font-medium my-4">
                                "{quote.split(' - ')[0]}"
                            </blockquote>
                            <cite className="block text-center text-sm font-bold text-indigo-500 not-italic">
                                — {quote.split(' - ')[1]}
                            </cite>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    </motion.div>
  );
};

export default EmotionCard;