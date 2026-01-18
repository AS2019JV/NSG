"use client";
import { useUIStore } from "@/store/useUIStore";
import { X, Plus, Calendar, Clock, MapPin, AlignLeft, Activity, Target, AlertCircle, MoreHorizontal, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import BrandAtom from "@/components/ui/BrandAtom";

export default function DayDetailPanel() {
  const { isDayDetailOpen, selectedCalendarDate, closeDayDetail } = useUIStore();

  return (
    <>
      <AnimatePresence>
        {isDayDetailOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-950/40 z-[120] backdrop-blur-md cursor-pointer transition-all"
              onClick={closeDayDetail}
            />

            {/* Slide Over Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white shadow-2xl z-[130] border-l border-slate-200 flex flex-col h-full overflow-hidden"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none opacity-60"></div>

              {/* Header */}
              <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-start relative z-10">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-navy-100 shrink-0">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Registro Diario</p>
                    <h3 className="font-display font-bold text-3xl text-navy-900 leading-tight">Agenda Diaria</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                       {selectedCalendarDate}, 2024
                    </p>
                  </div>
                </div>
                <button 
                  onClick={closeDayDetail} 
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 cursor-pointer group"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-navy-950" />
                </button>
              </div>

              {/* Status Bar */}
              <div className="px-8 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sincronizado con Google</span>
                </div>
                <div className="text-[10px] font-bold text-navy-900 border border-slate-200 px-2 py-0.5 rounded uppercase">Q1 Performance</div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto custom-scroll space-y-10 safe-bottom-scroll relative z-10">
                
                {/* AI INSIGHT SECTION */}
                <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] shadow-lg shadow-blue-100 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default">
                   <div className="absolute top-0 right-0 p-4 opacity-20">
                     <Activity className="w-12 h-12" />
                   </div>
                   <div className="relative z-10 flex items-center gap-3 mb-3">
                     <BrandAtom className="w-5 h-5 text-white" variant="colored" />
                     <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">Neuro-Advisor Insight</span>
                   </div>
                   <p className="text-sm font-medium leading-relaxed opacity-90">
                     "Este día presenta una alta densidad de reuniones estratégicas. Se recomienda priorizar el 'Deep Work' entre las 11:00 AM y 1:00 PM para maximizar el ROI operativo."
                   </p>
                </div>

                {/* EVENTS SECTION */}
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      Cronograma Maestro
                    </h4>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      2 Eventos Activos
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Event Card 1 */}
                    <div className="group flex gap-5 p-5 bg-white border border-slate-100 hover:border-blue-200 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center px-3 border-r border-slate-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <span className="text-xs font-black">09:00</span>
                        <span className="text-[10px] font-bold opacity-60">AM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-navy-900 text-base">Revisión Trimestral</h4>
                          <span className="text-[8px] font-black bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100 uppercase">Alta Prioridad</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Virtual</span>
                           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 60 min</span>
                        </div>
                      </div>
                      <div className="w-4 h-4 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <MoreHorizontal className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>

                    {/* Event Card 2 */}
                    <div className="group flex gap-5 p-5 bg-white border border-slate-100 hover:border-blue-200 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center px-3 border-r border-slate-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <span className="text-xs font-black">02:30</span>
                        <span className="text-[10px] font-bold opacity-60">PM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-navy-900 text-base">Análisis de Pipeline</h4>
                          <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase">Estratégico</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Board Room 4</span>
                           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 45 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* NOTES SECTION */}
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-blue-600" />
                    Observaciones & Objetivos
                  </h4>
                  <div className="relative group">
                    <div className="absolute top-4 right-4 text-blue-400 opacity-20 group-hover:opacity-100 transition-opacity">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <textarea 
                      className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white resize-none transition-all duration-300 placeholder:text-slate-300" 
                      placeholder="Identifica los objetivos críticos para el éxito de esta jornada..."
                    ></textarea>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-slate-100 bg-white shrink-0 safe-bottom-scroll relative z-10 flex gap-3">
                <button 
                  disabled
                  className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
                >
                  <Plus className="w-4 h-4" /> Próximamente
                </button>
                <button className="p-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
