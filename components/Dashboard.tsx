import React, { useState, useRef } from 'react';
import { UserStats } from '../types';
import { PERSONAS } from '../constants';
import { gemini } from '../geminiService';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis, CartesianGrid } from 'recharts';
import { Trophy, Zap, Star, Activity, Camera, Wand2, Loader2, User, X, LayoutDashboard, Cpu, Sparkles, Orbit, ShieldCheck, Ghost, Atom, Brain } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

const AVATAR_ARCHETYPES = [
  { id: 'guardian', name: 'Cyber Guardian', icon: <ShieldCheck size={14} />, prompt: "3D glass humanoid bust, high-tech tactical helmet, glowing neon blue visor, iridescent crystal textures, futuristic armored plating, cinematic lighting, 8k render" },
  { id: 'oracle', name: 'Glass Oracle', icon: <Orbit size={14} />, prompt: "3D transparent glass head, internal glowing light core, floating data particles, ethereal eyes, frosted glass textures, high-end 3D octane render, minimalist" },
  { id: 'neural', name: 'Neural Nerve', icon: <Brain size={14} />, prompt: "3D glass skull with visible glowing neural network inside, electric synapse sparks, translucent material, bioluminescent blue and purple, ultra-detailed" },
  { id: 'prism', name: 'Prism Entity', icon: <Sparkles size={14} />, prompt: "Abstract 3D humanoid head made of prismatic glass shards, rainbow iridescence, light refraction, caustics, vibrant color spectrum, luxury aesthetic" },
  { id: 'ghost', name: 'Quantum Ghost', icon: <Ghost size={14} />, prompt: "Ethereal 3D glass silhouette, blurry motion trails, glowing white aura, frosted textures, mystical appearance, soft volumetric lighting" },
];

const Dashboard: React.FC<DashboardProps> = ({ stats, onUpdateStats }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState(AVATAR_ARCHETYPES[0]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chartData = (Object.entries(stats.usagePerPersona) as [string, number][]).map(([key, val]) => {
    const persona = PERSONAS.find(p => p.id === key);
    return {
      name: persona?.name.split(' ')[0] || key,
      val: val,
      color: persona?.color.split(' ')[1].replace('to-', '#') || '#06b6d4'
    };
  }).filter(d => d.val > 0);

  const levelProgress = (stats.xp % 500) / 5;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { onUpdateStats({ avatar: reader.result as string }); setShowAvatarPicker(false); };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAvatar = async () => {
    setIsGenerating(true); setError(null);
    try {
      const res = await gemini.generateImage(selectedArchetype.prompt, { aspectRatio: '1:1', imageSize: '1K' });
      onUpdateStats({ avatar: res.url, tokenUsage: stats.tokenUsage + res.tokens });
      setShowAvatarPicker(false);
    } catch (err) { setError("Generation failed."); } finally { setIsGenerating(false); }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-10 space-y-8 custom-scrollbar pb-32">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 glass-card p-8 rounded-[3rem] border border-black/10 dark:border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden bg-white/60 dark:bg-black/20">
           <div className="relative mb-8 group">
              <div onClick={() => setShowAvatarPicker(true)} className="w-40 h-40 rounded-[3rem] p-2 glass-card border-black/10 dark:border-white/20 shadow-2xl relative overflow-hidden cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white dark:bg-slate-900/40">
                {stats.avatar ? (
                  <img src={stats.avatar} alt="Profile" className="w-full h-full object-cover rounded-[2.5rem]" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-950 dark:text-slate-700">
                    <User size={56} className="opacity-20 mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Add Picture</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all backdrop-blur-sm">
                  <Camera size={24} className="text-white mb-2" />
                  <span className="text-[8px] font-black uppercase text-white tracking-widest">Change Photo</span>
                </div>
              </div>
           </div>
           
           <div className="space-y-2">
             <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white">My Profile</h2>
             <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-black text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-cyan-500/20 shadow-sm">Level {stats.level} User</span>
             </div>
           </div>

           <div className="w-full h-px bg-black/10 dark:bg-white/5 my-8" />
           
           <div className="w-full grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                 <p className="text-[10px] font-black text-slate-950 dark:text-slate-500 uppercase tracking-widest mb-1">XP Points</p>
                 <p className="text-2xl font-black text-slate-950 dark:text-white">{stats.xp}</p>
              </div>
              <div className="text-center p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                 <p className="text-[10px] font-black text-slate-950 dark:text-slate-500 uppercase tracking-widest mb-1">Tokens</p>
                 <p className="text-xl font-black text-slate-950 dark:text-white">{stats.tokenUsage.toLocaleString()}</p>
              </div>
           </div>
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-10 rounded-[3rem] border border-black/10 dark:border-white/5 bg-white/60 dark:bg-black/20 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-10">
                 <div className="w-44 h-44 rounded-full border-[12px] border-black/5 dark:border-slate-900/60 p-2 flex items-center justify-center relative shadow-inner">
                    <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-white/50 dark:bg-transparent">
                       <span className="text-[10px] text-slate-950 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Level</span>
                       <span className="text-6xl font-black text-slate-950 dark:text-cyan-400">{stats.level}</span>
                    </div>
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                       <circle cx="50%" cy="50%" r="45%" stroke="rgba(0,0,0,0.05)" strokeWidth="12" fill="none" />
                       <circle cx="50%" cy="50%" r="45%" stroke="#06b6d4" strokeWidth="12" fill="none" strokeDasharray="300" strokeDashoffset={300 - (300 * levelProgress / 100)} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                 </div>
                 
                 <div className="flex-1 space-y-6 text-center sm:text-left">
                    <div className="space-y-2">
                       <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Your Progress</h3>
                       <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                          <Activity size={14} className="text-cyan-600 animate-pulse" /> Keep chatting to level up!
                       </p>
                    </div>
                    <div className="space-y-4">
                       <div className="w-full h-4 bg-black/10 dark:bg-slate-900/60 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                          <div className="h-full bg-cyan-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(6,182,212,0.5)]" style={{width: `${levelProgress}%`}} />
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black text-slate-950 dark:text-slate-500 uppercase tracking-widest">
                          <span>{stats.xp} POINTS EARNED</span>
                          <span>NEXT LVL: {500 - (stats.xp % 500)} XP</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[4rem] border border-black/10 dark:border-white/5 bg-white/60 dark:bg-black/20 shadow-xl">
              <div className="flex items-center gap-3 mb-8 px-2">
                 <LayoutDashboard size={22} className="text-cyan-600" />
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-950 dark:text-white">AI Usage History</h3>
              </div>
              <div className="h-72 w-full">
                 {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
                          <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#000000', fontWeight: 900}} />
                          <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#000000'}} />
                          <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                          <Bar dataKey="val" radius={[8, 8, 8, 8]} barSize={32}>
                             {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-full flex items-center justify-center text-sm font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.4em]">Start chatting for data...</div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {showAvatarPicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in">
          <div className="w-full max-w-2xl glass-card rounded-[3.5rem] p-10 space-y-10 relative border border-white/10 shadow-2xl bg-white dark:bg-slate-950 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <button onClick={() => setShowAvatarPicker(false)} className="absolute top-10 right-10 p-3 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-black/5 transition-all"><X size={28} /></button>
            
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Choose Your Look</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">Select an identity style</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
               {AVATAR_ARCHETYPES.map(arch => (
                 <button 
                  key={arch.id}
                  onClick={() => setSelectedArchetype(arch)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-[2.5rem] border transition-all ${selectedArchetype.id === arch.id ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-950 dark:text-slate-500 hover:bg-black/10'}`}
                 >
                    <div className="p-4 rounded-2xl bg-white/20">
                       {arch.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-center">{arch.name}</span>
                 </button>
               ))}
            </div>

            <div className="p-8 rounded-[3rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-8">
               <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex-1 space-y-1">
                     <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-950 dark:text-white">AI Custom Photo</h4>
                     <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Make an AI picture of: {selectedArchetype.name}</p>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                     <button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none p-5 rounded-3xl glass-card border-black/20 dark:border-white/10 text-slate-950 dark:text-slate-400 hover:bg-black/5"><Camera size={24} /></button>
                     <button onClick={handleGenerateAvatar} disabled={isGenerating} className="flex-[2] sm:flex-none px-10 py-5 rounded-[2.5rem] bg-cyan-600 text-white font-black text-xs uppercase hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all">
                        {isGenerating ? "Working..." : "Make Photo"}
                     </button>
                  </div>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;