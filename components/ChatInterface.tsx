import React, { useState, useRef, useEffect } from 'react';
import { Message, Persona } from '../types';
import { gemini } from '../geminiService';
import { 
  Send, 
  Camera, 
  Copy, 
  Globe,
  Loader2,
  Trash2,
  FileDown,
  Wand2,
  Volume2,
  AlertTriangle,
  Archive,
  Cpu,
  Share2,
  RefreshCw,
  Pencil,
  Clock,
  Brain,
  Check,
  X,
  XCircle,
  History,
  Lightbulb
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (text: string, image?: string) => void;
  onEdit: (id: string, text: string) => void;
  onClear: () => void;
  onArchive: () => void;
  onTriggerIdeas?: () => void;
  isLoading: boolean;
  persona: Persona;
  onSelectPersona: () => void;
}

const LANGUAGES = [
  { code: 'bn', name: 'Bangla' }, { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }, { code: 'de', name: 'German' }, { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' }, { code: 'hi', name: 'Hindi' }, { code: 'ar', name: 'Arabic' },
];

const MindMatrixLogo: React.FC<{ size?: number; className?: string }> = ({ size = 128, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center group/logo ${className}`} style={{ width: size, height: size, perspective: '1000px' }}>
      <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full scale-110 animate-pulse opacity-40" />
      <div className="relative w-full h-full animate-glitch-border">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(0,242,255,0.9)]">
          <path d="M20,10 L80,10 L90,20 L90,80 L80,90 L20,90 L10,80 L10,20 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400 opacity-60" />
          <path d="M10,30 L20,30 M10,70 L20,70 M90,30 L80,30 M90,70 L80,70 M30,10 L30,20 M70,10 L70,20" stroke="currentColor" strokeWidth="2" className="text-cyan-400" />
          <circle cx="20" cy="30" r="2" fill="currentColor" className="text-cyan-400" />
          <circle cx="80" cy="70" r="2" fill="currentColor" className="text-cyan-400" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Brain size={size * 0.6} className="text-purple-500 animate-neon-pulse drop-shadow-[0_0_25px_rgba(188,19,254,0.9)]" />
            <Brain size={size * 0.6} className="absolute inset-0 text-cyan-400 opacity-40 animate-glitch-offset-1" />
            <Brain size={size * 0.6} className="absolute inset-0 text-red-500 opacity-40 animate-glitch-offset-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

const BorderlessGlassTool: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
  glowColor: string;
  label: string;
  disabled?: boolean;
  isLoading?: boolean;
  active?: boolean;
}> = ({ icon, onClick, colorClass, glowColor, label, disabled, isLoading, active }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`group relative p-3 transition-all duration-500 hover:scale-125 active:scale-95 flex items-center justify-center ${
      disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
    } ${active ? 'scale-110' : ''}`}
  >
    <div 
      className={`absolute inset-0 transition-opacity duration-500 pointer-events-none blur-xl rounded-full ${active ? 'opacity-40' : 'opacity-0 group-hover:opacity-40'}`} 
      style={{ backgroundColor: glowColor }}
    />
    <div className={`${active ? 'text-white scale-110' : colorClass} transition-all duration-300 drop-shadow-[0_0_10px_${glowColor}]`}>
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : icon}
    </div>
    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/80 text-white text-[7px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-[100]">
      {label}
    </span>
  </button>
);

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isLight = document.body.classList.contains('light-mode');
    const matrixChars = "0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const draw = () => {
      ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(2, 2, 5, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillStyle = i % 5 === 0 ? '#bc13fe' : '#00f2ff';
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.12 }} />;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSend, onEdit, onClear, onArchive, onTriggerIdeas, isLoading, persona }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isMagicThinking, setIsMagicThinking] = useState(false);
  const [targetLang, setTargetLang] = useState(LANGUAGES[1]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading, translations]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleMagicPrompt = async () => {
    if (isMagicThinking || isLoading) return;
    setIsMagicThinking(true);
    try {
      const smartPrompt = await gemini.generateSmartPrompt(persona, messages, input);
      if (smartPrompt) {
        let i = 0;
        const interval = setInterval(() => {
          setInput(smartPrompt.substring(0, i + 1));
          i++;
          if (i === smartPrompt.length) {
            clearInterval(interval);
            setIsMagicThinking(false);
          }
        }, 15);
      } else {
        setIsMagicThinking(false);
      }
    } catch (e) {
      setIsMagicThinking(false);
    }
  };

  const handleExportPDF = async () => {
    if (messages.length === 0) return;
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const primaryColor = [6, 182, 212]; // Cyan
      const accentColor = [188, 19, 254]; // Purple
      const darkBg = [10, 10, 15];
      const slate = [148, 163, 184];

      const drawCyberBackground = (page: number) => {
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(0.05);
        for (let x = 10; x < pageWidth; x += 10) {
          for (let y = 10; y < pageHeight; y += 10) {
            doc.circle(x, y, 0.1, 'S');
          }
        }
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.5);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
        const cl = 10;
        doc.setLineWidth(1.5);
        doc.line(5, 5, 5 + cl, 5); doc.line(5, 5, 5, 5 + cl);
        doc.line(pageWidth - 5, 5, pageWidth - 5 - cl, 5); doc.line(pageWidth - 5, 5, pageWidth - 5, 5 + cl);
        doc.line(5, pageHeight - 5, 5 + cl, pageHeight - 5); doc.line(5, pageHeight - 5, 5, pageHeight - 5 - cl);
        doc.line(pageWidth - 5, pageHeight - 5, pageWidth - 5 - cl, pageHeight - 5); doc.line(pageWidth - 5, pageHeight - 5, pageWidth - 5, pageHeight - 5 - cl);
      };

      const drawHeader = (isFirstPage: boolean) => {
        doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
        doc.rect(5, 5, pageWidth - 10, 35, 'F');
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.8);
        doc.line(5, 40, pageWidth - 5, 40);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text("MIND MATRIX", 15, 20);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('courier', 'bold');
        doc.text(`INTELLIGENCE LOG // SESSION: ${crypto.randomUUID().substring(0, 8).toUpperCase()}`, 15, 26);
        doc.text(`PROTOCOL: ${persona.name.toUpperCase()} // CORE: v12.4-A`, 15, 30);
        doc.text(`COORDINATES: ${new Date().toLocaleString().toUpperCase()}`, 15, 34);
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.rect(pageWidth - 65, 10, 50, 25);
        doc.setFontSize(7);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text("SECURITY: CLASSIFIED", pageWidth - 60, 16);
        doc.text(`ENTRIES: ${messages.length}`, pageWidth - 60, 21);
        doc.text("ORIGIN: NEURAL_LINK", pageWidth - 60, 26);
        doc.text("STATUS: ENCRYPTED", pageWidth - 60, 31);
      };

      const drawFooter = (page: number) => {
        doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
        doc.rect(5, pageHeight - 15, pageWidth - 10, 10, 'F');
        doc.setFontSize(7);
        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.text(`NEURAL PACKET DATA // PAGE ${page} // END_OF_LOG: FALSE`, 15, pageHeight - 9);
        doc.text(`(C) MIND MATRIX ARCHIVES // ${new Date().getFullYear()}`, pageWidth - 70, pageHeight - 9);
      };

      let yPos = 50;
      let currentPage = 1;
      drawCyberBackground(currentPage);
      drawHeader(true);
      drawFooter(currentPage);

      messages.forEach((msg) => {
        const text = msg.parts[0].text || "";
        const lines = doc.splitTextToSize(text, pageWidth - 45);
        const entryHeight = (lines.length * 5) + 20;
        if (yPos + entryHeight > pageHeight - 25) {
          doc.addPage();
          currentPage++;
          yPos = 50;
          drawCyberBackground(currentPage);
          drawHeader(false);
          drawFooter(currentPage);
        }
        doc.setDrawColor(msg.role === 'model' ? accentColor[0] : primaryColor[0], msg.role === 'model' ? accentColor[1] : primaryColor[1], msg.role === 'model' ? accentColor[2] : primaryColor[2]);
        doc.setLineWidth(0.3);
        doc.setFillColor(15, 15, 20);
        doc.rect(12, yPos, pageWidth - 24, entryHeight - 5, 'F');
        doc.rect(12, yPos, pageWidth - 24, entryHeight - 5, 'S');
        doc.setFillColor(msg.role === 'model' ? accentColor[0] : primaryColor[0], msg.role === 'model' ? accentColor[1] : primaryColor[1], msg.role === 'model' ? accentColor[2] : primaryColor[2]);
        doc.rect(12, yPos, 45, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(msg.role === 'model' ? "NEURAL SYNTHESIS" : "OPERATOR OVERRIDE", 15, yPos + 4);
        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.setFontSize(6);
        doc.text(`T+ ${new Date(msg.timestamp).toLocaleTimeString()}`, pageWidth - 35, yPos + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(230, 230, 230);
        doc.text(lines, 18, yPos + 14);
        yPos += entryHeight + 5;
      });
      doc.save(`Neural_Intelligence_Report_${persona.name.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}.pdf`);
    } catch (e) {
      console.error("PDF SYNTHESIS FAILED:", e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleVoiceReply = async (msgId: string, text: string) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
      if (audioContextRef.current) audioContextRef.current.close().then(() => audioContextRef.current = null);
      return;
    }
    setPlayingAudioId(msgId);
    try {
      const base64Audio = await gemini.generateSpeech(text, 'Kore');
      if (base64Audio) {
        if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const decode = (base64: string) => {
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          return bytes;
        };
        const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
          const dataInt16 = new Int16Array(data.buffer);
          const frameCount = dataInt16.length / numChannels;
          const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
          for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
          }
          return buffer;
        };
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setPlayingAudioId(null);
        source.start();
      } else {
        setPlayingAudioId(null);
      }
    } catch (e) {
      setPlayingAudioId(null);
    }
  };

  const handleTranslate = async (msgId: string, text: string) => {
    if (translations[msgId]) {
      const next = { ...translations }; delete next[msgId]; setTranslations(next); return;
    }
    setTranslatingIds(prev => new Set(prev).add(msgId));
    try {
      const translated = await gemini.translateText(text, targetLang.name);
      setTranslations(prev => ({ ...prev, [msgId]: translated }));
    } catch (e) {
      console.error(e);
    } finally {
      setTranslatingIds(prev => { const n = new Set(prev); n.delete(msgId); return n; });
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditTrigger = (id: string, text: string) => {
    setEditingId(id);
    setInput(text);
    if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInput('');
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mind Matrix AI Session', text });
      } catch (e) {}
    } else {
      handleCopyText('share', text);
    }
  };

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !image) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);
    if (editingId) {
        onEdit(editingId, input);
        setEditingId(null);
    } else {
        onSend(input, image || undefined);
    }
    setInput(''); 
    setImage(null);
  };

  const handleRegenerate = (msg: Message) => {
    const userMsgs = messages.filter(m => m.role === 'user');
    const lastUserMsg = userMsgs[userMsgs.length - 1];
    if (lastUserMsg) onSend(lastUserMsg.parts[0].text || "");
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      <MatrixRain />
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-10 py-8 space-y-8 custom-scrollbar relative z-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-1000">
            <MindMatrixLogo size={128} />
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.2em] text-slate-950 dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-orbitron">
                Mind Matrix AI
              </h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                Welcome, Operator. Neural link established. System protocols are at your command. How shall we proceed?
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`w-[92%] sm:w-[80%] max-w-[500px] rounded-[2rem] px-5 py-4 border border-white/10 relative transition-all duration-500 ${
              msg.role === 'user' 
                ? 'bg-cyan-600/90 text-white shadow-[0_15px_30px_rgba(6,182,212,0.2)]' 
                : 'glass-card bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.3)]'
            } ${editingId === msg.id ? 'ring-4 ring-cyan-400/50 scale-[1.02] z-50 shadow-[0_0_40px_rgba(0,242,255,0.3)]' : ''}`}>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40 text-slate-950 dark:text-white mb-2 block font-orbitron">
                {msg.role === 'model' ? persona.name : 'Operator Log'}
              </span>
              <p className="text-[11px] sm:text-[12px] leading-relaxed whitespace-pre-wrap font-medium text-slate-950 dark:text-white tracking-tight">
                {msg.parts[0].text}
              </p>
              {translations[msg.id] && (
                <div className="pt-3 border-t border-black/10 dark:border-white/10 mt-3 italic text-[10px] sm:text-[11px] text-cyan-600 dark:text-cyan-400 font-bold animate-in slide-in-from-bottom-2">
                  {translations[msg.id]}
                </div>
              )}
              {msg.parts[1]?.inlineData && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={`data:${msg.parts[1].inlineData.mimeType};base64,${msg.parts[1].inlineData.data}`} className="w-full h-auto max-h-80 object-contain bg-black/5" />
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  {msg.role === 'model' && (
                    <button onClick={() => handleVoiceReply(msg.id, msg.parts[0].text || '')} className={`p-1.5 rounded-lg transition-all ${playingAudioId === msg.id ? 'text-cyan-500 animate-pulse bg-cyan-500/10' : 'text-slate-950 dark:text-white/30 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]'}`}>
                      <Volume2 size={13} />
                    </button>
                  )}
                  <button onClick={() => handleTranslate(msg.id, msg.parts[0].text || '')} className={`p-1.5 rounded-lg text-slate-950 dark:text-white/30 transition-all hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.9)] ${translatingIds.has(msg.id) ? 'animate-spin' : ''}`}>
                    {translatingIds.has(msg.id) ? <Loader2 size={13} /> : <Globe size={13} />}
                  </button>
                  <button onClick={() => handleCopyText(msg.id, msg.parts[0].text || '')} className="p-1.5 rounded-lg text-slate-950 dark:text-white/30 transition-all hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.9)]">
                    {copiedId === msg.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  </button>
                  <button onClick={() => handleShare(msg.parts[0].text || '')} className="p-1.5 rounded-lg text-slate-950 dark:text-white/30 transition-all hover:text-emerald-400 hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]">
                    <Share2 size={13} />
                  </button>
                  {msg.role === 'model' ? (
                    <button onClick={() => handleRegenerate(msg)} className="p-1.5 rounded-lg text-slate-950 dark:text-white/30 transition-all hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
                      <RefreshCw size={13} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEditTrigger(msg.id, msg.parts[0].text || "")} 
                      className={`p-1.5 rounded-lg transition-all ${editingId === msg.id ? 'text-cyan-400 bg-cyan-400/10 animate-pulse' : 'text-slate-950 dark:text-white/30 hover:text-cyan-400 hover:drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]'}`}
                      title="Temporal Edit"
                    >
                      <Pencil size={13} className={editingId === msg.id ? 'animate-spin-slow' : ''} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[#A5A9B4] font-sans">
                  <Clock size={9} className="opacity-40" />
                  <span className="text-[8px] font-black uppercase tracking-[0.1em] opacity-80">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="glass-card bg-white/5 backdrop-blur-2xl rounded-[2rem] p-4 sm:p-5 flex flex-col gap-3 border border-cyan-500/20 shadow-[0_10px_30px_rgba(0,242,255,0.1)] max-w-[200px]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/30 blur-lg rounded-full animate-pulse" />
                  <div className="relative w-10 h-10 rounded-xl bg-black/40 border border-cyan-500/30 flex items-center justify-center">
                    <Cpu size={18} className="text-cyan-400 animate-[spin_3s_linear_infinite]" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em] animate-pulse">Thinking...</span>
                  <div className="flex items-end gap-1 h-3">
                    <div className="w-1 bg-cyan-500 rounded-full animate-[loading-bar_1s_infinite_0ms]" />
                    <div className="w-1 bg-cyan-500 rounded-full animate-[loading-bar_1s_infinite_200ms]" />
                    <div className="w-1 bg-cyan-500 rounded-full animate-[loading-bar_1s_infinite_400ms]" />
                  </div>
                </div>
              </div>
              <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-full -translate-x-full animate-[loading-scan_2s_infinite_linear]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-10 relative z-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {editingId && (
            <div className="flex items-center justify-between px-6 py-2 bg-cyan-500/20 backdrop-blur-md rounded-t-3xl border-t border-x border-cyan-500/30 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3">
                 <History size={14} className="text-cyan-400 animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400 font-orbitron">Temporal Shift Active // Editing Logic Node</span>
              </div>
              <button onClick={cancelEdit} className="p-1 text-cyan-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={`glass-card p-2 flex items-center gap-2 backdrop-blur-3xl bg-white/95 dark:bg-black/50 border shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ${editingId ? 'rounded-b-[3.5rem] border-cyan-500/50' : 'rounded-[3.5rem] border-black/10 dark:border-white/10'}`}>
            <div className="flex items-center gap-1 pl-4">
              <BorderlessGlassTool icon={<Camera size={20} />} onClick={() => fileInputRef.current?.click()} colorClass="text-cyan-400" glowColor="#06b6d4" label="Imagery" active={!!image} />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setImage(r.result as string); r.readAsDataURL(f); } }} />
              <BorderlessGlassTool icon={<Lightbulb size={20} />} onClick={() => onTriggerIdeas?.()} colorClass="text-amber-400" glowColor="#f59e0b" label="Neural Ideas" isLoading={isLoading} />
              <BorderlessGlassTool icon={<Wand2 size={20} />} onClick={handleMagicPrompt} colorClass="text-purple-400" glowColor="#a855f7" label="Magic Insight" isLoading={isMagicThinking} />
              <BorderlessGlassTool icon={<FileDown size={20} />} onClick={handleExportPDF} colorClass="text-emerald-400" glowColor="#10b981" label="Neural PDF" disabled={messages.length === 0} isLoading={isExportingPDF} />
              <BorderlessGlassTool icon={<Trash2 size={20} />} onClick={() => setShowClearConfirm(true)} colorClass="text-rose-400" glowColor="#f43f5e" label="Wipe Memory" />
            </div>
            <textarea ref={textareaRef} rows={1} value={input} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)} onChange={(e) => setInput(e.target.value)} placeholder={editingId ? "Rewrite temporal directive..." : "Command Mind Matrix AI..."} className="flex-1 bg-transparent border-none py-4 px-4 text-[14px] sm:text-[16px] font-semibold focus:outline-none text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none max-h-[200px] leading-relaxed custom-scrollbar" />
            <div className="pr-4">
              <button 
                type="submit" 
                disabled={isLoading || (!input.trim() && !image)} 
                className={`relative w-14 h-14 rounded-full transition-all duration-300 transform flex items-center justify-center border border-white/20 shadow-2xl ${
                    isLoading || (!input.trim() && !image) 
                        ? 'bg-black/5 dark:bg-white/5 text-slate-500 opacity-20' 
                        : `${editingId ? 'bg-gradient-to-tr from-cyan-400 to-indigo-600' : 'bg-gradient-to-tr from-cyan-600 to-blue-700'} text-white hover:scale-110 active:scale-95 ${isFlashing ? 'animate-neon-flash scale-150' : ''}`
                }`}
              >
                <div className={`absolute inset-0 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity ${editingId ? 'bg-indigo-400/40' : 'bg-cyan-400/20'}`} />
                {editingId ? <RefreshCw size={24} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-spin-slow" /> : <Send size={24} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center gap-6">
            <div className="px-6 py-2.5 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-black/5 dark:border-white/10 flex items-center gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border-b-white/20">
               <button onClick={() => setShowLangPicker(true)} className="flex items-center gap-2 group transition-all">
                 <Globe size={14} className="text-cyan-500 group-hover:rotate-180 transition-transform duration-700 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                 <span className="text-[10px] font-black text-slate-950 dark:text-slate-400 uppercase tracking-widest font-orbitron">{targetLang.name}</span>
               </button>
               <div className="w-px h-4 bg-black/10 dark:bg-white/10" />
               <button onClick={onArchive} className="flex items-center gap-2 group transition-all">
                 <Archive size={14} className="text-amber-500 group-hover:scale-125 transition-transform drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
                 <span className="text-[10px] font-black text-slate-950 dark:text-slate-400 uppercase tracking-widest font-orbitron">Neural Vault</span>
               </button>
            </div>
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-sm glass-card p-10 rounded-[3rem] border border-red-500/30 text-center space-y-6 bg-white dark:bg-slate-900 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto text-red-500 shadow-inner"><AlertTriangle size={32}/></div>
              <div className="space-y-2">
                 <h4 className="text-xl font-black uppercase text-slate-950 dark:text-white tracking-tight font-orbitron">Wipe Memory?</h4>
                 <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-relaxed">Permanently clear current synaptic logs.</p>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-4 rounded-xl bg-black/5 dark:bg-white/5 text-[10px] font-black uppercase text-slate-950 dark:text-white hover:bg-black/10 transition-all font-orbitron">Go Back</button>
                 <button onClick={() => { onClear(); setShowClearConfirm(false); }} className="flex-1 py-4 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all font-orbitron">Clear All</button>
              </div>
           </div>
        </div>
      )}

      {showLangPicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="w-full max-w-sm glass-card rounded-[3rem] border-black/10 dark:border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white dark:bg-slate-900">
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                 <span className="text-xs font-black uppercase text-slate-950 dark:text-white font-orbitron">Neural Translation</span>
                 <button onClick={() => setShowLangPicker(false)} className="text-slate-500 hover:text-red-500 transition-colors"><XCircle size={20} /></button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                 {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => { setTargetLang(lang); setShowLangPicker(false); }} className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all font-orbitron ${targetLang.code === lang.code ? 'bg-cyan-500 text-white' : 'bg-black/5 dark:bg-white/5 text-slate-950 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                       {lang.name}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes neon-flash { 0% { filter: brightness(1) drop-shadow(0 0 0px #06b6d4); } 50% { filter: brightness(2.5) drop-shadow(0 0 30px #06b6d4); } 100% { filter: brightness(1) drop-shadow(0 0 0px #06b6d4); } }
        @keyframes loading-bar { 0%, 100% { height: 4px; opacity: 0.3; } 50% { height: 12px; opacity: 1; } }
        @keyframes loading-scan { 0% { transform: translateX(-100%); } 50% { transform: translateX(0); } 100% { transform: translateX(100%); } }
        .animate-neon-flash { animation: neon-flash 0.3s ease-out; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
};

export default ChatInterface;