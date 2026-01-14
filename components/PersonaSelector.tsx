
import React from 'react';
import { Persona } from '../types';
import { ChevronRight, LayoutGrid, PlusCircle, Trash2, Cpu, Sparkles, Info } from 'lucide-react';

interface PersonaSelectorProps {
  personas: Persona[];
  currentPersona: Persona;
  onSelect: (p: Persona) => void;
  onDeleteCustom?: (id: string) => void;
  onCreateCustom?: () => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ personas, currentPersona, onSelect, onDeleteCustom, onCreateCustom }) => {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-10 custom-scrollbar pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
             <LayoutGrid size={20} className="text-cyan-400 flex-shrink-0" />
             <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight truncate dark:text-white text-slate-900">Choose an AI</h2>
          </div>
          <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate">Pick a helper and start chatting.</p>
        </div>
        <button 
          onClick={onCreateCustom}
          className="flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-cyan-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-cyan-500/20"
        >
          <PlusCircle size={14} /> <span className="hidden xs:inline">Create AI</span><span className="xs:hidden">Add</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {personas.map((persona) => {
          const isActive = currentPersona.id === persona.id;
          return (
            <div key={persona.id} className="relative group">
              <button
                onClick={() => onSelect(persona)}
                className={`w-full h-full flex flex-col p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] glass-card transition-all relative overflow-hidden text-left border-2 ${
                  isActive 
                    ? 'border-cyan-500/40 bg-cyan-500/10 shadow-lg scale-[1.02]' 
                    : 'border-white/5 hover:border-white/20 hover:bg-white/5 shadow-xl'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 pointer-events-none rounded-full bg-gradient-to-br ${persona.color}`} />
                
                <div className="flex items-start justify-between mb-6 sm:mb-10 relative z-10">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-500 ${
                    isActive ? 'bg-white/10 ring-2 ring-cyan-500/50 scale-110' : 'bg-white/5'
                  }`}>
                    <span className="drop-shadow-lg">{persona.icon}</span>
                  </div>
                  {isActive && (
                    <div className="bg-cyan-500 text-white px-3 sm:px-4 py-1 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">Active</div>
                  )}
                </div>
                
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-10 relative z-10">
                  <h3 className="font-black text-sm sm:text-base uppercase tracking-tight truncate dark:text-white text-slate-900">
                    {persona.name}
                  </h3>
                  <p className="text-[10px] sm:text-[12px] font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {persona.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-4 sm:pt-5 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-slate-500" />
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
                        Smart AI v4.9
                      </span>
                   </div>
                   <div className={`p-2 rounded-xl transition-all duration-500 ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-700'}`}>
                      <ChevronRight size={18} />
                   </div>
                </div>
              </button>

              {persona.isCustom && onDeleteCustom && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteCustom(persona.id); }}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20 shadow-2xl"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaSelector;
