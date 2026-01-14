import React, { useState } from 'react';
import { Persona } from '../types';
import { ChevronRight, Sparkles, X, Terminal, Cpu, Zap } from 'lucide-react';

interface TutorialOverlayProps {
  persona: Persona;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ persona, onClose }) => {
  const [step, setStep] = useState(0);
  const steps = persona.tutorialSteps || [
    "Initializing neural link...",
    "Synchronizing behavioral patterns.",
    "Protocol active. Awaiting input."
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500 font-sans">
      <div className="w-full max-w-sm glass-card rounded-[3rem] overflow-hidden border-white/20 shadow-[0_0_50px_rgba(0,0,0,1)] relative">
        {/* Background Glow */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-30 blur-[100px] pointer-events-none bg-gradient-to-br ${persona.color}`} />
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-12 flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-5xl mb-8 bg-gradient-to-br ${persona.color} relative shadow-2xl`}>
             <div className="absolute inset-0 rounded-[2.5rem] bg-inherit blur-xl opacity-40 animate-pulse" />
             <span className="relative z-10">{persona.icon}</span>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              {persona.name}
              <span className="block text-[10px] font-bold text-cyan-400 mt-1 tracking-[0.3em]">NEURAL CALIBRATION</span>
            </h2>
          </div>

          <div className="w-full bg-slate-900/60 rounded-2xl p-6 mb-8 border border-white/5 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <p className="text-[15px] font-medium leading-relaxed text-slate-200 animate-in slide-in-from-bottom-2 duration-300">
              {steps[step]}
            </p>
          </div>

          <div className="flex items-center gap-1.5 mb-8">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-800'}`} 
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-white text-black font-black text-[11px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            {step === steps.length - 1 ? 'BEGIN SYNC' : 'NEXT STEP'}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-6 flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-1.5">
              <Terminal size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest">v2.5-CORE</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Zap size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest">LOW-LATENCY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
