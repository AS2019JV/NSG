"use client";

import { useState, useEffect } from "react";
import { Mic, Sparkles, Command, Cpu } from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/components/ui/ToastProvider";

export default function JarvisAssistant() {
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "replying">("idle");
  const [transcript, setTranscript] = useState("");
  const { showToast } = useToast();

  const handleMicClick = () => {
    if (status === "idle") {
      setStatus("listening");
      setTranscript("Listening...");
      
      // Simulate interaction flow
      setTimeout(() => {
        setStatus("processing");
        setTranscript("Processing...");
        setTimeout(() => {
          setStatus("replying");
          setTranscript("Jarvis: Accessing Mainframe...");
          setTimeout(() => {
            setStatus("idle");
            setTranscript("");
          }, 3000);
        }, 1500);
      }, 2000);
    }
  };

  // Border Effect Styles
  const borderGlow = clsx(
    "pointer-events-none absolute inset-0 rounded-[2.5rem] transition-opacity duration-700",
    status !== "idle" ? "opacity-100" : "opacity-0"
  );

  return (
    <div className="relative w-full mb-8 group">
      {/* --- SIRI / APPLE NEON BORDER EFFECT --- */}
      {/* We use multiple absolute divs to create the multi-color glowing border effect */}
      <div className={clsx(borderGlow, "z-0")}>
        <div className="absolute -inset-0.5 rounded-[2.6rem] bg-linear-to-r from-blue-500 via-white to-green-400 opacity-50 blur-md animate-gradient-xy"></div>
        <div className="absolute -inset-px rounded-[2.6rem] bg-linear-to-r from-blue-500 via-white to-green-400 opacity-80 blur-[2px] animate-gradient-xy"></div>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className={clsx(
        "relative z-10 bg-navy-950 rounded-[2.5rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden transition-all duration-500",
        status !== "idle" ? "shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] border-transparent" : "shadow-2xl border border-navy-800"
      )}>
        {/* Animated Background Mesh (Subtle) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        {/* LEFT: Branding & Status */}
        <div className="flex items-center gap-6 relative z-10">
          {/* Animated Orb / Avatar */}
          <div 
            onClick={handleMicClick}
            className={clsx(
            "w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 relative",
            status === "listening" ? "scale-110" : "hover:scale-105"
          )}>
            {/* Orb Glow */}
            <div className={clsx(
              "absolute inset-0 rounded-2xl blur-xl transition-all duration-500",
              status === "idle" ? "bg-blue-500/0" : 
              status === "listening" ? "bg-blue-500/40" :
              status === "processing" ? "bg-purple-500/40" : "bg-green-500/40"
            )}></div>

            <div className={clsx(
              "relative w-full h-full rounded-2xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden backdrop-blur-md",
              status === "idle" ? "bg-navy-800" : "bg-navy-900"
            )}>
               {/* Icon Logic */}
               {status === "idle" && <Command className="w-8 h-8 text-blue-400" />}
               {status === "listening" && <Mic className="w-8 h-8 text-blue-400 animate-pulse" />}
               {status === "processing" && <Sparkles className="w-8 h-8 text-purple-400 animate-spin-slow" />}
               {status === "replying" && <Cpu className="w-8 h-8 text-green-400" />}
               
               {/* Ring Animation (Iron Man Reactort type) */}
               <div className={clsx(
                 "absolute inset-0 border-2 rounded-2xl transition-colors duration-500",
                 status === "idle" ? "border-blue-500/20" : 
                 status === "listening" ? "border-blue-400 animate-pulse" :
                 status === "processing" ? "border-purple-400" : "border-green-400"
               )}></div>
            </div>
          </div>

          <div>
             <h3 className="text-2xl font-display font-bold text-white tracking-wide flex items-center gap-3">
                JARVIS <span className="text-[10px] px-2 py-0.5 rounded border border-white/20 text-white/50 font-mono tracking-widest">BETA v1.0</span>
             </h3>
             <p className={clsx(
               "text-sm font-medium transition-colors duration-300 min-h-[20px] flex items-center gap-2",
               status === "listening" ? "text-blue-300" :
               status === "processing" ? "text-purple-300" :
               status === "replying" ? "text-green-300" : "text-slate-400"
             )}>
                {status === "idle" ? "Sistemas nominales. Esperando comando..." : transcript}
                {status === "listening" && <span className="flex gap-1"><span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-75"></span><span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-150"></span><span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-300"></span></span>}
             </p>
          </div>
        </div>

        {/* RIGHT: Visualizer (Decorational for now) */}
        <div className="hidden md:flex items-center gap-1 opacity-50 relative z-10 h-12">
            {[...Array(12)].map((_, i) => (
                <div key={i} className={clsx(
                    "w-1.5 rounded-full bg-linear-to-t from-blue-600 to-blue-300 transition-all duration-300 ease-in-out",
                    status === "idle" ? "h-2" : `h-${Math.floor(Math.random() * 8) + 2} animate-wave`
                )} style={{
                    animationDelay: `${i * 0.1}s`,
                    height: status === 'listening' ? `${Math.random() * 32 + 8}px` : undefined
                }}></div>
            ))}
        </div>
      </div>
    </div>
  );
}
