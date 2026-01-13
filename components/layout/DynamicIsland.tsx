"use client";

import { useAppStore } from "@/store/useAppStore";
import { Activity, ChevronDown, Zap, Layers, Scale, BrainCircuit } from "lucide-react";
import { CONTEXT, RoleType } from "@/data/context";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import clsx from "clsx";
import { m, AnimatePresence } from "framer-motion";

// Update Props Interface
interface DynamicIslandProps {
  currentMode: string;
  setMode: Dispatch<SetStateAction<string>>;
  selectedModel?: string; 
  setSelectedModel?: Dispatch<SetStateAction<string>>;
  intelligenceMode?: 'pulse' | 'compare' | 'fusion' | 'deep';
  setIntelligenceMode?: Dispatch<SetStateAction<'pulse' | 'compare' | 'fusion' | 'deep'>>;
}

export default function DynamicIsland({ currentMode, setMode, selectedModel, setSelectedModel, intelligenceMode = 'pulse', setIntelligenceMode }: DynamicIslandProps) {
  const { currentRole } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Get menu items for current role - Robust fallback
  const roleKey = (currentRole && CONTEXT[currentRole as RoleType]) ? (currentRole as RoleType) : 'consultant';
  const menuItems = CONTEXT[roleKey]?.menu || [];
  
  // Reconstruct list: Standard + Specific List in Exact Order
  const targetOrder = ['nsg_clarity', 'nsg_horizon', 'nsg_news', 'settings'];
  const menuMap = new Map(menuItems.map(i => [i.id, i]));
  
  const allItems = [
    { id: 'standard', label: 'Standard', icon: Activity },
    ...targetOrder
        .map(id => menuMap.get(id))
        .filter((item): item is NonNullable<typeof item> => !!item)
  ];

  return (
    <div className="relative z-50 flex flex-col items-center justify-start pt-0 md:pt-4 gap-4 md:gap-6 w-full" ref={containerRef}>
      
      {/* 1. System Status Indicator (Apple Pro Label) */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-sm animate-fade-in group cursor-default">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
         <span className="text-[10px] font-bold tracking-[0.15em] text-navy-900/70 uppercase font-display group-hover:text-navy-900 transition-colors">
            System NSG Intelligence
         </span>
      </div>

      {/* 2. Primary Dynamic Island (Navigation) */}
      <div className="relative flex items-center justify-center w-full max-w-[95vw] md:max-w-4xl mx-auto">
        <div className={clsx(
            "flex flex-nowrap items-center p-1.5 gap-1",
            "bg-navy-950 supports-backdrop-filter:bg-navy-950/90 backdrop-blur-xl", // Ultra-dark Navy/Black
            "border border-white/10 ring-1 ring-white/5",
            "rounded-full shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]", 
            "overflow-x-auto scrollbar-hide transition-all duration-500 ease-spring"
        )}>
           
           {allItems.map((item) => {
             const isActive = currentMode === item.id;
             const isSpecial = item.id === 'nsg_intelligence';
             const Icon = item.icon;

             return (
               <button
                 key={item.id}
                 onClick={() => setMode(item.id)}
                 className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ease-out whitespace-nowrap relative shrink-0 cursor-pointer group",
                    isActive 
                        ? "bg-blue-600/20 text-blue-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-blue-500/30" 
                        : "text-slate-400 hover:text-white hover:bg-white/5",
                     (isActive && isSpecial) && "bg-blue-600/30 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30"
                 )}
               >
                 <Icon className={clsx(
                   "w-4 h-4 transition-colors shrink-0", 
                   isActive ? "text-blue-300" : "text-slate-500 group-hover:text-slate-300"
                 )} />
                 <span className="text-[13px] font-medium tracking-wide">
                   {item.label}
                 </span>
               </button>
             );
           })}

        </div>
      </div>

      {/* 3. Intelligence Mode Selector (Dropdown + Pills) */}
      {setSelectedModel && selectedModel && (
         <div className="flex flex-col items-center gap-3">
             {/* Mode Dropdown Trigger */}
             <div className="relative z-20">
                 <button
                    onClick={() => setIsOpen(!isOpen)} 
                    className={clsx(
                        "group relative flex items-center justify-between gap-3 px-5 py-2.5 rounded-full",
                        "bg-[#151516]/80 backdrop-blur-3xl", // Deepest glass
                        "border border-white/10 ring-1 ring-white/5",
                        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)]",
                        "hover:bg-[#1c1c1e] active:scale-[0.98]",
                        "text-slate-200 transition-all duration-300 ease-out min-w-[170px]"
                    )}
                 >
                    <div className="flex items-center gap-2.5">
                        {intelligenceMode === 'pulse' && <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />}
                        {intelligenceMode === 'compare' && <Layers className="w-4 h-4 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]" />}
                        {intelligenceMode === 'fusion' && <Scale className="w-4 h-4 text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]" />}
                        {intelligenceMode === 'deep' && <BrainCircuit className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />}
                        
                        <span className="text-[13px] font-bold tracking-tight capitalize text-white font-display">
                            {intelligenceMode === 'pulse' ? 'Pulso' : 
                             intelligenceMode === 'compare' ? 'Comparar' : 
                             intelligenceMode === 'fusion' ? 'Fusión' : intelligenceMode}
                        </span>
                    </div>
                    <ChevronDown className={clsx("w-3.5 h-3.5 text-slate-500/80 transition-transform duration-300", isOpen && "rotate-180")} />
                 </button>

                 {/* Dropdown Menu */}
                 <AnimatePresence>
                 {isOpen && (
                     <m.div 
                        initial={{ opacity: 0, y: 8, scale: 0.96, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 8, scale: 0.96, filter: 'blur(4px)' }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={clsx(
                            "absolute top-full left-0 mt-3 w-72 p-2",
                            "rounded-[24px]", 
                            "bg-[#0F0F10]/90 backdrop-blur-[50px] saturate-150", // Extremely blurry dark glass (Pro standard)
                            "border border-white/5 ring-1 ring-white/5",
                            "shadow-[0_40px_80px_-12px_rgba(0,0,0,0.8)] z-50",
                            "flex flex-col gap-1"
                        )}
                     >
                        {[
                            { id: 'pulse', label: 'Pulso', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/30', desc: 'Respuesta instantánea' },
                            { id: 'compare', label: 'Comparar', icon: Layers, color: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/30', desc: 'Ejecución en paralelo' },
                            { id: 'fusion', label: 'Fusión', icon: Scale, color: 'text-purple-400', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/30', desc: 'Consenso inteligente' },
                        ].map((mode) => {
                             const isModeActive = intelligenceMode === mode.id;
                             return (
                             <button
                                key={mode.id}
                                onClick={() => {
                                    if (setIntelligenceMode) setIntelligenceMode(mode.id as any);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    "relative flex items-center gap-3.5 p-3.5 rounded-[18px] transition-all duration-300 text-left group/item w-full overflow-hidden",
                                    isModeActive ? "bg-white/[0.08]" : "hover:bg-white/[0.03]"
                                )}
                             >
                                {/* Glowing Icon Container */}
                                <div className={clsx(
                                    "relative flex items-center justify-center w-9 h-9 rounded-full border border-white/5 transition-all duration-500",
                                    "bg-[#1A1A1C] shadow-inner overflow-hidden",
                                    isModeActive ? `shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]` : "text-slate-500 group-hover:text-slate-300"
                                )}>
                                    {isModeActive && (
                                        <div className={clsx("absolute inset-0 opacity-20 blur-md", mode.bg)} />
                                    )}
                                    <mode.icon className={clsx("w-4.5 h-4.5 relative z-10 transition-transform duration-300", isModeActive && "scale-110", isModeActive ? mode.color : "text-slate-500")} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className={clsx("text-[15px] font-bold tracking-tight font-display", isModeActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                                            {mode.label}
                                        </span>
                                        {isModeActive && (
                                            <m.div layoutId="activeDot" className={clsx("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]", mode.color.replace('text-', 'bg-'))} />
                                        )}
                                    </div>
                                    <span className="text-[12px] text-slate-500 leading-snug block font-medium truncate group-hover:text-slate-400 transition-colors">
                                        {mode.desc}
                                    </span>
                                </div>
                             </button>
                             );
                        })}
                     </m.div>
                 )}
                 </AnimatePresence>
             </div>

             {/* COMPARE MODE (Previously Fusion): Show Model Pills */}
             {intelligenceMode === 'compare' && (
                <m.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center p-1 rounded-full bg-slate-200/40 backdrop-blur-md border border-white/20 shadow-inner group/selector relative"
                >
                     {['Chat GPT', 'Gemini', 'Claude'].map((model) => {
                         const isModelActive = selectedModel === model;
                         return (
                            <button
                                key={model}
                                onClick={() => setSelectedModel(model)}
                                className={clsx(
                                    "relative px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 ease-out flex items-center gap-1.5 cursor-pointer z-10",
                                    isModelActive
                                        ? "text-slate-900" // Active: Dark text
                                        : "text-slate-500 hover:text-slate-700" // Inactive: Gray
                                )}
                            >
                                {isModelActive && (
                                    <m.div 
                                        layoutId="activeModelIndicator"
                                        className="absolute inset-0 bg-white rounded-full z-[-1] shadow-[0_2px_8px_rgba(0,0,0,0.12)]" // Floating white pill
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    />
                                )}
                                <div className={clsx(
                                    "w-1 h-1 rounded-full transition-all duration-300", 
                                    isModelActive ? "bg-blue-500" : "bg-transparent"
                                )} />
                                {model}
                            </button>
                         );
                     })}
                </m.div>
             )}
         </div>
      )}

      {/* Scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
