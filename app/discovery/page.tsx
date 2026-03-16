"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Sparkles, 
    ArrowRight, 
    Bot, 
    Zap, 
    Target, 
    Cpu, 
    ChevronRight,
    MessageSquare,
    Mic,
    MoreHorizontal,
    X
} from "lucide-react";
import ThemeProvider from "@/components/providers/ThemeProvider";
import DiscoveryStudio, { EliteAtom } from "@/components/discovery/DiscoveryStudio";

const MODELS = [
    {
        name: "Gemini 3.1 Pro (Google)",
        highlight: "1M Tokens • ARC-AGI-2: 77.1%",
        desc: "Líder en investigación y razonamiento abstracto. Ideal para análisis profundo de grandes volúmenes de info."
    },
    {
        name: "Claude Opus 4.6 (Anthropic)",
        highlight: "SWE-Bench: 79.6% • Líder en Razonamiento",
        desc: "Excelente en tareas complejas y autónomas. Ideal para desarrollo de agentes inteligentes avanzados."
    },
    {
        name: "GPT-5.2 (OpenAI)",
        highlight: "Ecosistema Maduro • Rendimiento Sólido",
        desc: "Potente en aplicaciones generales e integración de herramientas. El ecosistema más maduro y productivo."
    }
];

const VALUE_PROPS = [
    "Resultados Garantizados.",
    "Potencia Sin Límites.",
    "Tu Futuro, Programado.",
    "IA de Élite Real."
];

function PropositionSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % VALUE_PROPS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-10 sm:h-20 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.2, filter: "blur(15px)" }}
                    transition={{ 
                        duration: 0.5, 
                        ease: [0.23, 1, 0.32, 1]
                    }}
                    className="text-white text-[24px] sm:text-6xl font-black leading-tight font-display text-center max-w-[340px] sm:max-w-none mx-auto tracking-tighter"
                >
                    {VALUE_PROPS[index].split(" ").map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03, duration: 0.4 }}
                            className={word === "IA" || word === "Élite" || word === "Impacto" || word === "Vanguardia" ? "text-blue-400 italic bg-clip-text" : ""}
                        >
                            {word}{" "}
                        </motion.span>
                    ))}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

function ModelSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % MODELS.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="flex flex-col items-center"
        >
            <div className="flex items-center gap-3 mb-2.5">
                <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)] animate-pulse" />
                <span className="text-[12px] sm:text-[18px] font-black text-white uppercase tracking-[0.4em] sm:tracking-[0.6em] font-mono">
                    {MODELS[index].name}
                </span>
            </div>
            
            <div className="mb-3">
                <p className="text-[10px] sm:text-[15px] font-black text-blue-400 uppercase tracking-[0.3em] sm:tracking-[0.5em] font-mono text-center">
                    {MODELS[index].highlight}
                </p>
            </div>
            
            <p className="text-[11px] sm:text-[16px] text-white/50 font-medium font-sans max-w-[450px] text-center leading-relaxed italic">
                {MODELS[index].desc}
            </p>
        </motion.div>
    );
}

const LandingAtom = () => (
    <div className="relative h-48 w-48 flex items-center justify-center scale-110">
        {/* Extreme Blue-Core Radiance */}
        <div className="absolute h-20 w-20 bg-blue-500/30 rounded-full blur-[70px] animate-pulse" />
        <div className="absolute h-14 w-14 bg-blue-400/20 rounded-full blur-[40px]" />
        
        {/* Nucleus - Precision Blue Core */}
        <div className="absolute h-9 w-9 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,1),0_0_100px_rgba(37,99,235,0.9)] z-10 border border-blue-200 overflow-hidden flex items-center justify-center">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#fff_0%,_#3b82f6_100%)] opacity-90" />
            <div className="absolute h-4 w-4 bg-blue-600 rounded-full blur-[2px] shadow-[0_0_15px_rgba(37,99,235,1)]" />
        </div>
        
        {/* High-Precision Orbits with Trails */}
        {[
            { rotateX: 75, rotateY: 0, rotateZ: 0, duration: 5, color: "rgba(255,255,255,0.2)" },
            { rotateX: 75, rotateY: 45, rotateZ: 120, duration: 7, color: "rgba(59,130,246,0.25)" },
            { rotateX: 75, rotateY: -45, rotateZ: 240, duration: 9, color: "rgba(59,130,246,0.25)" }
        ].map((orbit, i) => (
            <motion.div
                key={i}
                className="absolute inset-0 border-[1.5px] rounded-full"
                style={{
                    rotateX: orbit.rotateX,
                    rotateY: orbit.rotateY,
                    rotateZ: orbit.rotateZ,
                    borderColor: orbit.color
                }}
                animate={{ rotateZ: orbit.rotateZ + 360 }}
                transition={{
                    duration: orbit.duration,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,1),0_0_12px_rgba(59,130,246,1)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-px bg-linear-to-t from-blue-500/0 via-blue-400/60 to-white/90 -translate-y-[80%] blur-[1px]" />
            </motion.div>
        ))}
        
        {/* Secondary Atmosphere Rings */}
        <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full scale-[1.5] animate-[spin_50s_linear_infinite]" />
        <div className="absolute inset-0 border-[0.5px] border-blue-500/5 rounded-full scale-[1.9] animate-[spin_70s_linear_infinite_reverse]" />
    </div>
);

const BackgroundNetwork = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#020617]">
      {/* Blueprint Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:10px_10px] sm:bg-[size:20px_20px]" />
      
      {/* Scanning Line */}
      <motion.div 
        animate={{ y: ['-100%', '200%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-blue-500/20 to-transparent blur-[4px]"
      />
      
      {/* Radial Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_#1e3a8a40,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_#3b82f610,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,_#3b82f610,_transparent_50%)]" />
    </div>
  );
};

export default function DiscoveryPage() {
    const [isStarted, setIsStarted] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden flex flex-col items-center justify-start sm:justify-center py-10 sm:py-24 px-4 sm:px-6">
            {/* Background Network Layer */}
            <BackgroundNetwork />

            <div className="relative z-10 max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    {!isStarted ? (
                        <motion.div 
                            key="landing"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center text-center space-y-3 sm:space-y-10"
                        >
                            {/* Brand Identifier */}
                            <div className="flex flex-col items-center gap-3 sm:gap-8">
                                <div className="relative py-2 sm:py-10 scale-[0.55] sm:scale-100 origin-center -mb-4 sm:mb-0">
                                    <LandingAtom />
                                    <div className="absolute inset-0 bg-blue-500/10 blur-[100px] -z-10 rounded-full animate-pulse" />
                                </div>
                                
                                <div className="space-y-4 sm:space-y-10">
                                    <div className="flex flex-col items-center">
                                        <div className="px-5 py-2 sm:px-8 sm:py-3 bg-blue-500/10 backdrop-blur-3xl rounded-full border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                                            <h2 className="text-[9px] sm:text-[15px] font-black uppercase tracking-[0.2em] sm:tracking-[0.6em] text-blue-400 font-mono text-center whitespace-nowrap">
                                                E N G I N E E R I N G   P R O T O C O L   •   E L I T E
                                            </h2>
                                        </div>
                                    </div>
                                    <motion.h1 
                                        animate={{ 
                                            textShadow: [
                                                "0 0 30px rgba(255,255,255,0.15)",
                                                "0 0 60px rgba(255,255,255,0.25)",
                                                "0 0 30px rgba(255,255,255,0.15)"
                                            ]
                                        }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-[42px] sm:text-[10rem] font-display font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 text-center leading-[0.9] sm:leading-none"
                                    >
                                        BS Intelligence
                                    </motion.h1>
                                </div>
                            </div>

                            {/* Value Proposition & Logic Core Status */}
                            <div className="w-full max-w-2xl px-4 sm:px-6 z-20 flex flex-col items-center gap-12 sm:gap-20">
                                <div className="space-y-6 sm:space-y-10 text-center">
                                    <p className="text-[16px] sm:text-[2rem] text-slate-300 font-medium leading-relaxed sm:leading-snug max-w-xl mx-auto italic opacity-95 px-2">
                                        La <span className="text-white font-black">Súper Inteligencia</span> diseñada y entrenada para impulsar tus objetivos maestros con acciones de alto impacto y técnicas de marketing de alto alcance.
                                    </p>
                                    
                                    <div className="w-full min-h-[140px] sm:min-h-[180px] flex items-center justify-center py-6 sm:py-10 border-y border-white/5 bg-white/[0.01]">
                                        <ModelSlider />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-4 sm:gap-12 w-full opacity-30">
                                    <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/50 to-transparent" />
                                    <span className="text-[9px] sm:text-[13px] font-black uppercase tracking-[0.4em] sm:tracking-[0.8em] font-mono whitespace-nowrap">
                                        CONTEXT-DRIVEN ENGINEERING • ESTRATEGIA DE ÉLITE
                                    </span>
                                    <div className="h-px flex-1 bg-linear-to-l from-transparent via-white/50 to-transparent" />
                                </div>
                            </div>

                            {/* Representative Card - Horizontal Liaison Layout */}
                            <div className="w-full max-w-[480px] sm:max-w-3xl relative z-20 mx-auto">
                                <div className="absolute -inset-32 bg-blue-600/10 blur-[180px] opacity-30 pointer-events-none rounded-full animate-pulse" />
                                <div className="w-full bg-[#0b1121]/95 backdrop-blur-6xl rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-14 border border-white/10 shadow-[0_60px_160px_rgba(0,0,0,1)] relative group overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-blue-400/40 to-transparent" />
                                    
                                    <div className="relative z-10 flex flex-col gap-8 sm:gap-14">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-12">
                                            <div className="relative shrink-0">
                                                <div className="h-24 w-24 sm:h-36 sm:w-36 rounded-2xl sm:rounded-[2.5rem] border-2 border-white/20 shadow-[0_0_60px_rgba(59,130,246,0.2)] relative z-10 bg-[#020617] flex items-center justify-center overflow-hidden">
                                                    <EliteAtom size="h-16 w-16 sm:h-28 sm:w-28" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-10 sm:w-10 bg-emerald-500 rounded-full border-[3px] sm:border-4 border-[#0b1121] shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20 flex items-center justify-center">
                                                    <div className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 bg-white rounded-full animate-pulse" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-6 flex-1">
                                                <div className="space-y-2">
                                                    <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 inline-block">
                                                        <h4 className="text-[10px] sm:text-[14px] font-black uppercase tracking-[0.4em] text-white/60 font-mono">
                                                            AI STRATEGY LIAISON
                                                        </h4>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-[17px] sm:text-[1.8rem] font-bold text-white leading-relaxed sm:leading-snug font-sans italic opacity-90">
                                                    "Procesamos tu contexto, fortalezas y debilidades para definir las <span className="text-blue-400 underline decoration-blue-500/20">acciones inteligentes</span> que impulsarán tus objetivos hoy."
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-6 sm:gap-10">
                                            <div className="w-full h-px bg-white/10" />
                                            
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="text-[10px] sm:text-[13px] text-blue-400/60 font-mono uppercase tracking-[0.6em] font-black italic">
                                                    PROTOCOLO SEGURO • V4.4
                                                </span>
                                            </div>

                                            <motion.button 
                                                onClick={() => setIsStarted(true)}
                                                animate={{ 
                                                    boxShadow: [
                                                        "0 0 30px rgba(59,130,246,0.3), inset 0 0 0px rgba(59,130,246,0)",
                                                        "0 0 80px rgba(59,130,246,0.8), inset 0 0 30px rgba(59,130,246,0.4)",
                                                        "0 0 30px rgba(59,130,246,0.3), inset 0 0 0px rgba(59,130,246,0)"
                                                    ],
                                                    scale: [1, 1.02, 1]
                                                }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="w-full h-16 sm:h-24 bg-white hover:bg-white text-[#020617] font-black rounded-full shadow-[0_0_50px_rgba(59,130,246,0.6)] border-[1.5px] border-blue-400/60 transition-all transform active:scale-[0.96] flex items-center justify-center px-6 sm:px-12 group font-sans relative overflow-hidden"
                                            >
                                                <span className="text-[18px] sm:text-[2.6rem] uppercase tracking-[0.1em] sm:tracking-[0.8em] font-black z-10 flex items-center gap-4">
                                                    INICIAR SESIÓN ELITE
                                                    <div className="h-8 w-8 sm:h-12 sm:w-12 bg-[#020617] text-white rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500 shadow-xl">
                                                        <ChevronRight className="h-5 w-5 sm:h-8 sm:w-8 translate-x-0.5" />
                                                    </div>
                                                </span>
                                                
                                                <motion.div 
                                                    animate={{ left: ['-100%', '300%'] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "circIn", repeatDelay: 1 }}
                                                    className="absolute top-0 w-1/4 h-full bg-linear-to-r from-transparent via-blue-400/40 to-transparent skew-x-[-20deg]"
                                                />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="studio"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, type: "spring", damping: 25 }}
                            className="w-full flex flex-col items-center gap-6"
                        >
                            <div className="flex justify-between items-center w-full px-4 mb-2 max-w-[750px]">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl border border-white/10 bg-navy-950 flex items-center justify-center">
                                        <EliteAtom size="h-6 w-6" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 font-mono">Processing Unit • Active</span>
                                </div>
                                <button 
                                    onClick={() => setIsStarted(false)}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5 hover:border-white/10"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <DiscoveryStudio />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Atmosphere Accents */}
            <div className="fixed top-1/4 -left-40 h-[500px] w-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="fixed bottom-1/4 -right-40 h-[500px] w-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        </div>
    );
}
