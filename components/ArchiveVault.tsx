
import React, { useState, useMemo } from 'react';
import { ChatSession, Persona, CloudSyncState, Message } from '../types';
import { 
  Archive, 
  Search, 
  Calendar, 
  Clock, 
  Trash2, 
  Cloud, 
  Download, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  ExternalLink,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Folder,
  FolderOpen,
  ArrowRight,
  Database,
  RefreshCw,
  FileDown,
  ArrowLeft
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ArchiveVaultProps {
  sessions: ChatSession[];
  personas: Persona[];
  syncState: CloudSyncState;
  onUpdateSync: (newSync: Partial<CloudSyncState>) => void;
  onDeleteSession: (id: string) => void;
}

const ArchiveVault: React.FC<ArchiveVaultProps> = ({ sessions, personas, syncState, onUpdateSync, onDeleteSession }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const filtered = sessions.filter(s => {
      const persona = personas.find(p => p.id === s.personaId);
      const searchStr = `${persona?.name} ${s.messages.map(m => m.parts[0].text).join(' ')}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });

    const groups: Record<string, ChatSession[]> = {};
    filtered.forEach(s => {
      if (!groups[s.dateString]) groups[s.dateString] = [];
      groups[s.dateString].push(s);
    });
    return groups;
  }, [sessions, personas, searchTerm]);

  const sortedDates = Object.keys(groupedSessions).sort((a, b) => b.localeCompare(a));

  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const selectedSession = useMemo(() => 
    sessions.find(s => s.id === selectedSessionId), 
  [sessions, selectedSessionId]);

  const handleSyncToDrive = async () => {
    if (!syncState.isConnected) {
      alert("Redirecting to Google Drive Authorization... (Mock)");
      onUpdateSync({ isConnected: true, accountEmail: "nexus.operator@gmail.com" });
      return;
    }
    
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    onUpdateSync({ lastSync: Date.now() });
    setIsSyncing(false);
    alert("Archives synchronized to Google Drive: /MindMatrixAI/Logs/Date-Wise/");
  };

  const exportSessionPDF = async (session: ChatSession) => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin;

      const persona = personas.find(p => p.id === session.personaId);

      // Header
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(6, 182, 212); // Cyan
      doc.text("Mind Matrix AI Archive Log", margin, y);
      y += 12;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Session ID: ${session.id}`, margin, y);
      y += 5;
      doc.text(`Temporal Coord: ${session.dateString} ${new Date(session.startTime).toLocaleTimeString()}`, margin, y);
      y += 5;
      doc.text(`Protocol: ${persona?.name || 'Unknown'}`, margin, y);
      y += 15;

      // Line separator
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y - 5, pageWidth - margin, y - 5);

      // Transcript
      session.messages.forEach((msg: Message) => {
        const text = msg.parts[0]?.text || "[Neural Data Fragment]";
        const lines = doc.splitTextToSize(text, pageWidth - (margin * 2 + 10));
        const blockHeight = (lines.length * 5) + 15;

        if (y + blockHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        
        const roleLabel = msg.role === 'model' ? 'Mind Matrix AI' : 'OPERATOR INPUT';
        const timestamp = new Date(msg.timestamp).toLocaleTimeString();
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        if (msg.role === 'model') {
          doc.setTextColor(6, 182, 212); // Cyan
        } else {
          doc.setTextColor(71, 85, 105); // Slate-600
        }
        
        doc.text(`${roleLabel} (${timestamp})`, margin, y);
        y += 6;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text(lines, margin + 5, y);
        
        y += (lines.length * 5) + 8;
      });

      doc.save(`MindMatrixAI_Log_${session.dateString}_${persona?.name || 'Archive'}.pdf`);
    } catch (e) {
      console.error("PDF Export failed", e);
      alert("Failed to synthesize archival PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full flex flex-col font-sans theme-aware-text bg-transparent overflow-hidden">
      {/* Vault Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-white/5 backdrop-blur-3xl z-30">
        <div className="flex items-center gap-3">
          <Archive size={18} className="text-amber-500" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 dark:text-white">Mind Matrix AI Vault</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <Cloud size={10} className={syncState.isConnected ? "text-cyan-400" : "text-slate-500"} />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
              {syncState.isConnected ? `Synced` : "Local"}
            </span>
          </div>
          <button 
            onClick={handleSyncToDrive}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${isSyncing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:scale-105 active:scale-95'}`}
          >
            {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <Cloud size={12} />}
            <span className="hidden xs:inline">{syncState.isConnected ? "Sync" : "Link"}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Archive Explorer Sidebar (Hidden on mobile when a session is selected) */}
        <aside className={`${selectedSessionId ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-white/5 bg-black/20 backdrop-blur-xl flex-col h-full z-20`}>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search neural logs..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[11px] font-medium outline-none focus:border-cyan-500/40 transition-all text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {sortedDates.length === 0 ? (
              <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                <Database size={40} />
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">No Archives Found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {sortedDates.map(date => (
                  <div key={date} className="space-y-1">
                    <button 
                      onClick={() => toggleDate(date)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                    >
                      {expandedDates.has(date) ? <FolderOpen size={16} className="text-amber-500" /> : <Folder size={16} className="text-amber-500/60" />}
                      <span className="flex-1 text-[10px] font-black text-slate-950 dark:text-slate-400 uppercase tracking-widest">{date}</span>
                      <span className="text-[8px] font-bold text-slate-600 group-hover:text-cyan-400">{groupedSessions[date].length} Sessions</span>
                    </button>

                    {expandedDates.has(date) && (
                      <div className="pl-6 space-y-1 pb-2 animate-in slide-in-from-top-1">
                        {groupedSessions[date].map(session => {
                          const persona = personas.find(p => p.id === session.personaId);
                          const isActive = selectedSessionId === session.id;
                          return (
                            <button 
                              key={session.id}
                              onClick={() => setSelectedSessionId(session.id)}
                              className={`w-full flex flex-col gap-1 p-3 rounded-xl transition-all text-left border ${isActive ? 'bg-cyan-500/10 border-cyan-500/40' : 'border-transparent hover:bg-white/5'}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{persona?.icon || '🤖'}</span>
                                <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-cyan-400' : 'text-slate-950 dark:text-slate-300'}`}>{persona?.name || 'Unknown Core'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">
                                  {new Date(session.startTime).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-[7px] font-black text-slate-600 uppercase">{session.messages.length} MSGS</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right: Transcript Viewer (Full width on mobile when a session is selected) */}
        <main className={`${selectedSessionId ? 'flex' : 'hidden md:flex'} flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 bg-white/40 dark:bg-transparent backdrop-blur-[60px] flex-col`}>
          <div className="max-w-3xl mx-auto h-full w-full">
            {selectedSession ? (
              <div className="flex flex-col h-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-2">
                {/* Session Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                      onClick={() => setSelectedSessionId(null)}
                      className="md:hidden p-2 rounded-xl bg-white/5 text-slate-500 mr-1"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center text-xl sm:text-3xl shadow-xl border border-white/10">
                      {personas.find(p => p.id === selectedSession.personaId)?.icon || '🤖'}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm sm:text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                        {personas.find(p => p.id === selectedSession.personaId)?.name || 'Protocol Unknown'}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-4 text-[7px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {selectedSession.dateString}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(selectedSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => exportSessionPDF(selectedSession)}
                      disabled={isExporting}
                      className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-slate-600 hover:text-cyan-400 transition-all group/btn"
                      title="Archival PDF Export"
                    >
                      {isExporting ? <RefreshCw size={16} className="animate-spin" /> : <FileDown size={16} />}
                    </button>
                    <button 
                      onClick={() => { onDeleteSession(selectedSession.id); setSelectedSessionId(null); }}
                      className="p-2 sm:p-3 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Log Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 px-1 text-cyan-400/60">
                    <Shield size={12} className="text-cyan-400" />
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Neural Transcript Authenticated</span>
                  </div>

                  {selectedSession.messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col gap-2 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border ${msg.role === 'model' ? 'bg-white/5 border-white/5' : 'bg-cyan-500/5 border-cyan-500/10'}`}>
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                        <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest ${msg.role === 'model' ? 'text-amber-500' : 'text-cyan-400'}`}>
                          {msg.role === 'model' ? 'Mind Matrix AI' : 'Operator'}
                        </span>
                        <span className="text-[7px] font-bold text-slate-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-950 dark:text-slate-300 whitespace-pre-wrap">
                        {msg.parts[0].text}
                      </p>
                      {msg.parts[1]?.inlineData && (
                        <div className="mt-4 p-2 rounded-2xl bg-black/40 border border-white/5">
                           <img src={`data:${msg.parts[1].inlineData.mimeType};base64,${msg.parts[1].inlineData.data}`} className="w-full rounded-xl object-contain max-h-80" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-10 sm:pt-20 pb-10 flex flex-col items-center gap-4 text-slate-500">
                   <div className="w-12 h-1 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
                   <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.5em]">End of Transmission</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                <div className="relative">
                  <Archive size={60} className="sm:size-[80px] text-slate-950 dark:text-white" />
                  <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Protocol Selection Required</h3>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs px-4">
                    Access conversation logs by selecting a dated session from the neural vault explorer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        body.dark-mode .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default ArchiveVault;
