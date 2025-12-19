"use client";

import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX,
  Cpu,
  Zap,
  Loader2,
  Bell,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useToast } from "@/components/ui/ToastProvider";

// --- CONFIGURATION ---
const SYSTEM_PROMPT = `Eres JARVIS. Tu personalidad es culta, sarcástica y eficiente. 
Tus respuestas deben ser brillantes y breves. Te diriges al usuario como "Señor".`;

export default function JarvisAssistant() {
  const [input, setInput] = useState('');
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [showNotification, setShowNotification] = useState(false);
  const { showToast } = useToast();
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""; 

  // --- AUDIO UTILS ---
  const pcmToWav = (pcmData: Int16Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + pcmData.length * 2);
    const view = new DataView(buffer);
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 32 + pcmData.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, pcmData.length * 2, true);
    for (let i = 0; i < pcmData.length; i++) view.setInt16(44 + i * 2, pcmData[i], true);
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const speak = async (text: string) => {
    if (isMuted) return;
    setStatus('SPEAKING');
    try {
      if (!apiKey) {
        showToast("Falta la API Key de Gemini", "error");
        setStatus('IDLE');
        return;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `British elegance, dry wit: ${text}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } }
          }
        })
      });
      const result = await response.json();
      const audioData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const binaryString = atob(audioData);
        const pcmData = new Int16Array(binaryString.length / 2);
        for (let i = 0; i < pcmData.length; i++) {
          pcmData[i] = (binaryString.charCodeAt(i * 2 + 1) << 8) | binaryString.charCodeAt(i * 2);
        }
        const wavBlob = pcmToWav(pcmData, 24000); 
        const audio = new Audio(URL.createObjectURL(wavBlob));
        audio.onended = () => setStatus('IDLE');
        await audio.play();
      } else { 
        setStatus('IDLE'); 
      }
    } catch (e) { 
      console.error(e);
      setStatus('IDLE'); 
    }
  };

  const handleAction = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    setLastResponse(null);
    setShowNotification(false);
    setIsProcessing(true);
    setStatus('THINKING');

    try {
        if (!apiKey) {
            showToast("Clave API de Gemini no configurada", "error");
            setIsProcessing(false);
            setStatus('IDLE');
            return;
        }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          tools: [{ google_search: {} }]
        })
      });
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Protocolo de error activo, señor.";
      
      setLastResponse(aiText);
      setShowNotification(true);
      setIsProcessing(false);
      speak(aiText);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      setStatus('IDLE');
    }
  };

  const toggleListening = () => {
    if (status === 'LISTENING') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => { setStatus('LISTENING'); setIsListening(true); };
      recognition.onresult = (e: any) => { 
        const transcript = e.results[0][0].transcript;
        handleAction(transcript); 
        setIsListening(false); 
      };
      recognition.onerror = (e: any) => {
          console.error("Speech Error:", e);
          setStatus('IDLE');
          setIsListening(false);
          showToast("Error de reconocimiento de voz", "error");
      };
      recognition.onend = () => { 
        if (status !== 'THINKING' && status !== 'SPEAKING') setStatus('IDLE'); 
        setIsListening(false); 
      };
      
      recognition.start();
    } else {
        showToast("Tu navegador no soporta reconocimiento de voz.", "error");
    }
  };

  // Border Gradient Logic: Active on Listening or Speaking or Thinking
  const isSystemActive = status !== 'IDLE';

  return (
    <div className="relative w-full h-[500px] min-h-[500px] shrink-0 mb-8 z-40 group select-none">
      
      {/* === MAIN CONTAINER === */}
      <div 
        className={clsx(
          "absolute inset-0 rounded-[32px] overflow-hidden transition-all duration-700",
          "bg-gradient-to-b from-[#0f172a] to-[#020617]", // Deep Slate/Navy gradient
          "border border-white/10 shadow-2xl shadow-black/50"
        )}
      >
        
        {/* === ACTIVE BORDER SYSTEM (Surrounds the Screen) === */}
        {/* The "lights" that move when user says something */}
        <div 
            className={clsx(
                "absolute inset-0 pointer-events-none transition-opacity duration-1000 z-0",
                isSystemActive ? "opacity-100" : "opacity-0"
            )}
        >
            {/* Moving Multi-Color Gradient Border */}
            <div className={clsx(
                "absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.8)_60deg,rgba(255,255,255,0.8)_120deg,rgba(16,185,129,0.8)_180deg,transparent_360deg)]",
                "mix-blend-screen opacity-100 animate-[spin_4s_linear_infinite]",
                status === 'SPEAKING' ? "duration-[2s]" : "duration-[4s]" 
            )}></div>
            
            {/* Illuminated Glow Behind Border */}
            <div className={clsx(
                "absolute -inset-[3px] rounded-[34px] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.5)_60deg,rgba(255,255,255,0.5)_120deg,rgba(16,185,129,0.5)_180deg,transparent_360deg)]",
                "blur-xl opacity-40 animate-[spin_4s_linear_infinite]",
                status === 'SPEAKING' ? "duration-[2s] opacity-60" : "duration-[4s]"
            )}></div>
            
            {/* Inner Mask to create the border line */}
            <div className="absolute inset-[1px] bg-[#020617] rounded-[32px] z-10"></div>
        </div>


        {/* === BACKGROUND LAYERS (Siri Aurora Effect) === */}
        {/* The "Liquid Aurora Surge" Interface Layer */}
        <div className={clsx(
            "absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000", 
            isSystemActive ? "opacity-100" : "opacity-0"
        )}>
           
           {/* 1. Chromatic Aurora Surge (Bottom Up) */}
           {/* Only show this surge animation when first activating if we had a transition state, but here we keep it active or loop it gently */}
           <div className="absolute inset-0 overflow-hidden">
               <div className={clsx(
                   "absolute bottom-[-30%] left-[-20%] w-[140%] h-[140%] backdrop-blur-3xl border-t-[6px] border-sky-400/40 shadow-[0_-15px_120px_rgba(56,189,248,0.5)]",
                   isSystemActive && "animate-[aurora-surge_4s_ease-in-out_infinite_alternate]" 
               )} />
               <div className={clsx(
                   "absolute bottom-[-30%] left-[-15%] w-[140%] h-[140%] backdrop-blur-3xl border-t-[2px] border-emerald-400/30 mix-blend-screen",
                   isSystemActive && "animate-[aurora-surge-delay_4s_ease-in-out_infinite_alternate]"
               )} />
               
               {/* Center Soft Light Bloom */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-white/20 rounded-full blur-[80px] animate-[soft-bloom_3s_ease-in-out_infinite]" />
           </div>

           {/* 2. Atmospheric Bleed */}
           <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-500/10 blur-[100px] animate-[slow-breathe_8s_ease-in-out_infinite]" />
            
           {/* 3. Premium Particle Dust */}
           <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full blur-[1px] animate-[float-slow_6s_linear_infinite]" />
                <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-sky-300 rounded-full blur-[0.5px] animate-[float-medium_8s_linear_infinite]" />
                <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-emerald-300 rounded-full blur-[1px] animate-[float-fast_5s_linear_infinite]" />
           </div>
        </div>

        {/* Base Background (Always visible) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] z-0 pointer-events-none"></div>


        {/* === HEADS UP DISPLAY (HUD) === */}
        {/* Top Left: Identity */}
        <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
          <div className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-500",
            isSystemActive ? "bg-cyan-500/10 border-cyan-400/50" : "bg-white/5 border-white/10"
          )}>
             <Cpu size={14} className={isSystemActive ? "text-cyan-400 animate-pulse" : "text-slate-500"} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white">NSG SYSTEM</span>
            <span className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-widest">v2.4.0 • ONLINE</span>
          </div>
        </div>

        {/* Top Right: Controls */}
        <div className="absolute top-8 right-8 z-30 flex gap-2">
           <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
           >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
           </button>
        </div>


        {/* === CENTER: REACTOR ARC CENTRAL INTERACTIVO (Technologic Style) === */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pb-12">
            
            {/* Core Button / Visualizer */}
            <button 
              onClick={toggleListening}
              className="relative group focus:outline-none cursor-pointer"
            >
              {/* Outer Segmented Ring */}
              <div className="absolute -inset-12 border border-cyan-500/5 rounded-full"></div>
              
              {/* Rotating Segments (Technologic Circles) */}
              <div className="absolute -inset-8 border-t-[1px] border-b-[1px] border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute -inset-8 border-l-[1px] border-r-[1px] border-cyan-400/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

              {/* Siri/Apple Listen Glow */}
              <div className={clsx(
                  "absolute -inset-4 rounded-full transition-all duration-700 blur-xl opacity-0",
                  status === 'LISTENING' && "opacity-80 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-pulse scale-110"
              )}>
              </div>

              {/* Core Body */}
              <div className={clsx(
                  "relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-slate-950 flex items-center justify-center transition-all duration-500 border border-cyan-500/30 overflow-hidden shadow-2xl",
                  status === 'IDLE' ? "border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : 
                  status === 'LISTENING' ? "border-white/40 scale-105 shadow-[0_0_40px_rgba(6,182,212,0.2)]" :
                  status === 'THINKING' ? "border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]" :
                  "border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
              )}>
                
                {/* Thinking Spinner Layers */}
                {status === 'THINKING' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                    <div className="absolute w-24 h-24 border border-dashed border-cyan-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                  </div>
                )}

                {/* Speaking Pulse Waves */}
                {status === 'SPEAKING' && [1, 2, 3].map(i => (
                  <div key={i} className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-[shockwave_2s_infinite]" style={{ animationDelay: `${i * 0.4}s` }}></div>
                ))}

                {/* Siri Waveform Mesh (Listening only) */}
                {status === 'LISTENING' && (
                  <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-[spin_2s_linear_infinite]"></div>
                )}

                {/* Inner Mechanical Core */}
                <div className={clsx(
                    "relative w-20 h-20 md:w-24 md:h-24 rounded-full border border-cyan-500/30 flex items-center justify-center bg-black transition-transform duration-500 shadow-inner",
                    status === 'LISTENING' ? "scale-90 bg-white" : "scale-100"
                )}>
                  <div className={clsx(
                      "w-8 h-8 rounded-full transition-all duration-500 blur-[2px]",
                      status === 'LISTENING' ? "bg-indigo-500" : "bg-cyan-500"
                  )}></div>
                  <div className="absolute inset-2 border border-dashed border-cyan-500/20 rounded-full"></div>
                </div>
              </div>
            </button>

            {/* Info Text */}
            <div className="mt-8 text-center z-30 space-y-2">
              <h2 className={clsx(
                  "text-lg font-light tracking-[0.3em] transition-all duration-500",
                  status === 'IDLE' ? "text-white/30" : "text-white"
              )}>
                {status === 'LISTENING' ? 'IDENTIFICANDO VOZ...' : 
                 status === 'THINKING' ? 'PROCESANDO DATOS' : 
                 status === 'SPEAKING' ? 'TRANSMITIENDO' : 'SISTEMA EN ESPERA'}
              </h2>
              <p className="text-[9px] tracking-[0.2em] text-cyan-500/60 uppercase font-mono">Haga clic en el núcleo para hablar</p>
            </div>
        </div>


        {/* === INPUT FIELD (Bottom Dock) === */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-sm z-30">
            <div className={clsx(
                "relative group flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-500",
                "bg-white/5 backdrop-blur-md border border-white/5",
                "hover:bg-white/10 hover:border-white/10 focus-within:bg-[#0B1121]/80 focus-within:border-white/20 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
            )}>
                 <Zap size={14} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                 <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAction(input)}
                    placeholder="Enter command..."
                    className="flex-1 bg-transparent border-none text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none font-medium tracking-wide"
                 />
            </div>
        </div>

        {/* === RESPONSE NOTIFICATION (Overlay) === */}
        <div className={clsx(
            "absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 transition-all duration-500 ease-out",
            showNotification ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        )}>
           <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl shadow-black relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-white to-emerald-500 opacity-50"></div>
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">System Response</span>
                 </div>
                 <button onClick={() => setShowNotification(false)} className="text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-light custom-scroll max-h-40 overflow-y-auto relative z-10">
                 {lastResponse}
              </p>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes music-bars {
            0%, 100% { height: 8px; opacity: 0.5; }
            50% { height: 20px; opacity: 1; }
        }
        @keyframes shockwave {
            0% { transform: scale(1); opacity: 0.8; border-width: 1px; }
            100% { transform: scale(2.5); opacity: 0; border-width: 0px; }
        }
      `}} />
    </div>
  );
}
