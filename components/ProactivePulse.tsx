import React, { useState, useEffect } from 'react';
import { ProactiveAdvice } from '../types';
import { Sparkles, Brain, Zap, X, ShieldCheck, Heart, Clock, Lightbulb, TrendingUp } from 'lucide-react';

interface ProactivePulseProps {
  advice: ProactiveAdvice[];
  personaName?: string;
  onDismiss: (id: string) => void;
}

const ProactivePulse: React.FC<ProactivePulseProps> = ({ advice, personaName, onDismiss }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (advice.length === 0) return;
    
    // Auto-hiding feature: dismiss the current advice after 10 seconds of neural decay
    const timer = setTimeout(() => {
      onDismiss(advice[index].id);
    }, 10000);

    return () => clearTimeout(timer);
  }, [advice, index, onDismiss]);

  if (advice.length === 0) return null;

  const currentAdvice = advice[index];

  const getIcon = (type: string) => {
    switch (type) {
      case 'insight': return <Brain size={18} className="text-purple-400" />;
      case 'productivity': return <TrendingUp size={18} className="text-cyan-400" />;
      case 'wellness': return <Heart size={18} className="text-rose-400" />;
      case 'reminder': return <Clock size={18} className="text-amber-400" />;
      default: return <Lightbulb size={18} className="text-amber-400" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'insight': return 'border-purple-500/30 shadow-purple-500/10';
      case 'productivity': return 'border-cyan-500/30 shadow-cyan-500/10';
      case 'wellness': return 'border-rose-500/30 shadow-rose-500/10';
      default: return 'border-amber-500/30 shadow-amber-500/10';
    }
  };

  return (
    <div className="fixed top-24 right-6 z-[200] w-full max-w-[20rem] sm:max-w-[22rem] animate-in slide-in-from-right duration-700 font-sans">
      <div className={`glass-card p-6 rounded-[2.5rem] border ${getColorClass(currentAdvice.type)} shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 bg-black/40 backdrop-blur-3xl`}>
        {/* Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                 {getIcon(currentAdvice.type)}
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">Neural Idea Synthesis</span>
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Protocol: {personaName || 'Core'}</span>
               </div>
            </div>
            <button 
              onClick={() => onDismiss(currentAdvice.id)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-white/5 transition-all"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-[13px] font-black uppercase tracking-tight dark:text-white text-slate-900 leading-tight">
              {currentAdvice.title}
            </h4>
            <p className="text-[10px] font-medium leading-relaxed dark:text-slate-400 text-slate-600 border-l-2 border-white/10 pl-3">
              {currentAdvice.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
             <div className="flex items-center gap-1">
                {advice.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-amber-400' : 'w-1 bg-white/10'}`} />
                ))}
             </div>
             {advice.length > 1 && index < advice.length - 1 && (
               <button onClick={() => setIndex(prev => prev + 1)} className="text-[8px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1 hover:underline">
                 Next Fragment <Zap size={10} />
               </button>
             )}
          </div>
        </div>
        
        {/* 10-Second Decay Bar (Auto-hiding visual) */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
          <div className="h-full bg-amber-400/40 animate-[decay_10s_linear_forwards]" />
        </div>
      </div>

      <style>{`
        @keyframes decay {
          0% { width: 100%; opacity: 1; }
          100% { width: 0%; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default ProactivePulse;