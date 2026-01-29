"use client";

import { useState, useEffect } from "react";
import ContentLibrary from "@/components/education/library/ContentLibrary";
import ActionPlanView from "@/components/education/plan/ActionPlanView";
import DiagnosticForm from "@/components/education/diagnostic/DiagnosticForm";
import ProposalView from "@/components/education/diagnostic/ProposalView";
import { GraduationCap, BookOpen, Layers, Zap, Landmark, Globe, Activity } from "lucide-react";
import clsx from "clsx";
import StrategyWidget from "@/components/education/onboarding/StrategyWidget";

type EducationView = "library" | "plans" | "diagnostic";

export default function NSGEducationPage() {
    const [currentView, setCurrentView] = useState<EducationView>('library');
    
    // Strategy Widget State
    const [isStrategyOpen, setIsStrategyOpen] = useState(false);
    const [isStrategyMinimized, setIsStrategyMinimized] = useState(false);
    const [isStrategyCompleted, setIsStrategyCompleted] = useState(false);

    // Initial load: Open strategy if not completed (simulated)
    useEffect(() => {
        // Here we would check DB if onboarding is done
        setIsStrategyOpen(true);
    }, []);

    const NAV_ITEMS: { id: EducationView; label: string; icon: any }[] = [
        { id: 'library', label: 'Biblioteca Estratégica', icon: BookOpen },
        // Expanded functionality can be added here
    ];

    const handleOpenStrategy = () => {
        setIsStrategyOpen(true);
        setIsStrategyMinimized(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 gap-6 relative bg-slate-50 overflow-hidden font-sans">
            {/* Ambient Institutional Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.6] pointer-events-none mix-blend-multiply" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/50 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

            {/* Header / Command Center */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between z-20 shrink-0 gap-4">
                 <div className="flex flex-col gap-0.5">
                    <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-1.5 bg-navy-900 text-white rounded-lg shadow-md">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-navy-900">NSG Diplomatic Education</span>
                    </h1>
                    <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-[0.2em] pl-11">
                        Institutional Knowledge System v2.0
                    </p>
                 </div>

                 {/* Control Deck */}
                 <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl border border-white shadow-sm ring-1 ring-slate-200/50">
                     {NAV_ITEMS.map((item) => (
                         <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer relative group tracking-wide",
                                currentView === item.id 
                                    ? "bg-navy-900 text-white shadow-lg shadow-navy-900/20 ring-1 ring-white/10" 
                                    : "text-slate-500 hover:bg-slate-100 hover:text-navy-900"
                            )}
                         >
                             <item.icon className={clsx("w-3.5 h-3.5", currentView === item.id ? "text-slate-200" : "text-slate-400 group-hover:text-navy-900")} />
                             {item.label}
                         </button>
                     ))}
                     
                     {/* Divider */}
                     <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block"></div>

                     {/* Strategy Trigger Button */}
                     <button
                        onClick={handleOpenStrategy}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer relative group tracking-wide",
                            isStrategyOpen && !isStrategyMinimized
                                ? "bg-amber-50 text-amber-900 border border-amber-200/50 shadow-sm"
                                : "text-slate-500 hover:bg-amber-50/50 hover:text-amber-800"
                        )}
                     >
                         <Globe className={clsx("w-3.5 h-3.5", isStrategyOpen && !isStrategyMinimized ? "text-amber-600" : "text-slate-400 group-hover:text-amber-600")} />
                         Protocolo Estratégico
                     </button>
                 </div>
            </div>

            {/* Main Content Area - Sovereign Card */}
            <div className="flex-1 overflow-hidden relative z-10 animate-fade-in-up">
                <div className="w-full h-full bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/80 shadow-sovereign relative overflow-hidden flex flex-col group">
                    
                    {/* Glass top reflection */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50" />

                    <div className="flex-1 overflow-hidden relative">
                        {currentView === 'library' && (
                             // Wrapper for Library to fit the new card style without its own heavy borders if possible
                            <div className="h-full w-full overflow-hidden">
                                <ContentLibrary />
                            </div>
                        )}
                        {currentView === 'plans' && <ActionPlanView />}
                        {currentView === 'diagnostic' && (
                             <div className="h-full p-8 overflow-y-auto bg-slate-50/30">
                                <div className="max-w-4xl mx-auto">
                                    <DiagnosticWrapper /> 
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* STRATEGY WIDGET OVERLAY */}
            <StrategyWidget 
                isOpen={isStrategyOpen}
                isMinimized={isStrategyMinimized}
                isCompleted={isStrategyCompleted}
                onClose={() => setIsStrategyOpen(false)}
                onMinimize={() => setIsStrategyMinimized(true)}
                onMaximize={() => setIsStrategyMinimized(false)}
                onComplete={() => setIsStrategyCompleted(true)}
                onReset={() => setIsStrategyCompleted(false)}
            />
        </div>
    );
}

// Wrapper to switch between form and proposal in Diagnostic view
function DiagnosticWrapper() {
    const [showResult, setShowResult] = useState(false);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/60">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Diplomatic Diagnostic Core
                </h3>
                <button
                    onClick={() => setShowResult(!showResult)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                >
                    {showResult ? "Retornar al Formulario" : "Ver Análisis de Resultado"}
                </button>
            </div>
            {showResult ? <ProposalView /> : <DiagnosticForm />}
        </div>
    );
}
