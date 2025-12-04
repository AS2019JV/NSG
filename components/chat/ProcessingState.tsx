"use client";
import { useState, useEffect } from "react";

const PHRASES = [
  "Decodificando Patrones...",
  "Optimizando Vectores...",
  "Sincronizando Contexto...",
  "Generando Insight...",
];

export default function ProcessingState() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-8 animate-fade-in-up gap-6 w-full">
      {/* Atom Container */}
      <div className="w-16 h-16 relative atom-container">
        <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-150"></div>
        <div className="w-full h-full animate-spin-process">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-md">
            <defs>
              <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" className="morph-orbit" stroke="url(#processGrad)" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="42" className="morph-orbit" stroke="url(#processGrad)" strokeWidth="2" fill="none" style={{ transform: 'rotate(60deg) scaleY(0.45)' }} />
            <circle cx="50" cy="50" r="42" className="morph-orbit" stroke="url(#processGrad)" strokeWidth="2" fill="none" style={{ transform: 'rotate(120deg) scaleY(0.45)' }} />
            <circle cx="50" cy="50" r="8" fill="#3B82F6" />
          </svg>
        </div>
      </div>
      
      {/* Animated Text */}
      <p className="text-xs font-bold text-blue-500 tracking-widest uppercase animate-text-glow transition-all duration-500">
        {PHRASES[phraseIndex]}
      </p>
    </div>
  );
}