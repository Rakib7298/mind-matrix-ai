import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PersonaType, Persona, Message, UserStats, ChatSession, CloudSyncState, ProactiveAdvice } from './types';
import { PERSONAS, XP_PER_CHAT } from './constants';
import { gemini } from './geminiService';
import { 
  MessageSquare, Target, Settings as SettingsIcon, Award, ImageIcon,
  Sun, Moon, Archive, Menu as MenuIcon, X, Zap, Brain, Bell, AlertCircle
} from 'lucide-react';

// Components
import PersonaSelector from './components/PersonaSelector';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import QuantumView from './components/QuantumView';
import TutorialOverlay from './components/TutorialOverlay';
import Settings from './components/Settings';
import BlueprintStudio from './components/BlueprintStudio';
import ImageLab from './components/ImageLab';
import ArchiveVault from './components/ArchiveVault';
import ProactivePulse from './components/ProactivePulse';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PersonaType>('chat');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allPersonas, setAllPersonas] = useState<Persona[]>(PERSONAS);
  const [activePersona, setActivePersona] = useState<Persona>(PERSONAS[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [vaultSessions, setVaultSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('matrix_stats');
    return saved ? JSON.parse(saved) : {
      xp: 0, level: 1, completedQuests: [],
      usagePerPersona: {},
      seenPersonas: [PERSONAS[0].id],
      tokenUsage: 0,
      cloudSync: { isConnected: false, lastSync: null, accountEmail: null, autoSync: true },
      activeAdvice: []
    };
  });

  useEffect(() => {
    const savedMsgs = localStorage.getItem('matrix_messages');
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
    const savedTheme = localStorage.getItem('matrix_theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('matrix_theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('matrix_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('matrix_messages', JSON.stringify(messages)); }, [messages]);

  const triggerRecoveryNotice = (msg: string) => {
    setRecoveryNotice(msg);
    setTimeout(() => setRecoveryNotice(null), 5000);
  };

  const handleTriggerIdeas = useCallback(async () => {
    setIsLoading(true);
    try {
      const ideas = await gemini.generateIdeaSuggestions(activePersona);
      if (ideas?.length) setStats(s => ({ ...s, activeAdvice: ideas }));
    } catch (e) {
      triggerRecoveryNotice("Synaptic lag detected. Idea synthesis deferred.");
    } finally {
      setIsLoading(false);
    }
  }, [activePersona]);

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;
    setIsLoading(true);
    const pid = activePersona.id;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', parts: [{ text }], timestamp: Date.now(), personaId: pid };
    if (image) userMsg.parts.push({ inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] }});
    
    setMessages(prev => ({ ...prev, [pid]: [...(prev[pid] || []), userMsg] }));

    try {
      let aiText = "", tks = 0;
      if (pid === 'quantum') {
        const res = await gemini.getQuantumResponse(text);
        aiText = res.map(r => `[${r.type}]: ${r.text}`).join('\n\n');
        tks = res[0].tokens;
      } else {
        const res = await gemini.generateResponse(activePersona, text, messages[pid] || [], image ? { data: image, mimeType: 'image/jpeg' } : undefined);
        aiText = res.text; tks = res.tokens;
        if (aiText.includes("NEURAL_FAULT")) triggerRecoveryNotice("Host connection unstable. Auto-retry successful.");
      }
      const aiMsg: Message = { id: crypto.randomUUID(), role: 'model', parts: [{ text: aiText }], timestamp: Date.now(), personaId: pid };
      setMessages(prev => ({ ...prev, [pid]: [...(prev[pid] || []), aiMsg] }));
      setStats(s => {
        const xp = s.xp + XP_PER_CHAT;
        return { ...s, xp, level: Math.floor(xp / 500) + 1, tokenUsage: s.tokenUsage + tks };
      });
    } catch (e) { 
      triggerRecoveryNotice("Core communication failure. Please check your network.");
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleEditMessage = async (id: string, text: string) => {
    const pid = activePersona.id;
    const currentMsgs = messages[pid] || [];
    const msgIndex = currentMsgs.findIndex(m => m.id === id);
    if (msgIndex === -1) return;
    setMessages(prev => ({ ...prev, [pid]: currentMsgs.slice(0, msgIndex) }));
    handleSendMessage(text);
  };

  const navItems = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare size={18} />, sub: 'Talk to AI' },
    { id: 'explore', label: 'Identity', icon: <Target size={18} />, sub: 'Swap Persona' },
    { id: 'lab', label: 'Imaging', icon: <ImageIcon size={18} />, sub: 'Art Studio' },
    { id: 'progress', label: 'Stats', icon: <Award size={18} />, sub: 'My Progress' },
    { id: 'vault', label: 'Vault', icon: <Archive size={18} />, sub: 'Archives' },
    { id: 'settings', label: 'Config', icon: <SettingsIcon size={18} />, sub: 'Settings' },
  ];

  return (
    <div className={`flex h-screen w-full transition-all duration-700 font-sans overflow-hidden ${theme === 'dark' ? 'bg-[#020205] text-slate-100' : 'bg-[#f8fafc] text-slate-950'}`}>
      {recoveryNotice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-full glass-card border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 animate-in slide-in-from-top-4 shadow-2xl">
          <AlertCircle size={14} /> {recoveryNotice}
        </div>
      )}

      {showTutorial && <TutorialOverlay persona={activePersona} onClose={() => setShowTutorial(false)} />}
      {isStudioOpen && <BlueprintStudio onSave={p => { setAllPersonas([...allPersonas, p]); setActivePersona(p); setIsStudioOpen(false); }} onClose={() => setIsStudioOpen(false)} />}
      
      <div className={`fixed inset-0 pointer-events-none opacity-20 blur-[150px] transition-all duration-1000 bg-gradient-to-br ${activePersona.color}`} />
      
      <ProactivePulse 
        advice={stats.activeAdvice || []} 
        personaName={activePersona.name}
        onDismiss={id => setStats(s => ({ ...s, activeAdvice: s.activeAdvice?.filter(a => a.id !== id) }))} 
      />
      
      {/* Sidebar logic... */}
      <div className="fixed z-[150] left-6 bottom-6 flex flex-col-reverse items-start pointer-events-none">
         <div className="pointer-events-auto" onMouseEnter={() => setSidebarOpen(true)}>
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-700 shadow-2xl flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"><MenuIcon size={24}/></div>
         </div>
         <div onMouseLeave={() => setSidebarOpen(false)} className={`pointer-events-auto mb-4 w-64 glass-card rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-2xl origin-bottom-left border border-white/20 ${sidebarOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'} ${theme === 'dark' ? 'bg-black/80' : 'bg-white/95'}`}>
           <nav className="p-3 space-y-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-cyan-500 text-white shadow-lg' : 'hover:bg-cyan-500/10 text-slate-500 hover:text-cyan-500'}`}>
                  {item.icon} <div className="flex flex-col text-left"><span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span></div>
                </button>
              ))}
           </nav>
         </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-20 flex items-center justify-between px-6 sm:px-10 border-b border-white/10 backdrop-blur-md bg-black/10">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activePersona.color} flex items-center justify-center text-xl shadow-lg`}>{activePersona.icon}</div>
            <h1 className="text-sm font-black uppercase tracking-widest dark:text-white text-slate-950">{activePersona.name}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                <Zap size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-xs font-black text-slate-500">{stats.xp} XP</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' && (
            activePersona.id === 'quantum' ? (
              <QuantumView onSend={handleSendMessage} isLoading={isLoading} messages={messages['quantum'] || []} />
            ) : (
              <ChatInterface 
                messages={messages[activePersona.id] || []} 
                onSend={handleSendMessage} 
                onEdit={handleEditMessage} 
                onClear={() => setMessages(p => { const n = {...p}; delete n[activePersona.id]; return n; })} 
                onArchive={() => {}} 
                onTriggerIdeas={handleTriggerIdeas}
                isLoading={isLoading} 
                persona={activePersona} 
                onSelectPersona={() => setActiveTab('explore')} 
              />
            )
          )}
          {activeTab === 'explore' && <PersonaSelector personas={allPersonas} currentPersona={activePersona} onSelect={p => { setActivePersona(p); setActiveTab('chat'); }} onDeleteCustom={id => setAllPersonas(allPersonas.filter(p => p.id !== id))} onCreateCustom={() => setIsStudioOpen(true)} />}
          {activeTab === 'lab' && <ImageLab onUpdateStats={n => setStats(s => ({...s, ...n}))} />}
          {activeTab === 'progress' && <Dashboard stats={stats} onUpdateStats={n => setStats(s => ({...s, ...n}))} />}
          {activeTab === 'vault' && <ArchiveVault sessions={vaultSessions} personas={allPersonas} syncState={stats.cloudSync!} onUpdateSync={n => setStats(s => ({...s, cloudSync: {...s.cloudSync, ...n} as CloudSyncState}))} onDeleteSession={id => setVaultSessions(vaultSessions.filter(s => s.id !== id))} />}
          {activeTab === 'settings' && <Settings messages={messages} personas={allPersonas} stats={stats} onClearHistory={() => setMessages({})} />}
        </main>
      </div>
    </div>
  );
};

export default App;