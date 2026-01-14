
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Neural Circuit Breach Detected:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('matrix_messages'); // Clear potentially corrupt state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[1000] bg-[#020205] flex items-center justify-center p-6 font-sans">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000012_1px,transparent_1px),linear-gradient(to_bottom,#ff000012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          </div>
          
          <div className="w-full max-w-md glass-card p-10 rounded-[3.5rem] border border-red-500/30 text-center space-y-8 bg-black/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-500">
            <div className="relative mx-auto w-24 h-24">
               <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
               <div className="relative w-full h-full rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner">
                  <ShieldAlert size={48} className="animate-bounce" />
               </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white font-orbitron">Synaptic Failure</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
                The Neural Core has encountered an unhandled exception. Automatic containment protocols initiated.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-[9px] font-mono text-red-400/70 break-all overflow-hidden max-h-24">
              FAULT_ID: {this.state.error?.name || 'CORE_ERR'}<br/>
              MESSAGE: {this.state.error?.message || 'Unknown synaptic breach'}
            </div>

            <button 
              onClick={this.handleReset}
              className="w-full py-5 rounded-[2rem] bg-red-500 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_20px_40px_rgba(239,68,68,0.3)]"
            >
              <RefreshCw size={16} /> Re-Sync Neural Link
            </button>
          </div>
        </div>
      );
    }

    // Fix: Access children from props
    return this.props.children;
  }
}

export default ErrorBoundary;
