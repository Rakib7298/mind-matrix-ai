
import React, { useState } from 'react';
import { Persona } from '../types';
import { X, Wand2, Palette, Terminal, Type as TypeIcon, Sparkles, AlertCircle } from 'lucide-react';

interface BlueprintStudioProps {
  onSave: (newPersona: Persona) => void;
  onClose: () => void;
}

const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Fast & Versatile' },
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite', desc: 'Efficient & Precise' }
];

const COLORS = [
  { id: 'blue', value: 'from-blue-500 to-cyan-400' },
  { id: 'purple', value: 'from-purple-500 to-pink-500' },
  { id: 'emerald', value: 'from-emerald-500 to-teal-400' },
  { id: 'amber', value: 'from-amber-500 to-orange-400' },
  { id: 'rose', value: 'from-rose-500 to-pink-400' },
  { id: 'violet', value: 'from-violet-500 to-purple-600' }
];

const ICONS = ['🤖', '🧠', '⚡', '👁️', '🔮', '⌛', '💬', '🛡️', '🌐', '🎙️', '🌀', '🚀', '🛠️', '🎨', '📚', '🧬', '🎭', '🛸'];

const BlueprintStudio: React.FC<BlueprintStudioProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0].value);
  const [model, setModel] = useState(MODELS[0].id);

  const [touched, setTouched] = useState({ name: false, instruction: false });

  const isNameInvalid = touched.name && !name.trim();
  const isInstructionInvalid = touched.instruction && !instruction.trim();
  const isFormInvalid = !name.trim() || !instruction.trim();

  const handleCreate = () => {
    if (isFormInvalid) {
      setTouched({ name: true, instruction: true });
      return;
    }
    const newPersona: Persona = {
      id: `studio_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom AI assistant.',
      icon: icon,
      color: color,
      model: model,
      systemInstruction: instruction.trim(),
      isCustom: true
    };
    onSave(newPersona);
  };

  const handleBlur = (field: 'name' | 'instruction') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="w-full max-w-sm glass-card border-white/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-300 my-4 shadow-2xl flex flex-col max-h-[90vh]">
        <div className={`h-28 sm:h-36 bg-gradient-to-br ${color} relative flex items-center justify-center flex-shrink-0`}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-white/20">
             {icon}
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl bg-black/20 text-white hover:bg-black/40 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            {/* Fix: removed invalid sm:size prop */}
            <Wand2 size={16} className="text-cyan-400" />
            <h3 className="text-[11px] sm:text-sm font-black tracking-tight text-white uppercase">Initialize AI</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1 flex justify-between">
                <span>AI Identity</span>
                {isNameInvalid && <span className="text-red-400">Required</span>}
              </label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full bg-slate-900/60 border rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-3 sm:px-4 text-[13px] sm:text-sm font-medium focus:outline-none transition-all text-white ${isNameInvalid ? 'border-red-500/40' : 'border-white/10 focus:border-cyan-500/40'}`}
                placeholder="Name..."
              />
            </div>
            
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Objective</label>
              <input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-3 sm:px-4 text-[13px] sm:text-sm font-medium focus:outline-none focus:border-cyan-500/40 transition-all text-white"
                placeholder="What is its goal?"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Icon Profile</label>
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {ICONS.map(i => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg transition-all border ${icon === i ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1 flex justify-between">
              <span>Behavior Protocol</span>
              {isInstructionInvalid && <span className="text-red-400">Required</span>}
            </label>
            <textarea 
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onBlur={() => handleBlur('instruction')}
              className={`w-full bg-slate-900/60 border rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-3 sm:px-4 text-[11px] sm:text-xs font-medium focus:outline-none min-h-[80px] sm:min-h-[100px] transition-all text-white resize-none ${isInstructionInvalid ? 'border-red-500/40' : 'border-white/10 focus:border-cyan-500/40'}`}
              placeholder="Behavior rules..."
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2 pb-1 sm:pb-2">
            <label className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Matrix Core</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all ${model === m.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/5'}`}
                >
                  <div className="text-[8px] sm:text-[10px] font-black text-white uppercase">{m.name}</div>
                  <div className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-black/20 flex-shrink-0">
          <button 
            onClick={handleCreate}
            className={`w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${isFormInvalid ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:brightness-110 active:scale-95'}`}
          >
            {/* Fix: removed invalid sm:size prop */}
            <Sparkles size={14} />
            Initialize Core
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlueprintStudio;
