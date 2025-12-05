"use client";

import { useAppStore } from "@/store/useAppStore";
import { useUIStore } from "@/store/useUIStore"; // To open AI
import { CONTEXT, RoleType } from "@/data/context";
import { 
  Sparkles, 
  Mic, 
  Search, 
  TrendingUp, 
  Building, 
  AlertTriangle, 
  Activity, 
  PlayCircle, 
  ArrowRight 
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { useRouter } from "next/navigation";

export default function NSGSystem() {
  const { currentRole } = useAppStore();
  const { toggleAI } = useUIStore(); // Hook to open the AI modal
  const router = useRouter();

  // Logic to get First Name (Legacy Line: const userFirstName = ...)
  const roleKey = (currentRole as RoleType) || 'consultant';
  const userData = CONTEXT[roleKey];
  const userFirstName = userData?.name.split(' ')[0] || "Usuario";

  // Handler for AI Buttons
  const handleAITrigger = (mode: string) => {
    // In a real app, you might set the mode in the store too
    toggleAI(); 
  };

  return (
    <div className="animate-fade-in-up space-y-8 pb-10">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden bg-navy-950 text-white p-8 lg:p-12 rounded-[2.5rem] shadow-2xl mb-10 group transition-all hover:shadow-sovereign">
         {/* Background Effects */}
         <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
         <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div>
                 <div className="flex items-center gap-3 mb-3">
                     <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                         <Sparkles className="w-5 h-5 text-blue-300" />
                     </div>
                     <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{userFirstName}</span>
                     </h2>
                 </div>
                 <p className="text-slate-400 max-w-lg text-sm lg:text-base leading-relaxed font-medium">
                     Bienvenido a tu NSG Intelligence. La infraestructura cognitiva está optimizada y lista para potenciar tus objetivos hoy.
                 </p>
             </div>
             
             {/* Action Buttons */}
             <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                 <button 
                    onClick={() => handleAITrigger('standard')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl text-sm font-bold transition shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 group/btn"
                 >
                     <Mic className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> Dictado de Voz
                 </button>
                 <button 
                    onClick={() => handleAITrigger('research')}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl text-sm font-bold transition flex items-center gap-2 backdrop-blur-md border border-white/5 hover:-translate-y-0.5 active:scale-95 hover:shadow-lg"
                 >
                     <Search className="w-4 h-4" /> Deep Search
                 </button>
             </div>
         </div>
      </div>

      {/* 2. LAST SESSION CARD (NSG Horizon Link) */}
      <div onClick={() => router.push('/dashboard/nsg_horizon')}>
         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 p-[1px] rounded-[2.5rem] shadow-glow cursor-pointer group hover:shadow-glow-subtle transition-all duration-500 transform hover:scale-[1.005]">
             <div className="bg-white rounded-[2.4rem] p-8 lg:p-10 relative overflow-hidden h-full flex flex-col md:flex-row gap-8 items-center">
                 
                 {/* Decorative Blur */}
                 <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100/80 transition-colors duration-500 pointer-events-none"></div>
                 
                 {/* Icon Container */}
                 <div className="relative shrink-0">
                     <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center relative z-10 group-hover:bg-blue-600 transition-colors duration-500 shadow-sm">
                         <PlayCircle className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-500" />
                     </div>
                     <div className="absolute inset-0 bg-blue-200 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                 </div>
                 
                 {/* Text Content */}
                 <div className="relative z-10 flex-1 text-center md:text-left">
                     <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2 justify-center md:justify-start">
                         <h3 className="font-display font-bold text-2xl text-navy-900 group-hover:text-blue-700 transition-colors">
                            Mi Última Sesión
                         </h3>
                         <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">
                            Lista para Procesar
                         </span>
                     </div>
                     <p className="text-slate-600 max-w-xl text-sm lg:text-base font-medium leading-relaxed">
                         Sesión del 28 de Octubre • &quot;Estrategia de Cierre Q4&quot;. <br className="hidden md:block"/>
                         <span className="text-blue-600 font-bold">Haz clic para desglosar metodologías y personalizar tu plan de acción.</span>
                     </p>
                 </div>
                 
                 {/* Arrow Indicator */}
                 <div className="hidden sm:flex shrink-0 items-center justify-center">
                     <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                         <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600 transition-colors" />
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* 3. METRICS GRID */}
      {/* Matches the _card calls from legacy code: Valor Cartera, Empresas, Riesgo, Eficiencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Valor Cartera" 
            value="$4.2M" 
            icon={TrendingUp} 
            colorClass="text-blue-600" 
            bgClass="bg-white hover:border-blue-200" 
          />
          <StatCard 
            title="Empresas" 
            value="14" 
            icon={Building} 
            colorClass="text-indigo-600" 
            bgClass="bg-white hover:border-indigo-200" 
          />
          <StatCard 
            title="Riesgo" 
            value="2" 
            icon={AlertTriangle} 
            colorClass="text-red-500" 
            bgClass="bg-white hover:shadow-red-100"
            borderClass="border-l-4 border-red-500"
          />
          <StatCard 
            title="Eficiencia" 
            value="94%" 
            icon={Activity} 
            colorClass="text-emerald-500" 
            bgClass="bg-white hover:border-emerald-200" 
          />
      </div>
    </div>
  );
}