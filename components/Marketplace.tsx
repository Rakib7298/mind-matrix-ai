
import React, { useState, useEffect } from 'react';
import { Search, Download, ThumbsUp, GitFork, X, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { Persona } from '../types';

interface CommunityPersona {
  id: string;
  name: string;
  icon: string;
  rating: number;
  users: string;
  type: string;
  color: string;
  systemInstruction: string;
  model: string;
}

interface MarketplaceProps {
  onFork: (newPersona: Persona) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onFork }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Forking Process State
  const [isForking, setIsForking] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<CommunityPersona | null>(null);
  const [forkedName, setForkedName] = useState('');
  const [forkedDescription, setForkedDescription] = useState('');
  
  const [myForks, setMyForks] = useState<Persona[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('matrix_custom_personas');
    if (saved) setMyForks(JSON.parse(saved));
  }, []);

  const categories = ['All', 'Creative', 'Utility', 'Gaming', 'Writing'];

  const communityPersonas: CommunityPersona[] = [
    { id: 'c1', name: "Code Assistant", icon: "💻", rating: 4.9, users: "12k", type: "Utility", color: "from-orange-500 to-red-600", model: 'gemini-3-flash-preview', systemInstruction: 'You are a senior coding expert.' },
    { id: 'c2', name: "Story Writer", icon: "📚", rating: 4.8, users: "8k", type: "Creative", color: "from-pink-500 to-rose-700", model: 'gemini-3-flash-preview', systemInstruction: 'You are a creative writer.' },
    { id: 'c3', name: "Music Guru", icon: "🎵", rating: 4.7, users: "5k", type: "Creative", color: "from-indigo-500 to-blue-700", model: 'gemini-3-flash-preview', systemInstruction: 'You are a music theory expert.' },
    { id: 'c4', name: "Dungeon Master", icon: "⚔️", rating: 5.0, users: "15k", type: "Gaming", color: "from-red-500 to-orange-700", model: 'gemini-3-flash-preview', systemInstruction: 'You are a tabletop RPG game master.' },
  ];

  const handleForkInitiate = (p: CommunityPersona) => {
    setSelectedPersona(p);
    setForkedName(`${p.name} (My Version)`);
    setForkedDescription(`Personalized version of ${p.name}.`);
    setIsForking(true);
  };

  const handleConfirmFork = () => {
    if (!selectedPersona) return;
    const newPersona: Persona = {
      id: `custom_${Date.now()}`,
      name: forkedName,
      description: forkedDescription,
      icon: selectedPersona.icon,
      color: selectedPersona.color,
      model: selectedPersona.model,
      systemInstruction: `${selectedPersona.systemInstruction}\n\nNotes: ${forkedDescription}`,
      isCustom: true,
      basePersonaId: selectedPersona.id
    };
    onFork(newPersona);
    setMyForks(prev => [newPersona, ...prev]);
    setIsForking(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-5 space-y-6 sm:space-y-8 pb-24 md:pb-8 relative">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Fix: removed invalid sm:size prop */}
          <ShoppingBag size={20} className="text-emerald-400" />
          <h2 className="font-orbitron text-lg sm:text-xl font-black text-emerald-400 tracking-tighter uppercase">AI STORE</h2>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-focus-within:bg-emerald-500/10 transition-all rounded-3xl" />
        {/* Fix: removed invalid sm:size prop */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
        <input 
          placeholder="Search models..."
          className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[1.2rem] sm:rounded-[1.5rem] py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-[13px] sm:text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all relative z-10"
        />
      </div>

      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] font-black tracking-widest uppercase transition-all border ${
              activeCategory === cat 
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'glass-card border-white/10 text-slate-400 hover:border-emerald-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4 sm:space-y-5">
        <h3 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Trending Models</h3>
        {communityPersonas.map((p, idx) => (
          <div key={idx} className="glass-card p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] flex items-center gap-4 sm:gap-5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.4rem] bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl sm:text-3xl text-white shadow-xl group-hover:rotate-6 transition-all`}>
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-[14px] sm:text-[15px] tracking-tight text-white uppercase truncate">{p.name}</h4>
              <div className="flex items-center gap-3 sm:gap-4 mt-1 text-[8px] sm:text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1 text-emerald-400"><ThumbsUp size={10} /> {p.rating}</span>
                <span className="uppercase tracking-widest font-black truncate">{p.users} USERS</span>
                <span className="hidden xs:inline bg-slate-800/80 px-2 py-0.5 rounded-lg text-[8px] border border-white/5">{p.type}</span>
              </div>
            </div>
            <div className="flex gap-1.5 sm:gap-2.5">
              <button 
                onClick={() => handleForkInitiate(p)}
                className="p-2 sm:p-3 rounded-lg sm:rounded-2xl glass-card border-white/5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all active:scale-90"
                title="Copy AI"
              >
                {/* Fix: removed invalid sm:size prop */}
                <GitFork size={20} />
              </button>
              <button className="p-2 sm:p-3 rounded-lg sm:rounded-2xl glass-card border-white/5 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all active:scale-90">
                {/* Fix: removed invalid sm:size prop */}
                <Download size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isForking && selectedPersona && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
          <div className="w-full max-w-sm glass-card border-cyan-500/30 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl">
            <div className={`h-24 sm:h-28 bg-gradient-to-br ${selectedPersona.color} relative flex items-center justify-center`}>
              <div className="text-4xl sm:text-5xl drop-shadow-2xl">{selectedPersona.icon}</div>
              <button 
                onClick={() => setIsForking(false)}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 rounded-xl glass-card flex items-center justify-center text-white border-white/20 hover:bg-white/10 transition-all"
              >
                {/* Fix: removed invalid sm:size prop */}
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2">
                {/* Fix: removed invalid sm:size prop */}
                <GitFork size={18} className="text-cyan-400" />
                <h3 className="text-[12px] sm:text-sm font-black tracking-widest text-cyan-400 uppercase">Personalize AI</h3>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">AI Name</label>
                <input 
                  value={forkedName}
                  onChange={(e) => setForkedName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-[13px] sm:text-sm font-medium focus:outline-none focus:border-cyan-500/50 transition-all text-white"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Notes</label>
                <textarea 
                  value={forkedDescription}
                  onChange={(e) => setForkedDescription(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-[13px] sm:text-sm font-medium focus:outline-none focus:border-cyan-500/50 min-h-[80px] sm:min-h-[100px] transition-all text-white resize-none"
                />
              </div>

              <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
                <button 
                  onClick={() => setIsForking(false)}
                  className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl glass-card border-white/10 text-[9px] sm:text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleConfirmFork}
                  className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-lg shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
