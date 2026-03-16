"use client";

import { motion } from "framer-motion";
import { 
    Zap, 
    Target, 
    ArrowUpRight, 
    BarChart3, 
    Activity,
    ShieldCheck
} from "lucide-react";

interface ValueCardProps {
    title: string;
    description: string;
    color?: "blue" | "emerald" | "indigo";
}

export default function ValueCard({ title, description, color = "blue" }: ValueCardProps) {
    const colorMap = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    };

    const iconMap = {
        blue: <Activity className="h-5 w-5" />,
        emerald: <ShieldCheck className="h-5 w-5" />,
        indigo: <BarChart3 className="h-5 w-5" />
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full p-6 rounded-[2rem] border backdrop-blur-3xl shadow-2xl relative group overflow-hidden ${colorMap[color]}`}
        >
            {/* Shimmer on hover */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 shadow-sm ${colorMap[color].split(' ')[0]}`}>
                    {iconMap[color]}
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                    Insight Generado
                </div>
            </div>

            <div className="space-y-2 relative z-10">
                <h4 className="text-lg font-display font-black text-white tracking-tight">
                    {title}
                </h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed opacity-80">
                    {description}
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Listo para Aplicar</span>
                </div>
                <button className="text-white hover:text-blue-400 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>

            {/* Background Glow */}
            <div className={`absolute -bottom-10 -right-10 h-32 w-32 blur-[60px] opacity-30 pointer-events-none ${
                color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : 'bg-indigo-600'
            }`} />
        </motion.div>
    );
}
