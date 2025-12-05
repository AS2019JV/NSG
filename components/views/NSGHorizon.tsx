"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/ToastProvider";
import { 
  Layers, Calendar, Play, FileCheck, FileText, Zap, Cpu, 
  PenTool, ArrowUpRight, CheckSquare, ListTodo, PlusCircle 
} from "lucide-react";
import clsx from "clsx";

export default function NSGHorizon() {
  const { currentRole } = useAppStore();
  const { showToast } = useToast();
  
  // Logic from your snippet
  const subject = currentRole === 'consultant' ? 'Cliente Corporativo' : 'Paciente';

  // State for the interactive checklist (replaces toggleCheck)
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    showToast("Estado actualizado", "success");
  };

  return (
    <div className="flex flex-col h-full gap-6 animate-fade-in-up">
      
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-navy-950 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl text-navy-900">Workspace de Sesión</h3>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <Calendar className="w-3 h-3" /> 28 Octubre 2024 • <span className="text-blue-600 font-bold">Análisis Estratégico Activo</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button 
            onClick={() => showToast('Reproduciendo Audio...', 'info')} 
            className="flex-1 lg:flex-none px-6 py-3 bg-slate-50 text-navy-900 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-200 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" /> Reproducir Audio
          </button>
          <button 
            onClick={() => showToast('Exportando PDF...', 'success')} 
            className="flex-1 lg:flex-none px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" /> Exportar Plan PDF
          </button>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT COLUMN: TRANSCRIPTION */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-card flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <h4 className="font-bold text-navy-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Transcripción
              </h4>
              <span className="text-[0.65rem] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase">Procesado</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6 bg-slate-50/30">
              {/* Message 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">YO</div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">04:12</p>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed">
                    "...siento que pierdo el foco cuando hay demasiadas reuniones operativas. Necesito una forma de blindar mi tiempo estratégico."
                  </div>
                </div>
              </div>
              
              {/* Message 2 */}
              <div className="flex flex-row-reverse gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs shrink-0">NSG</div>
                <div className="space-y-1 text-right">
                  <p className="text-xs font-bold text-slate-400">04:15</p>
                  <div className="bg-blue-50 p-4 rounded-2xl rounded-tr-none border border-blue-100 text-sm text-navy-900 font-medium leading-relaxed text-left">
                    "Entiendo. Aquí es donde debemos aplicar la técnica de 'Time Blocking' pero adaptada a tu ritmo circadiano."
                  </div>
                </div>
              </div>

              {/* Insight Pill */}
              <div className="mx-auto w-fit bg-yellow-50 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold border border-yellow-100 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Insight Clave Detectado
              </div>

              {/* Message 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">YO</div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">04:45</p>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed">
                    "Exacto, en las mañanas es cuando más lúcido estoy. Pero siempre me ponen las revisiones de KPIs a esa hora."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTEXT & ACTIONS */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full overflow-y-auto custom-scroll pr-1 pb-4">
          
          {/* Context Engine Card */}
          <div className="bg-navy-950 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shrink-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <h4 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
                <div className="p-1.5 bg-blue-500 rounded-lg"><Cpu className="w-4 h-4 text-white" /></div> NSG Context Engine
              </h4>
              <p className="text-blue-100 text-sm mb-6 max-w-lg">
                Hemos analizado tu sesión. Tu principal desafío es la <span className="text-white font-bold border-b border-blue-400">gestión de energía cognitiva</span> frente a la demanda operativa.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[0.6rem] font-bold text-blue-300 uppercase mb-1">Punto de Dolor</p>
                  <p className="text-sm font-bold">Fuga de Foco AM</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[0.6rem] font-bold text-emerald-300 uppercase mb-1">Oportunidad</p>
                  <p className="text-sm font-bold">Bloqueo Estratégico</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[0.6rem] font-bold text-purple-300 uppercase mb-1">Herramienta</p>
                  <p className="text-sm font-bold">Deep Work Protocol</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
            {/* Metodología */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <PenTool className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition" />
              </div>
              <h5 className="font-bold text-navy-900 text-lg mb-2">Metodología Sugerida</h5>
              <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                Aplicar el principio de "Eat the Frog" pero invertido para creativos: Estrategia primero, operación después.
              </p>
              <button className="w-full py-2.5 bg-slate-50 text-purple-700 font-bold text-xs rounded-xl hover:bg-purple-100 transition">
                Ver Guía de Implementación
              </button>
            </div>
            
            {/* Estrategia Táctica */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition" />
              </div>
              <h5 className="font-bold text-navy-900 text-lg mb-2">Estrategia Táctica</h5>
              <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                Reagendar reuniones de KPIs a las 3:00 PM. Utilizar las mañanas (8am - 11am) exclusivamente para diseño de visión.
              </p>
              <button className="w-full py-2.5 bg-slate-50 text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-100 transition">
                Añadir a Calendario
              </button>
            </div>
          </div>

          {/* Action Plan Checklist */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-card flex-1">
            <h4 className="font-bold text-navy-900 text-xl mb-6 flex items-center gap-3">
              <ListTodo className="w-6 h-6 text-blue-600" /> Plan de Acción Inmediata
            </h4>
            
            <div className="space-y-4">
              {/* Item 1 */}
              <div 
                className={clsx(
                  "flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer group",
                  checkedItems.includes(1) ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm"
                )}
                onClick={() => toggleItem(1)}
              >
                <div className={clsx(
                  "mt-1 w-5 h-5 rounded-full border-2 transition flex items-center justify-center",
                  checkedItems.includes(1) ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white group-hover:border-blue-500"
                )}>
                  {checkedItems.includes(1) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div>
                  <p className={clsx("font-bold text-sm", checkedItems.includes(1) ? "text-emerald-900" : "text-navy-900")}>
                    Bloquear calendario Lunes a Jueves
                  </p>
                  <p className={clsx("text-xs mt-1", checkedItems.includes(1) ? "text-emerald-700" : "text-slate-500")}>
                    De 08:00 AM a 11:00 AM como "No Disponible".
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div 
                className={clsx(
                  "flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer group",
                  checkedItems.includes(2) ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm"
                )}
                onClick={() => toggleItem(2)}
              >
                <div className={clsx(
                  "mt-1 w-5 h-5 rounded-full border-2 transition flex items-center justify-center",
                  checkedItems.includes(2) ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white group-hover:border-blue-500"
                )}>
                  {checkedItems.includes(2) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div>
                  <p className={clsx("font-bold text-sm", checkedItems.includes(2) ? "text-emerald-900" : "text-navy-900")}>
                    Comunicar cambio al equipo
                  </p>
                  <p className={clsx("text-xs mt-1", checkedItems.includes(2) ? "text-emerald-700" : "text-slate-500")}>
                    Enviar memo sobre nuevas ventanas de disponibilidad.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => showToast('Personalizando...', 'info')} 
              className="w-full mt-6 py-3 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Personalizar más acciones con AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}