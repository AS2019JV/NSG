import { ArrowRight, Clock, Loader2 } from "lucide-react";
import BrandAtom from "@/components/ui/BrandAtom";
import clsx from "clsx";

interface NewsCardProps {
  source: string;
  title: string;
  tag: string;
  color: string;
  description: string;
  time: string;
  isAnalyzed?: boolean;
  isAnalyzing?: boolean;
  onAnalyze: () => void;
}

export function NewsCard({ source, title, tag, color, description, time, isAnalyzed, isAnalyzing, onAnalyze }: NewsCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    emerald: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  };

  const accentColor: Record<string, string> = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    emerald: "bg-blue-600",
    orange: "bg-orange-600",
    sky: "bg-sky-600",
  };

  return (
    <div
      onClick={isAnalyzing ? undefined : onAnalyze}
      className="group relative bg-navy-900/40 backdrop-blur-3xl rounded-2xl border border-white/5 shadow-2xl hover:border-blue-500/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className={clsx("w-1 h-full absolute left-0 top-0 z-20 opacity-50", accentColor[color] || accentColor['blue'])}></div>

      <div className="p-4 md:p-5 flex flex-col relative">
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">{source}</span>
            <div className="h-0.5 w-0.5 rounded-full bg-slate-200"></div>
            <span className={clsx("text-[0.55rem] font-bold px-2 py-0.5 rounded-md border", colorMap[color] || colorMap['blue'])}>
              {tag}
            </span>
          </div>

          {isAnalyzed && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full animate-in fade-in zoom-in-95 duration-500">
              <BrandAtom className="w-3 h-3 text-blue-400" variant="colored" />
              <span className="text-[0.6rem] font-bold text-blue-400 uppercase tracking-wider">Analizado</span>
            </div>
          )}
        </div>

        <h4 className="font-display font-bold text-lg md:text-xl text-bright-white mb-2 group-hover:text-blue-400 transition-colors leading-snug">
          {title}
        </h4>

        <p className="text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-2 pr-10">
          {description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[0.6rem] font-bold text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isAnalyzing) onAnalyze();
            }}
            disabled={isAnalyzing}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-[0.6rem] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
              isAnalyzed
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-blue-600 hover:text-white hover:border-transparent"
            )}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Analizando
              </>
            ) : isAnalyzed ? (
              "Ver Análisis"
            ) : (
              "Solicitar Análisis"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
