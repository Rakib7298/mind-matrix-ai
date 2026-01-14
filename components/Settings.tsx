import React, { useState, useEffect, useMemo } from 'react';
import { Message, Persona, UserStats } from '../types';
import { 
  Trash2, Database, Shield, History, Search, Download, 
  AlertTriangle, Key, ChevronDown, ChevronUp, Activity, 
  Info, Cpu, FileText, CheckCircle2, XCircle, RefreshCw,
  Lock, UserCircle, Settings as SettingsIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface SettingsProps {
  messages: Record<string, Message[]>;
  personas: Persona[];
  stats: UserStats;
  onClearHistory: (personaId?: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ messages, personas, stats, onClearHistory }) => {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState(false);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    account: true,
    data: true
  });

  useEffect(() => { checkKeyStatus(); }, []);

  const checkKeyStatus = async () => {
    setIsCheckingKey(true);
    try { 
      const status = await (window as any).aistudio?.hasSelectedApiKey(); 
      setHasKey(!!status); 
    } finally { 
      setIsCheckingKey(false); 
    }
  };

  const handleConfigureKey = async () => {
    try { 
      await (window as any).aistudio?.openSelectKey(); 
      checkKeyStatus(); 
    } catch (e) { 
      console.error(e); 
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const dataSize = (JSON.stringify(messages).length / 1024).toFixed(2);

  const usagePercentage = useMemo(() => {
    const limit = hasKey ? 1000000 : 15000;
    return Math.min((stats.tokenUsage / limit) * 100, 100);
  }, [stats.tokenUsage, hasKey]);

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar pb-32">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-3 text-cyan-600">
           <SettingsIcon size={28} />
           <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Settings</h2>
        </div>
        <p className="text-[10px] sm:text-[12px] font-black text-slate-950 dark:text-slate-500 uppercase tracking-widest">Manage your AI account and data.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Account Section */}
        <div className="glass-card rounded-[2.5rem] border border-black/10 dark:border-white/5 overflow-hidden shadow-xl bg-white/60 dark:bg-black/20 backdrop-blur-xl">
          <button 
            onClick={() => toggleSection('account')}
            className="w-full flex items-center justify-between p-8 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
               <div className="p-4 rounded-3xl bg-cyan-500/10 text-cyan-600 group-hover:scale-110 transition-transform">
                  <Key size={24} />
               </div>
               <div className="text-left">
                  <h3 className="text-sm font-black uppercase text-slate-950 dark:text-white tracking-widest">Account Login</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Manage your connection key.</p>
               </div>
            </div>
            {openSections.account ? <ChevronUp size={22} className="text-slate-950 dark:text-slate-400" /> : <ChevronDown size={22} className="text-slate-950 dark:text-slate-400" />}
          </button>

          {openSections.account && (
            <div className="px-8 pb-8 pt-2">
              <div className="p-6 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[11px] font-black text-slate-950 dark:text-slate-500 uppercase tracking-widest">Status</span>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                         {isCheckingKey ? (
                           <RefreshCw size={14} className="animate-spin text-cyan-500" />
                         ) : hasKey ? (
                           <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px]">
                              <CheckCircle2 size={16} /> Verified
                           </div>
                         ) : (
                           <div className="flex items-center gap-2 text-slate-950 dark:text-slate-500 font-black uppercase tracking-widest text-[11px]">
                              <XCircle size={16} /> Not Connected
                           </div>
                         )}
                      </div>
                   </div>
                   <button 
                    onClick={handleConfigureKey}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-600 text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-600/20"
                   >
                     Update Login Key
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Storage Section */}
        <div className="glass-card rounded-[2.5rem] border border-black/10 dark:border-white/5 overflow-hidden shadow-xl bg-white/60 dark:bg-black/20 backdrop-blur-xl">
          <button 
            onClick={() => toggleSection('data')}
            className="w-full flex items-center justify-between p-8 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
               <div className="p-4 rounded-3xl bg-violet-500/10 text-violet-600 group-hover:scale-110 transition-transform">
                  <Database size={24} />
               </div>
               <div className="text-left">
                  <h3 className="text-sm font-black uppercase text-slate-950 dark:text-white tracking-widest">Storage Control</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Manage chat space.</p>
               </div>
            </div>
            {openSections.data ? <ChevronUp size={22} className="text-slate-950 dark:text-slate-400" /> : <ChevronDown size={22} className="text-slate-950 dark:text-slate-400" />}
          </button>

          {openSections.data && (
            <div className="px-8 pb-8 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-4">
                  <span className="text-[10px] font-black text-slate-950 dark:text-slate-500 uppercase tracking-widest">Usage Meter</span>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-slate-950 dark:text-white">{stats.tokenUsage.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-cyan-600 uppercase">Tokens</span>
                  </div>
                  <div className="w-full h-2 bg-black/10 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${usagePercentage}%` }} />
                  </div>
                </div>

                <div className="p-6 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-950 dark:text-slate-500 uppercase tracking-widest">Used Space</span>
                    <span className="text-[12px] font-black text-violet-600">{dataSize} KB</span>
                  </div>
                  <button 
                    onClick={() => setShowConfirm('all')} 
                    className="w-full py-4 rounded-2xl bg-red-500/10 text-red-600 text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-500/20"
                  >
                    Delete All History
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showConfirm === 'all' && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
           <div className="w-full max-w-sm glass-card p-12 rounded-[3.5rem] border border-red-500/30 text-center space-y-8 bg-white dark:bg-slate-900 shadow-2xl">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto text-red-500 animate-pulse border border-red-500/20 shadow-inner">
                <AlertTriangle size={48}/>
              </div>
              <div className="space-y-3">
                 <h4 className="text-2xl font-black uppercase text-slate-950 dark:text-white tracking-tight">Full Wipe?</h4>
                 <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                   Permanently delete all saved chats. This cannot be undone.
                 </p>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setShowConfirm(null)} className="flex-1 py-4 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-950 dark:text-white font-black uppercase text-[10px] hover:bg-black/10">Go Back</button>
                 <button onClick={() => { onClearHistory(); setShowConfirm(null); }} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] shadow-xl">Yes, Wipe</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;