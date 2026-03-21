"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  FlaskConical,
  GraduationCap,
  HandCoins,
  Layers3,
  Loader2,
  Lock,
  Orbit,
  Radar,
  Settings2,
  ShieldCheck,
  Target,
  UserRound,
  Waypoints,
  Workflow,
  Sparkles,
  Send,
  User,
  Cpu,
  RefreshCw,
  X,
  MessageSquarePlus,
  Compass,
  Zap
} from 'lucide-react';
import DiscoveryDeliverable from './DiscoveryDeliverable';

type Role = 'business_owner' | 'employee' | 'student';

interface DiscoverySession {
  [step: number]: {
    selections: string[];
    custom: string;
  };
}

const ROLE_META = {
  business_owner: {
    label: 'Dueño de negocio',
    icon: BriefcaseBusiness,
    desc: 'Empresa, agencia o unidad operativa.',
  },
  employee: {
    label: 'Profesional',
    icon: UserRound,
    desc: 'Operador buscando eficiencia y criterio.',
  },
  student: {
    label: 'Estudiante',
    icon: GraduationCap,
    desc: 'Aprendizaje y ejecución estratégica.',
  },
};

const GOALS_BY_ROLE: Record<Role | 'default', string[]> = {
  business_owner: [
    'Multiplicar ventas y conversión',
    'Automatizar operación y ahorrar horas',
    'Ordenar CRM y seguimiento',
    'Infraestructura de IA escalable',
  ],
  employee: [
    'Trabajar más rápido y con calidad',
    'Reducir tareas repetitivas',
    'Subir nivel profesional con IA',
    'Organizar información y ejecución',
  ],
  student: [
    'Aprender más rápido y retener',
    'Proyectos de mayor nivel',
    'Metodología clara con IA',
    'Organizar estudio y notas',
  ],
  default: ['Multiplicar resultados', 'Automatizar tareas', 'Ordenar información', 'Implementar IA'],
};

const PAINS_BY_ROLE: Record<Role | 'default', string[]> = {
  business_owner: [
    'Tareas manuales y repetitivas',
    'Falta de seguimiento rápido',
    'Desorden en herramientas/procesos',
    'No saber qué sistema construir',
  ],
  employee: [
    'Pierdo tiempo en lo repetitivo',
    'Información dispersa sin sistema',
    'Reportes y análisis lentos',
    'IA sin metodología estratégica',
  ],
  student: [
    'Sin sistema claro de estudio',
    'Tiempo perdido organizando',
    'Entiendo pero no aplico bien',
    'IA usada de forma aislada',
  ],
  default: ['Tareas manuales', 'Desorganización', 'Poca claridad tecnológica', 'No saber por dónde empezar'],
};

const PROCESS_BY_ROLE: Record<Role | 'default', string[]> = {
  business_owner: [
    'Calificación y respuesta a leads',
    'Seguimiento y reactivación',
    'Reportes y análisis operativo',
    'Coordinación interna de proyectos',
  ],
  employee: [
    'Reportes y análisis de documentos',
    'Seguimiento de pendientes',
    'Búsqueda y síntesis de info',
    'Trabajo administrativo repetitivo',
  ],
  student: [
    'Investigación y síntesis',
    'Organización de materiales',
    'Práctica y aplicación guiada',
    'Creación de entregables',
  ],
  default: ['Calificación de info', 'Reportes', 'Creación de materiales', 'Gestión de procesos'],
};

export const EliteAtom = ({ size = "h-24 w-24", color = "rgba(255, 255, 255, 0.4)" }) => (
  <div className={`relative ${size} flex items-center justify-center`}>
    {/* Core Glow */}
    <div className="absolute h-full w-full bg-blue-500/10 rounded-full blur-2xl opacity-40 animate-pulse" />
    
    {/* Central Nucleus */}
    <div className="absolute h-[25%] w-[25%] bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,0.9),0_0_45px_rgba(59,130,246,0.6)] z-10 border border-blue-100/50 flex items-center justify-center">
      <div className="h-[40%] w-[40%] bg-blue-400 rounded-full blur-[1px]" />
    </div>
    
    {/* Precision Orbits */}
    {[
      { rotX: 75, rotY: 0, duration: 4 },
      { rotX: 75, rotY: 60, duration: 6 },
      { rotX: 75, rotY: -60, duration: 8 }
    ].map((orbit, i) => (
      <motion.div
        key={i}
        style={{
          rotateX: orbit.rotX,
          rotateY: orbit.rotY,
          width: '100%',
          height: '100%',
          position: 'absolute',
          border: `1.2px solid ${color}`,
          borderRadius: '50%',
        }}
        animate={{ rotateZ: 360 }}
        transition={{
          duration: orbit.duration,
          ease: "linear",
          repeat: Infinity
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[12%] w-[12%] bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,1),0_0_4px_white]" />
      </motion.div>
    ))}
    
    {/* Outer Geometric Foundation */}
    <div className="absolute h-full w-full border border-white/5 rounded-full scale-125 animate-[spin_15s_linear_infinite]" />
  </div>
);

export default function DiscoveryStudio() {
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<DiscoverySession>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const phase = step >= 1 && step <= 4 ? 1 : step >= 5 && step <= 8 ? 2 : step >= 9 && step <= 12 ? 3 : 0;

  const answers = useMemo(() => {
    const role = session[1]?.selections[0] as Role || '' as Role;
    return {
      role,
      goal: session[2]?.selections.join(', ') || session[2]?.custom || '',
      pain: session[3]?.selections.join(', ') || session[3]?.custom || '',
      manualProcess: session[5]?.selections.join(', ') || session[5]?.custom || '',
      techLevel: (session[6]?.selections[0] || '') as any,
      cloneTask: session[7]?.custom || '',
      urgency: (session[9]?.selections[0] || '') as any,
      support: (session[10]?.selections[0] || '') as any,
      budget: (session[11]?.selections[0] || '') as any,
    };
  }, [session]);

  const toggleSelection = (stepNum: number, value: string, singleSelect: boolean = false) => {
    setSession(prev => {
      const current = prev[stepNum] || { selections: [], custom: '' };
      let newSelections: string[];
      
      if (singleSelect) {
        newSelections = [value];
      } else {
        newSelections = current.selections.includes(value)
          ? current.selections.filter(s => s !== value)
          : [...current.selections, value];
      }
      
      return {
        ...prev,
        [stepNum]: { ...current, selections: newSelections }
      };
    });
  };

  const updateCustom = (stepNum: number, text: string) => {
    setSession(prev => {
      const current = prev[stepNum] || { selections: [], custom: '' };
      return {
        ...prev,
        [stepNum]: { ...current, custom: text }
      };
    });
  };

  const handleNext = (nextStep: number, message?: string) => {
    if (message) {
      setProcessingText(message);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(nextStep);
      }, 1500);
    } else {
      setStep(nextStep);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const currentSelections = session[step]?.selections || [];
  const currentCustom = session[step]?.custom || '';
  const isStepValid = currentSelections.length > 0 || currentCustom.trim().length > 0;

  const currentGoals = GOALS_BY_ROLE[answers.role || 'default'];
  const currentPains = PAINS_BY_ROLE[answers.role || 'default'];
  const currentProcesses = PROCESS_BY_ROLE[answers.role || 'default'];

  const containerVariants: any = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="w-full max-w-[750px] h-[100dvh] sm:h-[800px] bg-navy-950/40 backdrop-blur-4xl rounded-none sm:rounded-[3.5rem] border-x-0 sm:border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative group font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* Laser Lines / Technical Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-linear-to-t from-white/10 to-transparent pointer-events-none" />
      
      {/* Dynamic Ambient Glows (Electric White/Blue) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-700/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      {/* Optimized V4 Header & Full-Width Progress */}
      <div className="relative z-20 flex flex-col w-full shrink-0">
        {/* Progress Bar Container - Left to Right */}
        {step > 1 && step < 12 && (
          <div className="w-full h-1 bg-white/5 flex overflow-hidden">
             {[1, 2, 3].map((p) => {
               const phaseSteps = 4;
               const currentInPhase = step - ((p - 1) * phaseSteps);
               const phaseWidth = 33.33;
               let fillWidth = 0;
               if (phase < p) fillWidth = 0;
               else if (phase > p) fillWidth = 100;
               else {
                 fillWidth = (currentInPhase / phaseSteps) * 100;
               }

               return (
                 <div key={p} className="h-full relative overflow-hidden" style={{ width: `${phaseWidth}%` }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${fillWidth}%` }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      className={`h-full ${p <= phase ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" : "bg-transparent"}`}
                    />
                    <div className="absolute right-0 top-0 w-px h-full bg-white/10" />
                 </div>
               );
             })}
          </div>
        )}

        <div className="flex flex-col items-center pt-4 sm:pt-8 pb-2 sm:pb-4 text-center px-4 sm:px-6">
          <div className="relative mb-2 sm:mb-6 scale-75 sm:scale-100">
            <EliteAtom size="h-16 w-16 sm:h-24 w-24" />
          </div>
          
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="text-sm sm:text-xl font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.5em] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all leading-none font-sans">Discovery Engineering</h3>
            <p className="text-[8px] sm:text-[11px] text-blue-400 font-black uppercase tracking-[0.4em] sm:tracking-[0.8em] opacity-80 font-mono">Protocol v4.6</p>
          </div>

          {step > 1 && step < 12 && (
            <div className="absolute top-6 sm:top-10 right-4 sm:right-10 flex items-center gap-2 sm:gap-3">
              <span className="text-[8px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] whitespace-nowrap font-mono">Fase {phase}/3</span>
            </div>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-14 py-6 sm:py-8 hide-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div key="processing" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative flex items-center justify-center">
                <div className="h-28 w-28 rounded-full border-t-2 border-blue-500 animate-spin" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <EliteAtom size="h-16 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.5em] animate-pulse">Sintetizando Neuronas...</p>
                <h4 className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] font-sans">{processingText}</h4>
              </div>
            </motion.div>
          ) : step === 1 ? (
             <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 sm:space-y-8">
                <div className="space-y-2 sm:space-y-4 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/30 rounded-full text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                    <Zap className="h-3 w-3 sm:h-3.5 w-3.5" /> Fase 1 / Contexto Estratégico
                  </div>
                  <h2 className="text-xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)] font-sans">
                    Define tus <span className="text-blue-500">objetivos maestros</span>
                  </h2>
                  <p className="text-white/60 text-[10px] sm:text-base leading-relaxed max-w-lg font-semibold font-sans">
                    Procesamos tu contexto para diseñar acciones de alto impacto.
                  </p>
                </div>
                <div className="grid gap-2 sm:gap-4">
                  {(Object.keys(ROLE_META) as Array<Exclude<Role, ''>>).map((key) => {
                    const item = ROLE_META[key];
                    const isActive = currentSelections.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => { toggleSelection(1, key, true); handleNext(2); }}
                        className={`group flex items-center gap-3 sm:gap-6 p-3 sm:p-6 rounded-xl sm:rounded-3xl transition-all text-left relative overflow-hidden border ${isActive ? "bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]" : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/20 shadow-inner"}`}
                      >
                        <div className={`h-8 w-8 sm:h-14 sm:w-14 rounded-lg sm:rounded-2xl flex items-center justify-center transition-all ${isActive ? "bg-blue-600 text-white shadow-xl" : "bg-white/5 text-white/40 group-hover:text-blue-400 group-hover:bg-blue-600/10"}`}>
                          <item.icon className="h-4 w-4 sm:h-7 sm:w-7" />
                        </div>
                        <div>
                          <p className={`text-[10px] sm:text-sm font-black transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] font-sans ${isActive ? "text-blue-400" : "text-white group-hover:text-blue-400"}`}>{item.label}</p>
                          <p className="text-[7px] sm:text-[10px] text-white/40 mt-0.5 font-bold uppercase tracking-widest font-mono whitespace-normal">{item.desc}</p>
                        </div>
                        <ChevronRight className={`h-3 w-3 sm:h-5 sm:w-5 ml-auto transition-transform ${isActive ? "text-blue-400 translate-x-1" : "text-white/20 group-hover:text-blue-400 group-hover:translate-x-1"}`} />
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-white/40 font-bold leading-relaxed uppercase tracking-widest font-mono">Protocolo de seguridad activo. Cumplimos con las políticas de Meta y Google.</p>
                </div>
             </motion.div>
          ) : (
            <motion.div key={`step${step}`} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
               <div className="space-y-3">
                 <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)] font-sans">
                   {step === 2 && "¿Qué quieres mejorar primero?"}
                   {step === 3 && "¿Tu cuello de botella más claro?"}
                   {step === 5 && "¿Qué proceso drena más valor?"}
                   {step === 6 && "Madurez Tecnológica"}
                   {step === 7 && "Tu Tarea Maestra"}
                   {step === 9 && "Nivel de Urgencia"}
                   {step === 10 && "Acompañamiento"}
                   {step === 11 && "Inversión Inmediata"}
                   {step === 4 && "Desplegando Estrategia..."}
                   {step === 8 && "Generando Guía Práctica..."}
                   {step === 12 && "Arquitecturando Blueprint..."}
                 </h2>
                 {step !== 4 && step !== 8 && step !== 12 && (
                   <div className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/10">
                     <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] font-mono">Opciones múltiples disponibles</p>
                   </div>
                 )}
               </div>

               {(step === 4 || step === 8 || step === 12) ? (
                 <DiscoveryDeliverable step={step} answers={answers} isFinal={step === 12} onNext={() => handleNext(step + 1)} icon={step === 4 ? FileText : step === 8 ? Bot : FlaskConical} />
               ) : (
                 <div className="space-y-6">
                   <div className={`grid gap-2 sm:gap-3 ${[6, 9, 10, 11].includes(step) ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                     {(step === 2 ? currentGoals : step === 3 ? currentPains : step === 5 ? currentProcesses : 
                        step === 6 ? ['none', 'basic', 'medium', 'advanced'] : 
                        step === 9 ? ['high', 'med', 'low'] :
                        step === 10 ? ['diy', 'dwym', 'dfy'] : 
                        step === 11 ? ['high', 'med', 'low'] : []).map((opt) => {
                       const labels: any = {
                         none: { l: 'Cero', d: 'Sistemas aislados' },
                         basic: { l: 'Básico', d: 'Uso apps sueltas' },
                         medium: { l: 'Medio', d: 'Flujo integrado' },
                         advanced: { l: 'Avanzado', d: 'Automatización total' },
                         high: step === 9 ? { l: 'Máxima', d: 'Este mes' } : step === 11 ? { l: '> $3,000 USD', d: 'Estratégico' } : {},
                         med: step === 9 ? { l: 'Importante', d: 'Próximos 3 meses' } : step === 11 ? { l: '$1k - $3k USD', d: 'Optimización' } : {},
                         low: step === 9 ? { l: 'Exploración', d: 'Sin prisa' } : step === 11 ? { l: '< $1,000 USD', d: 'Base' } : {},
                         diy: { l: 'Solo (DIY)', d: 'Quiero guías' },
                         dwym: { l: 'Asistido (DWY)', d: 'Acompañamiento' },
                         dfy: { l: 'Llave en mano', d: 'Full Service' }
                       };
                       const label = labels[opt]?.l || opt;
                       const desc = labels[opt]?.d || '';
                       const isActive = currentSelections.includes(opt);
                       const singleSelect = [6, 9, 10, 11].includes(step);

                       return (
                         <button key={opt} onClick={() => toggleSelection(step, opt, singleSelect)} className={`group flex items-center gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl sm:rounded-3xl transition-all text-left border ${isActive ? "bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "bg-white/[0.03] border-white/5 hover:border-white/20"}`}>
                           <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isActive ? "border-blue-500 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "border-white/10 group-hover:border-blue-400/50"}`}>
                             {isActive && <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white font-black" />}
                           </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs sm:text-sm font-black uppercase tracking-wide font-sans leading-tight ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}`}>{label}</p>
                              {desc && <p className="text-[8px] sm:text-[9px] text-white/30 font-bold uppercase tracking-wider mt-0.5 font-mono leading-tight">{desc}</p>}
                            </div>
                         </button>
                       );
                     })}
                   </div>

                   <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 text-blue-400">
                        <MessageSquarePlus className="h-4 w-4" />
                        <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-mono">Respuesta personalizada</span>
                      </div>
                      <textarea value={currentCustom} onChange={(e) => updateCustom(step, e.target.value)} placeholder="Agrega detalles tácticos..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500/40 focus:bg-blue-600/[0.02] min-h-[80px] sm:min-h-[100px] placeholder:text-white/5 transition-all font-medium font-sans hide-scrollbar" />
                   </div>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 12 && !isProcessing && (
        <div className="px-4 sm:px-10 pb-4 sm:pb-10 flex gap-2 sm:gap-4 relative z-20 shrink-0">
          {step > 1 && (
            <button onClick={handleBack} className="flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3.5 sm:py-5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black rounded-xl sm:rounded-3xl transition-all border border-white/10 group uppercase tracking-[0.2em] text-[9px] sm:text-[11px] font-sans">
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
          <button onClick={() => {
            if (step === 3) handleNext(4, 'Sintetizando...');
            else if (step === 7) handleNext(8, 'Arquitecturando...');
            else if (step === 11) handleNext(12, 'Finalizando...');
            else handleNext(step + 1);
          }} disabled={!isStepValid} className={`flex-1 flex items-center justify-center gap-2 sm:gap-4 px-6 sm:px-8 py-3.5 sm:py-5 font-black rounded-xl sm:rounded-3xl transition-all group uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-[11px] font-sans ${isStepValid ? "bg-white text-navy-950 shadow-[0_15px_40px_rgba(255,255,255,0.2)]" : "bg-white/5 text-white/10 border border-white/5 opacity-50"}`}>
            Siguiente
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      <div className="p-4 sm:p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-center shrink-0">
         <span className="text-[8px] sm:text-[10px] font-black text-white/10 uppercase tracking-[0.4em] sm:tracking-[0.6em] pointer-events-none text-center font-mono">Discovery Engineering Protocol v4.3</span>
      </div>
    </div>
  );
}
