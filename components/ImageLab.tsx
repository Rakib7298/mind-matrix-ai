
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gemini } from '../geminiService';
import { 
  Sparkles, ImageIcon, Download, Wand2, Camera, Plus, Brain, X, 
  Zap, Loader2, Orbit, Shapes, AlertTriangle, Save, PenTool, 
  Wind, Ghost, Target, ChevronDown, Layout, Palette, Box, Brush, Command, Activity, Maximize2, Settings2, Sliders, Eye, Sun, Contrast, Droplets, Megaphone, History
} from 'lucide-react';
import { UserStats, SavedImage } from '../types';

interface ImageLabProps {
  onUpdateStats?: (newStats: Partial<UserStats>) => void;
}

const ASPECT_RATIOS = ["1:1", "4:5", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9"];
const UPSCALE_ALGORITHMS = ["Neural Enhanced", "Ultra Realistic", "Cinematic Sharp", "Deep Textures"];

const STYLE_PRESETS = [
  "Cyberpunk", "Fantasy", "Anime", "Studio Ghibli", "Oil Painting", "Pencil Sketch", "Low Poly", "Holographic", "3D Render", "Steampunk",
  "Minimalist", "Surrealism", "Vaporwave", "Synthwave", "Gothic", "Baroque", "Renaissance", "Impressionist", "Cubist", "Pop Art",
  "Pixel Art", "Vector Art", "Flat Design", "Isometric", "Origami", "Papercut", "Claymation", "Watercolor", "Charcoal", "Blueprint",
  "X-ray", "Infrared", "Thermal", "Glitch Art", "Double Exposure", "Bokeh", "Golden Hour", "Long Exposure", "Macro", "Fisheye",
  "Tilt-shift", "Retro", "Futuristic", "Post-Apocalyptic", "Brutalist", "Art Deco", "Art Nouveau", "Bauhaus", "Ukiyo-e", "Cybernetic"
];

const AESTHETIC_PROTOCOLS = [
  "High Contrast", "Low Contrast", "Vibrant", "Muted", "Warm", "Cool", "Sepia", "Monochrome", "Duotone", "Pastel",
  "Neon Glow", "Metallic", "Glossy", "Matte", "Soft Lighting", "Hard Lighting", "Volumetric", "Rim Lighting", "Backlit", "Silhouetted",
  "Grainy", "Sharp", "Dreamy", "Moody", "Dark", "Bright", "High Key", "Low Key", "Saturated", "Desaturated",
  "Analog", "Digital", "Film Grain", "Lomo", "Vintage", "Modern", "Elegant", "Grungy", "Industrial", "Organic",
  "Geometric", "Symmetric", "Asymmetric", "Balanced", "Chaotic", "Dynamic", "Static", "Zen", "Overexposed", "Underexposed"
];

const KEYWORDS = [
  "Intricate detail", "Masterpiece", "High resolution", "Textural", "Atmospheric", "Hyper-detailed", "4k", "8k", "Sharp focus", "Soft edges",
  "Dramatic lighting", "Cinematic composition", "Epic scale", "Micro-details", "Surface textures", "Depth of field", "Motion blur", "Reflections", "Refractions", "Caustics",
  "Subsurface scattering", "Particles", "Dust", "Fog", "Smoke", "Fire", "Water", "Ice", "Snow", "Rain",
  "Clouds", "Stars", "Nebula", "Galaxy", "Forest", "Desert", "Ocean", "Cityscape", "Interior", "Portrait",
  "Full body", "Close up", "Wide angle", "Low angle", "High angle", "Eye level", "Abstract", "Symmetrical", "Geometric", "Surreal"
];

/**
 * Premium 3D Neon Thunder Action Button
 */
const NeuralThunderButton: React.FC<{
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  label: string;
}> = ({ onClick, isLoading, disabled, label }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative w-full py-12 rounded-[4rem] overflow-hidden transition-all duration-700 preserve-3d glass-card border flex items-center justify-center gap-8 group shadow-2xl ${
        disabled 
          ? 'opacity-30 cursor-not-allowed border-white/5' 
          : 'border-red-500/40 hover:border-red-500/70 shadow-[0_20px_60px_rgba(239,68,68,0.25)] active:scale-95'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="relative z-10 flex items-center gap-8">
        <div className={`relative transition-all duration-700 ${isLoading ? 'scale-150' : 'group-hover:scale-125'}`}>
          <div className={`absolute inset-0 bg-red-500/30 blur-3xl rounded-full transition-all duration-700 ${isLoading ? 'animate-pulse scale-150' : 'opacity-0 group-hover:opacity-40'}`} />
          <div className={`preserve-3d relative ${isLoading ? 'animate-[spin_1.5s_linear_infinite]' : 'group-hover:rotate-y-180 transition-transform duration-700'}`}>
            <Zap size={64} className={`text-red-500 fill-red-500 drop-shadow-[0_0_30px_rgba(255,49,49,1)] transition-all ${isLoading ? 'scale-110' : ''}`} />
            <Zap size={64} className="absolute inset-0 text-white opacity-20 blur-[1px]" style={{ transform: 'translateZ(10px)' }} />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xl sm:text-2xl font-black uppercase tracking-[0.6em] dark:text-white light:text-black drop-shadow-2xl">
            {isLoading ? "Synthesizing" : label}
          </span>
          <div className={`h-1.5 rounded-full bg-red-500/30 mt-2 transition-all duration-1000 ${isLoading ? 'w-48 bg-red-500 animate-pulse' : 'w-16 group-hover:w-32 group-hover:bg-red-500'}`} />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
};

const ImageLab: React.FC<ImageLabProps> = ({ onUpdateStats }) => {
  const [mode, setMode] = useState<'generate' | 'edit' | 'upscale' | 'gallery'>('generate');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [upscaleAlgo, setUpscaleAlgo] = useState(UPSCALE_ALGORITHMS[0]);
  const [size, setSize] = useState('1K');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isMagicThinking, setIsMagicThinking] = useState(false);

  // Edit Mode Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  useEffect(() => {
    const storedGallery = localStorage.getItem('mind_matrix_image_gallery');
    if (storedGallery) try { setSavedImages(JSON.parse(storedGallery)); } catch (e) {}
  }, []);

  const promptScore = useMemo(() => {
    if (!prompt.trim()) return 0;
    const words = prompt.trim().split(/\s+/).length;
    let score = words * 5 + selectedStyles.length * 8 + selectedProtocols.length * 6 + selectedKeywords.length * 4;
    return Math.min(score, 100);
  }, [prompt, selectedStyles, selectedProtocols, selectedKeywords]);

  const meterColor = useMemo(() => {
    if (promptScore < 30) return 'rgba(239, 68, 68, 0.8)'; // Red
    if (promptScore < 70) return 'rgba(234, 179, 8, 0.8)'; // Yellow
    return 'rgba(6, 182, 212, 0.8)'; // Cyan/Green
  }, [promptScore]);

  const suggestedKeywords = useMemo(() => {
    const used = prompt.toLowerCase();
    return KEYWORDS.filter(k => !used.includes(k.toLowerCase())).slice(0, 5);
  }, [prompt]);

  const handleAction = async () => {
    if (mode === 'generate' && !prompt.trim()) return;
    if ((mode === 'edit' || mode === 'upscale') && !sourceImage) return;
    
    setIsLoading(true); setError(null);
    try {
      let finalPrompt = prompt;
      if (mode === 'upscale') {
        finalPrompt = `Upscale this image using ${upscaleAlgo} algorithm, ultra-realistic high definition 4k resolution, extreme details, cinematic clarity.`;
      } else if (mode === 'edit') {
        finalPrompt = `${prompt}. (Apply adjustments: brightness ${brightness}%, contrast ${contrast}%, saturation ${saturation}%)`;
      } else {
        if (selectedStyles.length) finalPrompt += `, style: ${selectedStyles.join(', ')}`;
        if (selectedProtocols.length) finalPrompt += `, aesthetics: ${selectedProtocols.join(', ')}`;
        if (selectedKeywords.length) finalPrompt += `, keywords: ${selectedKeywords.join(', ')}`;
      }

      let res;
      if (mode === 'generate') {
        res = await gemini.generateImage(finalPrompt, { aspectRatio, imageSize: size });
      } else if (mode === 'edit' && sourceImage) {
        res = await gemini.editImage(sourceImage, finalPrompt, 'image/jpeg');
      } else if (mode === 'upscale' && sourceImage) {
        res = await gemini.editImage(sourceImage, finalPrompt, 'image/jpeg');
      }

      if (res?.url) {
        setResultImage(res.url);
        if (onUpdateStats) onUpdateStats({ tokenUsage: res.tokens });
      }
    } catch (err) {
      setError("Neural link interrupted. Re-sync recommended.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicPrompt = async () => {
    if (isMagicThinking) return;
    setIsMagicThinking(true);
    try {
      const selections = {
        styles: selectedStyles,
        aesthetics: selectedProtocols,
        keywords: selectedKeywords
      };
      const advancedPrompt = await gemini.generateCreativePrompt(prompt, selections);
      let i = 0;
      setPrompt("");
      const interval = setInterval(() => {
        setPrompt(advancedPrompt.substring(0, i + 1));
        i++;
        if (i === advancedPrompt.length) clearInterval(interval);
      }, 10);
    } catch (e) { console.error(e); } finally { setIsMagicThinking(false); }
  };

  const handleAdPrompt = async () => {
    if (isMagicThinking) return;
    setIsMagicThinking(true);
    try {
      const adInstruction = "Synthesize an extremely high-end professional commercial advertisement prompt based on my current vision. Include keywords for lighting, product placement, and high-fidelity textures.";
      const adPrompt = await gemini.generateCreativePrompt(adInstruction + "\n" + prompt);
      setPrompt(adPrompt);
    } catch (e) { console.error(e); } finally { setIsMagicThinking(false); }
  };

  const saveToGallery = () => {
    if (!resultImage) return;
    setIsSaving(true);
    const newImage: SavedImage = { 
        id: crypto.randomUUID(), url: resultImage, prompt: prompt || 'Neural Archive', timestamp: Date.now(), 
        aspectRatio, size, styleIds: selectedStyles, mockupId: null 
    };
    const updated = [newImage, ...savedImages];
    setSavedImages(updated);
    localStorage.setItem('mind_matrix_image_gallery', JSON.stringify(updated));
    setTimeout(() => setIsSaving(false), 600);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setSourceImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden font-sans transition-all duration-500">
      <header className="h-16 flex items-center justify-between px-6 sm:px-10 border-b border-white/5 bg-black/40 dark:bg-black/20 backdrop-blur-3xl z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg">
            <Command size={20} />
          </div>
          <h2 className="text-[13px] font-black uppercase tracking-[0.5em] dark:text-white light:text-black">Imaging Protocol v11.0</h2>
        </div>
        <nav className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5 space-x-1 shadow-inner">
          {(['generate', 'edit', 'upscale', 'gallery'] as const).map(m => (
            <button 
              key={m} 
              onClick={() => setMode(m)} 
              className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-cyan-500 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
            >
              {m}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 bg-transparent relative flex flex-col">
          <div className="max-w-4xl mx-auto w-full space-y-12 pb-32">
            {mode === 'gallery' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {savedImages.length === 0 ? (
                  <div className="col-span-full py-48 text-center flex flex-col items-center gap-8 opacity-20">
                    <ImageIcon size={80} className="dark:text-white light:text-black" />
                    <span className="text-[14px] font-black uppercase tracking-[0.6em] dark:text-white light:text-black">Archives Offline</span>
                  </div>
                ) : (
                  savedImages.map(img => (
                    <div key={img.id} className="relative group rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all hover:scale-105 bg-black/40 aspect-square">
                      <img src={img.url} className="w-full h-full object-cover" alt="Saved" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-8 transition-all backdrop-blur-xl">
                        <button onClick={() => { const l = document.createElement('a'); l.href = img.url; l.download = 'archive.png'; l.click(); }} className="p-5 rounded-full bg-cyan-500 text-white mb-4 shadow-2xl hover:scale-110 active:scale-95"><Download size={24}/></button>
                        <span className="text-[10px] font-black text-white uppercase text-center line-clamp-3 tracking-widest leading-relaxed">{img.prompt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-12 animate-in fade-in duration-700">
                <section className="space-y-8">
                  {(mode === 'edit' || mode === 'upscale') && (
                    <div className="space-y-6 animate-in slide-in-from-top-4">
                      <div className="flex items-center gap-3 px-2">
                         <Camera size={18} className="text-cyan-400" />
                         <span className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-white light:text-black">Input Tensor</span>
                      </div>
                      <div 
                        onClick={() => document.getElementById('fileInput')?.click()}
                        className="w-full h-72 rounded-[3.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:border-cyan-500/40 bg-white/5 group relative overflow-hidden shadow-2xl"
                      >
                        {sourceImage ? (
                          <img src={sourceImage} style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }} className="w-full h-full object-contain p-10 transition-transform duration-700 group-hover:scale-105" alt="Source" />
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                             <div className="p-5 rounded-[2rem] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-xl"><Plus size={32}/></div>
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Inject Component</span>
                          </div>
                        )}
                        <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                      </div>

                      {mode === 'edit' && sourceImage && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                           <div className="space-y-3 glass-card p-5 rounded-[2rem] border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                 <Sun size={14} className="text-amber-400" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Brightness</span>
                              </div>
                              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full accent-cyan-500" />
                           </div>
                           <div className="space-y-3 glass-card p-5 rounded-[2rem] border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                 <Contrast size={14} className="text-violet-400" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Contrast</span>
                              </div>
                              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full accent-cyan-500" />
                           </div>
                           <div className="space-y-3 glass-card p-5 rounded-[2rem] border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                 <Droplets size={14} className="text-rose-400" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Saturation</span>
                              </div>
                              <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(parseInt(e.target.value))} className="w-full accent-cyan-500" />
                           </div>
                        </div>
                      )}
                    </div>
                  )}

                  {mode !== 'upscale' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-3">
                           <Brain size={18} className="text-cyan-400" />
                           <span className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-white light:text-black">Neural Directives</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <button onClick={handleAdPrompt} disabled={isMagicThinking} className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20 flex items-center gap-2">
                             <Megaphone size={16} /> <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">Craft Ad</span>
                           </button>
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <textarea 
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={isMagicThinking ? "Architecting Advanced Prompt..." : "Command your artistic vision..."}
                          className="w-full min-h-[180px] bg-black/40 dark:bg-white/5 backdrop-blur-[60px] border border-white/10 rounded-[3rem] p-10 text-sm sm:text-base focus:outline-none focus:border-cyan-500/40 transition-all dark:text-white light:text-black shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative z-10 custom-scrollbar leading-relaxed"
                        />
                        <button 
                           onClick={handleMagicPrompt}
                           disabled={isMagicThinking}
                           className={`absolute right-8 bottom-8 p-5 rounded-3xl transition-all border shadow-2xl z-20 hover:scale-110 active:scale-95 ${
                             isMagicThinking ? 'bg-violet-500/20 border-violet-500 text-violet-400 animate-pulse' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500 hover:text-white'
                           }`}
                        >
                          <Wand2 size={24} />
                        </button>
                      </div>

                      {/* UPGRADED 3D GLOWING LOGIC METER */}
                      <div className="space-y-4 px-2">
                         <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Synthesis Logic Meter</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: meterColor }}>{promptScore}% Efficiency</span>
                         </div>
                         <div className="relative w-full h-6 bg-white/5 dark:bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-xl shadow-inner">
                            <div 
                              className="h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] relative" 
                              style={{ 
                                width: `${promptScore}%`, 
                                backgroundColor: meterColor,
                                boxShadow: `0 0 25px ${meterColor}, inset 0 0 10px rgba(255,255,255,0.2)` 
                              }}
                            >
                               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                            </div>
                         </div>
                         
                         {/* KEYWORD SUGGESTIONS */}
                         <div className="flex flex-wrap items-center gap-3 animate-in fade-in duration-700">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Enhance Signal:</span>
                            {suggestedKeywords.map(k => (
                               <button 
                                key={k} 
                                onClick={() => setPrompt(prev => prev ? `${prev}, ${k}` : k)}
                                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-slate-500 hover:border-cyan-500/30 hover:text-cyan-400 transition-all uppercase tracking-widest"
                               >
                                 + {k}
                               </button>
                            ))}
                         </div>
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-8">
                  <div className="flex items-center gap-3 px-3">
                     <Activity size={18} className="text-cyan-400" />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-white light:text-black">Synthesis Viewport</span>
                  </div>
                  <div className="relative aspect-[16/9] rounded-[4rem] border border-white/10 bg-black/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden group/viewport flex items-center justify-center transition-all duration-1000">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_100%)] pointer-events-none" />
                    {resultImage ? (
                      <>
                        <img src={resultImage} className="w-full h-full object-cover transition-all duration-[4000ms] group-hover/viewport:scale-105" alt="Synthesis Result" />
                        <div className="absolute bottom-12 left-12 right-12 flex items-center justify-center gap-6 opacity-0 group-hover/viewport:opacity-100 transition-all duration-700 backdrop-blur-md p-6 rounded-[3rem] border border-white/10">
                          <button onClick={saveToGallery} className="flex-1 py-5 rounded-3xl glass-card bg-black/60 border-white/10 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black/90 flex items-center justify-center gap-4 transition-all hover:scale-105">
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Secure Node
                          </button>
                          <button onClick={() => { const l = document.createElement('a'); l.href = resultImage!; l.download = 'synthesis.png'; l.click(); }} className="flex-1 py-5 rounded-3xl bg-cyan-500 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all hover:scale-105">
                            <Download size={18} /> Sync Memory
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-8 opacity-20">
                         <Shapes size={96} className="text-white animate-[spin_60s_linear_infinite]" />
                         <div className="space-y-4 text-center">
                            <span className="text-[16px] font-black uppercase tracking-[0.8em] dark:text-white light:text-black">Idle Frequency</span>
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce delay-100" />
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-200" />
                            </div>
                         </div>
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_4px,4px_100%]" />
                  </div>
                </section>

                <div className="max-w-2xl mx-auto w-full pt-10">
                  <NeuralThunderButton 
                    onClick={handleAction}
                    isLoading={isLoading}
                    disabled={mode === 'generate' ? !prompt.trim() : !sourceImage}
                    label={mode === 'upscale' ? 'Enhance Core' : 'Synthesize Vision'}
                  />
                  {error && (
                    <div className="mt-8 flex items-center gap-5 p-6 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-[0.3em] animate-in slide-in-from-top-6 shadow-2xl">
                      <AlertTriangle size={24} />
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* REFINED CONFIGURATION SIDEBAR (Right) */}
        <aside className="hidden lg:flex w-80 xl:w-[24rem] border-l border-white/5 bg-black/40 dark:bg-transparent backdrop-blur-[120px] flex-col shrink-0 z-40 relative">
          <div className="h-16 flex items-center px-10 border-b border-white/5 shadow-md">
             <div className="flex items-center gap-3">
                <Sliders size={18} className="text-cyan-400" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] dark:text-white light:text-black">Configuration</span>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-24">
            
            {/* Aspect Ratio Fluid Glass Bar */}
            <div className="group/section">
               <div className="flex items-center justify-between mb-4 px-4 transition-all duration-500">
                  <div className="flex items-center gap-3 cursor-help">
                    <Layout size={16} className="text-amber-400" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-70 group-hover/section:opacity-100 group-hover/section:text-amber-400 transition-all">Frame Aspect</span>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[8px] font-black text-slate-500 uppercase">{aspectRatio}</span>
                  </div>
               </div>
               <div className="max-h-0 opacity-0 group-hover/section:max-h-[350px] group-hover/section:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden p-2 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-transparent group-hover/section:border-white/10 shadow-inner grid grid-cols-2 gap-2">
                 {ASPECT_RATIOS.map(r => (
                   <button key={r} onClick={() => setAspectRatio(r)} className={`px-4 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest border ${aspectRatio === r ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}`}>
                     {r}
                   </button>
                 ))}
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full mt-1 group-hover/section:opacity-0 transition-opacity" />
            </div>

            <div className="group/section">
               <div className="flex items-center justify-between mb-4 px-4 transition-all duration-500">
                  <div className="flex items-center gap-3 cursor-help">
                    <Palette size={16} className="text-cyan-400" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-70 group-hover/section:opacity-100 group-hover/section:text-cyan-400 transition-all">Visual Styles</span>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[8px] font-black text-slate-500">{selectedStyles.length}</span>
                  </div>
               </div>
               <div className="max-h-0 opacity-0 group-hover/section:max-h-[350px] group-hover/section:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto custom-scrollbar-sidebar space-y-2 pr-2 p-2 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-transparent group-hover/section:border-white/10 shadow-inner">
                 {STYLE_PRESETS.map(s => (
                   <button key={s} onClick={() => toggleItem(selectedStyles, setSelectedStyles, s)} className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedStyles.includes(s) ? 'bg-cyan-500 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'}`}>{s}</button>
                 ))}
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full mt-1 group-hover/section:opacity-0 transition-opacity" />
            </div>

            <div className="group/section">
               <div className="flex items-center justify-between mb-4 px-4 transition-all duration-500">
                  <div className="flex items-center gap-3 cursor-help">
                    <Box size={16} className="text-violet-400" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-70 group-hover/section:opacity-100 group-hover/section:text-violet-400 transition-all">Aesthetics</span>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[8px] font-black text-slate-500">{selectedProtocols.length}</span>
                  </div>
               </div>
               <div className="max-h-0 opacity-0 group-hover/section:max-h-[350px] group-hover/section:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto custom-scrollbar-sidebar space-y-2 pr-2 p-2 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-transparent group-hover/section:border-white/10 shadow-inner">
                 {AESTHETIC_PROTOCOLS.map(p => (
                   <button key={p} onClick={() => toggleItem(selectedProtocols, setSelectedProtocols, p)} className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedProtocols.includes(p) ? 'bg-violet-500 border-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'}`}>{p}</button>
                 ))}
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full mt-1 group-hover/section:opacity-0 transition-opacity" />
            </div>

            {/* Neural Prompts History Fluid Glass Bar */}
            <div className="group/section">
               <div className="flex items-center justify-between mb-4 px-4 transition-all duration-500">
                  <div className="flex items-center gap-3 cursor-help">
                    <History size={16} className="text-emerald-400" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-70 group-hover/section:opacity-100 group-hover/section:text-emerald-400 transition-all">Neural History</span>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[8px] font-black text-slate-500">{savedImages.length}</span>
                  </div>
               </div>
               <div className="max-h-0 opacity-0 group-hover/section:max-h-[350px] group-hover/section:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto custom-scrollbar-sidebar space-y-3 pr-2 p-2 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-transparent group-hover/section:border-white/10 shadow-inner">
                 {savedImages.length === 0 ? (
                   <div className="py-10 text-center opacity-20 flex flex-col items-center gap-3">
                      <Shapes size={32} />
                      <span className="text-[8px] font-black uppercase tracking-widest">History Empty</span>
                   </div>
                 ) : (
                   savedImages.slice(0, 15).map(img => (
                     <button 
                       key={img.id} 
                       onClick={() => setPrompt(img.prompt)}
                       className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group/histitem flex flex-col gap-2"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">{new Date(img.timestamp).toLocaleDateString()}</span>
                           <Layout size={10} className="text-slate-700" />
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-relaxed uppercase tracking-tight group-hover/histitem:text-slate-300">{img.prompt}</p>
                     </button>
                   ))
                 )}
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full mt-1 group-hover/section:opacity-0 transition-opacity" />
            </div>

            <div className="group/summary mt-12 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl transition-all hover:bg-white/10">
               <div className="flex items-center gap-3 mb-6">
                 <Eye size={16} className="text-cyan-400" />
                 <span className="text-[11px] font-black uppercase tracking-[0.4em] dark:text-white">Active Signal Profile</span>
               </div>
               <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Fragments</span>
                     <div className="flex flex-wrap gap-2">
                        {selectedStyles.map(s => <span key={s} className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[8px] font-black uppercase border border-cyan-500/20">{s}</span>)}
                        {selectedProtocols.map(p => <span key={p} className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-[8px] font-black uppercase border border-violet-500/20">{p}</span>)}
                        {selectedKeywords.map(k => <span key={k} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase border border-emerald-500/20">{k}</span>)}
                        {(selectedStyles.length === 0 && selectedProtocols.length === 0 && selectedKeywords.length === 0) && (
                           <span className="text-[9px] font-medium italic text-slate-600">No active signal fragments selected.</span>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 10px; }
        body.dark-mode .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
        body.light-mode .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.8) !important; }
        .custom-scrollbar-sidebar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb { border-radius: 10px; background: rgba(0, 242, 255, 0.1); }
        body.light-mode .custom-scrollbar-sidebar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2) !important; }
        .preserve-3d { transform-style: preserve-3d; perspective: 1500px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
};

export default ImageLab;
