"use client";
import { Zap, Search, Sparkles } from "lucide-react";
import { NewsCard } from "@/components/ui/NewsCard";
import { useChatStore } from "@/store/useChatStore";

export default function NSGNews() {
  const runNewsAnalysis = useChatStore((state) => state.runNewsAnalysis);

  const handleAnalyze = (title: string, tag: string) => {
    runNewsAnalysis(title, tag);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-6 shrink-0">
        <div className="max-w-xl">
          <h3 className="font-display font-bold text-3xl lg:text-4xl text-navy-900 tracking-tight">NSG Market Pulse</h3>
          <p className="text-slate-500 mt-2 text-base lg:text-lg leading-relaxed">Inteligencia de mercado curada algorítmicamente para acelerar tus objetivos estratégicos.</p>
        </div>
        
        {/* Premium Search & Generate Control */}
        <div className="flex items-center w-full sm:w-auto bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm focus-within:shadow-md focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group">
            <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Buscar tendencias, reportes o insights..." 
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none text-sm font-medium text-navy-900 placeholder:text-slate-400"
                />
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 shrinks-0 group">
                <div className="w-4 h-4 relative flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                      <defs>
                          <linearGradient id="btnAtomGrad" x1="0" y1="0" x2="100" y2="100">
                              <stop offset="0" stopColor="#FFFFFF" />
                              <stop offset="1" stopColor="#93C5FD" />
                          </linearGradient>
                      </defs>
                      <g className="animate-[spin_10s_linear_infinite] origin-center">
                        <ellipse cx="50" cy="50" rx="45" ry="18" stroke="url(#btnAtomGrad)" strokeWidth="8" fill="none" className="opacity-90" />
                        <ellipse cx="50" cy="50" rx="45" ry="18" stroke="url(#btnAtomGrad)" strokeWidth="8" fill="none" className="opacity-90" transform="rotate(60 50 50)" />
                        <ellipse cx="50" cy="50" rx="45" ry="18" stroke="url(#btnAtomGrad)" strokeWidth="8" fill="none" className="opacity-90" transform="rotate(120 50 50)" />
                      </g>
                      <circle cx="50" cy="50" r="12" fill="#FFFFFF" className="animate-pulse" />
                   </svg>
                </div>
                <span>Generar</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 flex-1 overflow-y-auto custom-scroll">
        <NewsCard source="TechCrunch" title="AI en Salud Mental" tag="Tendencia" color="blue" description="Nuevos algoritmos predictivos reducen recaídas un 30%." time="15m" onAnalyze={handleAnalyze} />
        <NewsCard source="Harvard Business" title="Liderazgo Adaptativo" tag="Estrategia" color="purple" description="Cómo los CEOs gestionan la incertidumbre en 2025." time="1h" onAnalyze={handleAnalyze} />
        <NewsCard source="NSG Internal" title="Benchmark Q3" tag="Reporte" color="emerald" description="Tu rendimiento supera al promedio del sector en un 12%." time="2h" onAnalyze={handleAnalyze} />
        <NewsCard source="Global Markets" title="Fusiones Tech" tag="M&A" color="orange" description="Oportunidades emergentes en el sector SaaS LATAM." time="4h" onAnalyze={handleAnalyze} />
        <NewsCard source="BioHack Daily" title="Ritmos Circadianos" tag="Wellness" color="sky" description="Optimización del sueño para alto rendimiento ejecutivo." time="5h" onAnalyze={handleAnalyze} />
      </div>
    </div>
  );
}