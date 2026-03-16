"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Zap, 
  Bot, 
  ShieldCheck, 
  Layers3, 
  HandCoins,
  Cpu,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface DeliverableProps {
  step: number;
  answers: any;
  onNext: () => void;
  icon: any;
  isFinal?: boolean;
}

export default function DiscoveryDeliverable({ step, answers, onNext, icon: Icon, isFinal = false }: DeliverableProps) {
  
  const scoring = useMemo(() => {
    let fit = 0; let urgency = 0; let readiness = 0; let budget = 0;
    
    // Fit
    if (answers.role === 'business_owner') fit += 28;
    else if (answers.role === 'employee') fit += 18;
    else fit += 12;

    // Urgency
    if (answers.urgency === 'high') urgency = 30;
    else if (answers.urgency === 'med') urgency = 18;
    else urgency = 8;

    // Readiness
    if (answers.techLevel === 'none') readiness = 8;
    else if (answers.techLevel === 'basic') readiness = 14;
    else if (answers.techLevel === 'medium') readiness = 22;
    else readiness = 28;

    // Budget
    if (answers.budget === 'high') budget = 30;
    else if (answers.budget === 'med') budget = 18;
    else budget = 8;

    const total = fit + urgency + readiness + budget;
    let route: 'nurture' | 'guided_1200' | 'premium_3000' = 'nurture';

    if ((answers.support === 'dfy' || answers.budget === 'high') && answers.urgency === 'high' && fit >= 20) route = 'premium_3000';
    else if (answers.support === 'dwym' || answers.budget === 'med' || (urgency >= 18)) route = 'guided_1200';

    return { fit, urgency, readiness, budget, total, route };
  }, [answers]);

  const content = useMemo(() => {
    if (step === 4) {
      return {
        title: "Arquitectura Estratégica",
        summary: `Perfil detectado: ${answers.role === 'business_owner' ? 'Dueño de Negocio' : answers.role === 'employee' ? 'Profesional' : 'Estudiante'}. Objetivo: "${answers.goal}".`,
        bullets: [
          "Identificación de puntos ciegos en tu arquitectura actual.",
          "Prioridad: Sincronización de flujos con I Education.",
          "Oportunidad: Automatización de Listas de Acción vía Telegram."
        ],
        cta: "Analizar Operación Core",
        accent: "cyan"
      };
    }
    if (step === 8) {
      return {
        title: "Practical AI Guide",
        summary: `Fuga de valor principal: ${answers.manualProcess}. Tu nivel técnico permite una optimización inmediata de procesos repetitivos.`,
        bullets: [
          "Quick Win: Configuración de Copilot Pro para tareas críticas.",
          "Estrategia: Centralización de conocimiento en I Education.",
          "Siguiente paso: Activar seguimiento inteligente en Telegram."
        ],
        cta: "Diseñar Blueprint Final",
        accent: "emerald"
      };
    }
    return {
      title: "AI Infrastructure Blueprint",
      summary: `Ruta estratégica personalizada. Recomendamos: ${scoring.route === 'premium_3000' ? 'Premium DFY' : scoring.route === 'guided_1200' ? 'Guided Implementation' : 'Basecamp Nurture'}.`,
      bullets: [
        "Stack: BS Intelligence + Listas de Acción Dinámicas.",
        "Seguimiento: Agente de Telegram para ejecución sin fricción.",
        "Resultado: Transformación de teoría en ejecución real automatizada."
      ],
      cta: scoring.route === 'premium_3000' ? "Agendar Sesión de Ingeniería" : "Empezar con Copilot Pro",
      accent: "blue"
    };
  }, [step, answers, scoring]);

  const ScoreBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[12px] sm:text-[14px] font-black uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        <span>{value}/30</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value/30)*100}%` }}
          className={`h-full bg-linear-to-r ${color}`}
        />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className={`relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-linear-to-b from-white/10 to-transparent p-6 sm:p-12 shadow-2xl group`}>
        {/* Deliverable Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mb-10 relative z-10 text-center sm:text-left">
          <div className={`h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-[1.25rem] bg-white/5 flex items-center justify-center border border-white/10 text-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.4)]`}>
            <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-blue-500 drop-shadow-[0_0_5px_rgba(37,99,235,0.4)] mb-1`}>Engineering Outcome</span>
            <h3 className="text-3xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] leading-tight">{content.title}</h3>
          </div>
        </div>

        <p className="text-base sm:text-xl text-slate-200 font-medium leading-relaxed mb-8 relative z-10">{content.summary}</p>

        <div className="space-y-4 mb-8 relative z-10">
          {content.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-4 text-sm sm:text-lg text-slate-300 font-semibold italic">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {isFinal && (
          <div className="grid grid-cols-2 gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 mb-8">
            <ScoreBar label="Fit" value={scoring.fit} color="from-cyan-400 to-blue-500" />
            <ScoreBar label="Urgency" value={scoring.urgency} color="from-amber-400 to-orange-500" />
            <ScoreBar label="Readiness" value={scoring.readiness} color="from-emerald-400 to-teal-500" />
            <ScoreBar label="Budget" value={scoring.budget} color="from-indigo-400 to-purple-500" />
          </div>
        )}

        <button 
          onClick={() => {
            if (isFinal) {
              window.location.href = scoring.route === 'premium_3000' ? '/contact' : '/auth/register';
            } else {
              onNext();
            }
          }}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all relative z-10 group overflow-hidden ${
             isFinal ? "bg-white text-navy-950 hover:bg-slate-200" : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          {content.cta}
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>

        {isFinal && (
          <div className="mt-4 flex items-center justify-center gap-2 opacity-60">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest">Protocolo Seguro de Handoff</span>
          </div>
        )}

        {/* Backdrop Glow */}
        <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] opacity-20 pointer-events-none bg-${content.accent}-500`} />
      </div>
    </motion.div>
  );
}
