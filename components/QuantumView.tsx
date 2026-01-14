
import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';
import { Sparkles, Brain, Zap, Send, Info, Layers, Maximize2, Copy, Share2 } from 'lucide-react';

interface QuantumViewProps {
  messages: Message[];
  onSend: (text: string) => void;
  isLoading: boolean;
}

const QuantumView: React.FC<QuantumViewProps> = ({ messages, onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const parseQuantumResponse = (text: string) => {
    const parts = text.split(/\[(Analytical|Creative|Concise)\]:/g).filter(p => p.trim());
    const result: Record<string, string> = {
      Analytical: "Processing...",
      Creative: "Synthesizing...",
      Concise: "Summarizing..."
    };
    for (let i = 0; i < parts.length; i += 2) {
      const key = parts[i];
      const val = parts[i+1];
      if (key && val) result[key] = val.trim();
    }
    return result;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-[#020205] relative font-sans transition-colors duration-500">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 pb-28 md:pb-24 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 space-y-4 sm:space-y-6 animate-in fade-in duration-1000">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-violet-500/30 flex items-center justify-center animate-spin-slow">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-violet-400/50" />
              </div>
              {/* Fix: removed invalid sm:size prop */}
              <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-400 animate-pulse" size={32} />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-base sm:text-lg font-black tracking-[0.2em] text-violet-400 uppercase">Superposition Active</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed">
                Query split into three logical timelines.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-3 sm:space-y-4">
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl sm:rounded-2xl rounded-tr-none px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-medium max-w-[90%] sm:max-w-[85%] shadow-xl border border-white/10 group relative text-white">
                   <button onClick={() => handleCopy(msg.parts[0].text || '')} className="absolute top-1 right-1 p-1 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Copy size={8} />
                   </button>
                  {msg.parts[0].text}
                  <div className="mt-1 text-right">
                     <span className="text-[8px] font-medium tracking-tight uppercase text-white/40">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                  <span className="text-[8px] sm:text-[9px] font-black text-violet-500 tracking-[0.2em] sm:tracking-[0.3em] uppercase">Result</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                </div>
                
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {Object.entries(parseQuantumResponse(msg.parts[0].text || '')).map(([type, text]) => (
                    <div key={type} className={`glass-card rounded-xl sm:rounded-2xl flex flex-col h-full border-white/5 relative overflow-hidden group transition-all duration-500 hover:border-violet-500/30 ${
                      type === 'Analytical' ? 'bg-blue-500/5' : 
                      type === 'Creative' ? 'bg-pink-500/5' : 
                      'bg-emerald-500/5'
                    }`}>
                      <div className={`p-1.5 sm:p-2 border-b border-white/5 flex flex-col items-center gap-0.5 sm:gap-1 ${
                        type === 'Analytical' ? 'text-blue-400' : 
                        type === 'Creative' ? 'text-pink-400' : 
                        'text-emerald-400'
                      }`}>
                        {/* Fix: removed invalid sm:size props */}
                        {type === 'Analytical' ? <Brain size={14} className="animate-pulse" /> : 
                         type === 'Creative' ? <Sparkles size={14} className="animate-pulse" /> : 
                         <Zap size={14} className="animate-pulse" />}
                        <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tight">{type}</span>
                      </div>
                      
                      <div className="p-1.5 sm:p-2 flex-1 min-h-[100px] sm:min-h-[140px] relative">
                        <p className="text-[9px] sm:text-[10px] leading-relaxed text-slate-900 dark:text-slate-300 font-medium">
                          {text}
                        </p>
                        <button onClick={() => handleCopy(text)} className="absolute bottom-1 right-1 p-1 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Copy size={8} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-start px-1 sm:px-2">
                   <span className="text-[8px] font-light tracking-[0.1em] uppercase text-[#A9AFB2]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card rounded-xl sm:rounded-2xl h-32 sm:h-48 animate-pulse border-white/5" />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 absolute bottom-0 left-0 w-full glass-card border-x-0 border-b-0 rounded-t-[1.8rem] sm:rounded-t-[2.5rem] z-20 md:static md:rounded-none md:border-t">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-1 sm:px-2">
          <Info size={10} className="text-violet-500" />
          <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 tracking-widest uppercase">Logic Stream Active</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Triton query..."
            className="flex-1 bg-slate-900/10 dark:bg-slate-900/80 border border-violet-500/20 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-5 text-[12px] sm:text-[13px] font-medium focus:outline-none focus:border-violet-500/50 transition-all text-black dark:text-violet-100 placeholder:text-slate-600"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${!input.trim() || isLoading ? 'bg-slate-800 text-slate-600' : 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg'}`}
          >
            {/* Fix: removed invalid sm:size prop */}
            <Send size={22} />
          </button>
        </form>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default QuantumView;
