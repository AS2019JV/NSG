"use client";

import { EducationContent } from "@/types/education";
import {
    ArrowLeft,
    Brain,
    Loader2,
    Target,
    ListChecks,
    ChevronRight,
    Lightbulb,
    CheckCircle2,
    TrendingUp,
    Compass,
    Rocket,
    Milestone,
    Briefcase,
    Layers,
    Send,
    X,
} from "lucide-react";
import BrandAtom from "@/components/ui/BrandAtom";
import { useToast } from "@/components/ui/ToastProvider";
import { useState, useEffect, useCallback, useRef } from "react";
import { educationService } from "@/lib/education";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ContentDetailProps {
    item: EducationContent;
    onBack: () => void;
    onTrackingChange?: (contentId: string, isActive: boolean) => void;
}

interface QuestionBlock {
    block: string;
    intent: string;
    questions: Array<{
        id: string;
        question: string;
        type: string;
        options?: string[];
    }>;
}

interface GeneratedContent {
    question_process_generated?: {
        title?: string;
        summary?: string;
        key_insights?: Array<{ icon: string; text: string }>;
        strategic_analysis?: {
            alignment: string;
            friction_bypass: string;
        };
        action_plan?: Array<{
            task: string;
            impact: string;
            time: string;
        }>;
    };
}

const LOADING_PHRASES = [
    "Decodificando arquitectura de datos estratégica...",
    "Procesando análisis de alta precisión...",
    "Finalizando. Tu protocolo estará listo en breve.",
];

export default function ContentDetail({ item, onBack, onTrackingChange }: ContentDetailProps) {
    const { showToast } = useToast();
    const [currentItem, setCurrentItem] = useState<EducationContent>(item);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [direction, setDirection] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedData, setGeneratedData] = useState<GeneratedContent | null>(
        null,
    );
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const hasTriggeredRef = useRef<boolean>(false);
    const [phraseIndex, setPhraseIndex] = useState(0);

    // Copilot tracking state
    const [isTrackingThis, setIsTrackingThis] = useState(false);
    const [isTrackingOther, setIsTrackingOther] = useState<string | null>(null);
    const [isActivatingTracking, setIsActivatingTracking] = useState(false);

    const qProcess =
        currentItem.question_process || (currentItem.fullData?.question_process as any);

    const isCompleted = qProcess?.completed === true || !!generatedData;
    const blocks: QuestionBlock[] = (qProcess?.question_blocks ||
        []) as QuestionBlock[];

    const allQuestions = Array.isArray(blocks)
        ? blocks.flatMap((b) =>
              (b.questions || []).map((q) => ({
                  ...q,
                  blockTitle: b.block,
                  blockIntent: b.intent,
              })),
          )
        : [];

    // Phrase rotation effect
    useEffect(() => {
        if (!isCompleted && allQuestions.length === 0) {
            const interval = setInterval(() => {
                setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isCompleted, allQuestions.length]);

    const refreshContent = useCallback(async () => {
        try {
            setIsRefreshing(true);
            const updated = await educationService.getContent(currentItem.id);
            if (updated) {
                setCurrentItem(updated);
            }
        } catch (error) {
            console.error("Error refreshing content:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, [currentItem.id]);

    // Initial Sync on mount
    const checkTrackingStatus = useCallback(async () => {
        try {
            const status = await educationService.getTrackingStatus();
            if (status.active && status.resource_id === currentItem.id) {
                setIsTrackingThis(true);
                setIsTrackingOther(null);
            } else if (status.active) {
                setIsTrackingThis(false);
                setIsTrackingOther(status.title || "otro recurso");
            } else {
                setIsTrackingThis(false);
                setIsTrackingOther(null);
            }
        } catch (err) {
            console.error("Error checking tracking status:", err);
        }
    }, [currentItem.id]);

    // Check current tracking status on mount/id change
    useEffect(() => {
        checkTrackingStatus();
    }, [checkTrackingStatus]);

    // Handle tracking activation
    const handleActivateTracking = async () => {
        // Solo preguntar si vamos a activar uno nuevo y ya hay otro activo
        if (!isTrackingThis && isTrackingOther) {
            const confirmed = window.confirm(
                `Ya tienes accionables en seguimiento ("${isTrackingOther}"). ¿Deseas reemplazarlos con los de este recurso?`
            );
            if (!confirmed) return;
        }

        try {
            setIsActivatingTracking(true);
            const response = await educationService.activateTracking(currentItem.id);
            
            // La respuesta ahora contiene el nuevo estado (true o false)
            // Backend devuelve { success, data: { copilot_tracking_active } }
            const newStatus = !!response.data?.copilot_tracking_active;
            setIsTrackingThis(newStatus);
            
            // Inform parent about the change to keep UI in sync
            if (onTrackingChange) {
                onTrackingChange(currentItem.id, newStatus);
            }

            // Sync with server for full consistency
            await checkTrackingStatus();
            await refreshContent();
        } catch (error) {
            console.error("Error toggling tracking:", error);
            showToast("Error", "error");
        } finally {
            setIsActivatingTracking(false);
        }
    };

    useEffect(() => {
        setInitialCheckDone(false);
        refreshContent().finally(() => setInitialCheckDone(true));
    }, [refreshContent]);

    const handleFinishAnswers = async () => {
        try {
            setIsSubmitting(true);
            await educationService.saveAnswers(currentItem.id, answers);
            showToast(
                "Respuestas enviadas. Generando análisis final...",
                "success",
            );

            const finalData = await educationService.getGeneratedContent(
                currentItem.id,
            );
            setGeneratedData(finalData);
            showToast("Análisis completado exitosamente", "success");
            await refreshContent();
        } catch (error) {
            console.error("Error saving answers:", error);
            showToast(
                "No se pudo generar el análisis. Intenta de nuevo.",
                "error",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Webhook Trigger Logic
    useEffect(() => {
        const triggerWebhook = async () => {
            if (!initialCheckDone) return; // CRITICAL: Wait for data sync before triggering generation

            if (
                !isCompleted &&
                allQuestions.length === 0 &&
                !hasTriggeredRef.current
            ) {
                hasTriggeredRef.current = true;

                try {
                    const fullData = currentItem.fullData;
                    const data = await educationService.startQuestions(
                        currentItem.id,
                        fullData?.telegram_id,
                    );

                    if (data && data.question_process) {
                        setCurrentItem((prev) => ({
                            ...prev,
                            question_process: data.question_process,
                        }));
                        showToast("Protocolo de preguntas generado", "success");
                    }

                    setTimeout(refreshContent, 3000);
                } catch (error) {
                    console.error("Error triggering webhook:", error);
                }
            }
        };

        triggerWebhook();
    }, [
        isCompleted,
        allQuestions.length,
        currentItem.id,
        currentItem.fullData,
        refreshContent,
        showToast,
        initialCheckDone,
    ]);

    // Fetch generated content if already completed
    useEffect(() => {
        if (qProcess?.completed === true && !generatedData && !isRefreshing) {
            const fetchGenerated = async () => {
                try {
                    const data = await educationService.getGeneratedContent(
                        currentItem.id,
                    );
                    setGeneratedData(data);
                } catch (error) {
                    console.error("Error fetching generated content:", error);
                }
            };
            fetchGenerated();
        }
    }, [qProcess?.completed, currentItem.id, generatedData, isRefreshing]);

    // Long polling if still processing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isCompleted && allQuestions.length === 0) {
            interval = setInterval(refreshContent, 5000);
        }
        return () => clearInterval(interval);
    }, [isCompleted, allQuestions.length, refreshContent]);

    const handleNext = (total: number) => {
        if (currentStep < total - 1) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        } else {
            handleFinishAnswers();
        }
    };

    const handleBackBtn = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Render Analysis Cards
    const renderAnalysis = () => {
        const data = (generatedData?.question_process_generated ||
            currentItem.fullData) as GeneratedContent["question_process_generated"];
        if (!data) return null;

        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.15,
                },
            },
        };

        const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
        };

        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto space-y-8 pb-12"
            >
                {/* Header Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-blue-500/5 relative overflow-hidden"
                >
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="relative group w-16 h-16 flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full animate-pulse"></div>
                                <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-50/80 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
                                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-blue-100/40 to-transparent skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                                    <Brain className="w-8 h-8 text-blue-600 relative z-10 drop-shadow-sm stroke-[1.5]" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-display font-bold text-navy-950 tracking-tight prose prose-p:my-0 prose-strong:text-navy-900 drop-shadow-sm">
                                <ReactMarkdown>
                                    Análisis Estratégico
                                </ReactMarkdown>
                            </div>
                        </div>
                        <div className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl prose prose-p:my-0 prose-strong:text-slate-700">
                            <ReactMarkdown>
                                {data.summary ||
                                    "He procesado este recurso bajo tu arquitectura de pensamiento. Aquí tienes el horizonte de ejecución."}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Key insights */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl shadow-blue-500/5 space-y-6"
                    >
                        <div className="flex items-center gap-3 text-blue-600">
                            <Lightbulb className="w-6 h-6" />
                            <div className="font-bold text-lg uppercase tracking-wider prose prose-p:my-0 prose-strong:text-blue-600">
                                <ReactMarkdown>Key Insights</ReactMarkdown>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {(data.key_insights || []).map(
                                (
                                    insight: { icon?: string; text: string },
                                    i: number,
                                ) => {
                                    const INSIGHT_ICONS = [Lightbulb, Briefcase, Layers, TrendingUp, Compass, Rocket, Milestone];
                                    const IconComponent = INSIGHT_ICONS[i % INSIGHT_ICONS.length];
                                    const isFirst = i === 0;

                                    return (
                                        <div
                                            key={i}
                                            className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100/60 group hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className={clsx("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors",
                                                isFirst ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20 group-hover:bg-blue-700" : "bg-blue-50/50 group-hover:bg-blue-50 border-blue-100/50 group-hover:border-blue-200"
                                            )}>
                                                <IconComponent className={clsx("w-5 h-5", isFirst ? "text-white" : "text-blue-500")} />
                                            </div>
                                            <div className="flex-1 text-sm font-medium text-slate-600 leading-relaxed prose prose-p:my-0 prose-strong:text-navy-900 prose-strong:font-bold">
                                                <ReactMarkdown>
                                                    {insight.text?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </motion.div>

                    {/* Strategic Alignment */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-navy-900 rounded-4xl p-8 text-white shadow-xl shadow-navy-900/10 space-y-6 relative overflow-hidden"
                    >
                        <div className="absolute -bottom-8 -right-8 opacity-10">
                            <Brain className="w-40 h-40 text-white" />
                        </div>
                        <div className="flex items-center gap-3 text-blue-400 relative z-10">
                            <Target className="w-6 h-6" />
                            <div className="font-bold text-lg uppercase tracking-wider prose prose-p:my-0 prose-strong:text-blue-400">
                                <ReactMarkdown>Alineación</ReactMarkdown>
                            </div>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                    Objetivo
                                </span>
                                <div className="text-sm leading-relaxed text-slate-200 prose prose-p:my-0 prose-strong:text-white prose-invert">
                                    <ReactMarkdown>
                                        {data.strategic_analysis?.alignment ||
                                            ""}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                    Bypass de Fricción
                                </span>
                                <div className="text-sm leading-relaxed text-slate-200 prose prose-p:my-0 prose-strong:text-white prose-invert">
                                    <ReactMarkdown>
                                        {data.strategic_analysis
                                            ?.friction_bypass || ""}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Plan */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-4xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-blue-500/5 space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-emerald-600">
                            <ListChecks className="w-6 h-6" />
                            <div className="font-bold text-lg uppercase tracking-wider prose prose-p:my-0 prose-strong:text-emerald-600">
                                <ReactMarkdown>Plan de Acción</ReactMarkdown>
                            </div>
                        </div>
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full uppercase">
                            Próximos Pasos
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {(data.action_plan || []).map(
                            (
                                step: {
                                    task: string;
                                    impact: string;
                                    time: string;
                                },
                                i: number,
                            ) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-2xl group hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100"
                                >
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-navy-900 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-navy-900 prose prose-p:my-0 prose-strong:text-navy-900">
                                            <ReactMarkdown>
                                                {step.task}
                                            </ReactMarkdown>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span
                                                className={clsx(
                                                    "text-[9px] font-black uppercase tracking-widest",
                                                    step.impact === "High"
                                                        ? "text-red-500"
                                                        : "text-amber-500",
                                                )}
                                            >
                                                Impacto {step.impact}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {step.time}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            ),
                        )}
                    </div>
                </motion.div>

                {/* Copilot Tracking Button with Toggle Interaction */}
                <div className="flex flex-col items-center gap-4 py-4 w-full">
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleActivateTracking}
                        disabled={isActivatingTracking}
                        className={clsx(
                            "w-full max-w-md rounded-2xl font-bold text-sm uppercase tracking-wider py-4 px-8 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg",
                            isTrackingThis 
                                ? "bg-white text-emerald-600 border border-emerald-100 shadow-emerald-500/10" 
                                : "text-white shadow-blue-500/20"
                        )}
                        style={!isTrackingThis ? {
                            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        } : {}}
                    >
                        {isActivatingTracking ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Procesando...
                            </>
                        ) : isTrackingThis ? (
                            <>
                                <X className="w-5 h-5" />
                                Quitar
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Activar
                            </>
                        )}
                    </motion.button>
                    
                    {!isTrackingThis && isTrackingOther && (
                        <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest text-center">
                            ⚠️ Reemplazará seguimiento activo: "{isTrackingOther}"
                        </p>
                    )}

                    {isTrackingThis && (
                        <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest text-center">
                            Este recurso está siendo monitoreado por Copilot
                        </p>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-3 sm:p-4 z-50 shrink-0">
                <div className="max-w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-navy-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col justify-center">
                            <div className="font-display font-semibold text-lg text-navy-950 tracking-tight leading-snug prose prose-p:my-0 prose-strong:text-navy-900">
                                <ReactMarkdown>
                                    {generatedData?.question_process_generated
                                        ?.title ||
                                        currentItem.title ||
                                        currentItem.fullData?.title ||
                                        "Recurso de Inteligencia"}
                                </ReactMarkdown>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                {isCompleted
                                    ? "Análisis Estratégico Finalizado"
                                    : "Agente de Inteligencia Estratégica"}
                            </p>
                        </div>
                    </div>
                    {isRefreshing && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Sincronizando...
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 overflow-hidden">
                {isCompleted ? (
                    renderAnalysis()
                ) : allQuestions.length > 0 ? (
                    <div
                        className="w-full max-w-3xl mx-auto flex flex-col flex-1 overflow-hidden"
                        style={{ gap: "clamp(0.5rem, 1.2dvh, 0.75rem)" }}
                    >
                        {/* Progress Header — Dark Glass */}
                        <div
                            className="rounded-2xl shrink-0 border border-white/10 backdrop-blur-xl"
                            style={{
                                padding:
                                    "clamp(0.6rem, 1.5dvh, 1.25rem) clamp(0.75rem, 2dvw, 1.5rem)",
                                background:
                                    "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
                            }}
                        >
                            <div
                                className="flex items-center justify-between"
                                style={{
                                    marginBottom:
                                        "clamp(0.375rem, 1dvh, 0.75rem)",
                                }}
                            >
                                <div>
                                    <span
                                        className="font-semibold uppercase tracking-[0.15em] text-cyan-400/80"
                                        style={{
                                            fontSize:
                                                "clamp(0.5rem, 1.1dvh, 0.625rem)",
                                        }}
                                    >
                                        Protocolo de Análisis
                                    </span>
                                    <h4
                                        className="font-display font-bold text-white/90"
                                        style={{
                                            fontSize:
                                                "clamp(0.75rem, 1.8dvh, 1rem)",
                                        }}
                                    >
                                        Etapa {currentStep + 1} de{" "}
                                        {allQuestions.length}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <span
                                        className="font-display font-bold text-white"
                                        style={{
                                            fontSize:
                                                "clamp(1rem, 2.8dvh, 1.5rem)",
                                        }}
                                    >
                                        {Math.round(
                                            ((currentStep + 1) /
                                                allQuestions.length) *
                                                100,
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>
                            <div
                                className="w-full rounded-full overflow-hidden"
                                style={{
                                    height: "clamp(3px, 0.6dvh, 6px)",
                                    background: "rgba(255,255,255,0.08)",
                                }}
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)",
                                        boxShadow:
                                            "0 0 20px rgba(6,182,212,0.4)",
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${((currentStep + 1) / allQuestions.length) * 100}%`,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "circOut",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div
                            className="relative flex-1 flex flex-col overflow-hidden"
                            style={{
                                paddingTop: "clamp(0.125rem, 0.3dvh, 0.25rem)",
                            }}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    initial={{
                                        x: direction > 0 ? 30 : -30,
                                        opacity: 0,
                                        scale: 0.98,
                                    }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    exit={{
                                        x: direction > 0 ? -30 : 30,
                                        opacity: 0,
                                        scale: 0.98,
                                    }}
                                    transition={{
                                        type: "spring",
                                        damping: 28,
                                        stiffness: 220,
                                    }}
                                    className="w-full flex-1 flex flex-col"
                                >
                                    <div
                                        className="rounded-2xl border border-white/[0.08] backdrop-blur-xl flex flex-col relative overflow-hidden flex-1"
                                        style={{
                                            padding:
                                                "clamp(0.75rem, 2dvh, 1.5rem) clamp(0.875rem, 2.5dvw, 1.75rem)",
                                            gap: "clamp(0.5rem, 1.5dvh, 1.25rem)",
                                            background:
                                                "linear-gradient(160deg, rgba(15,23,42,0.97), rgba(20,30,48,0.95), rgba(15,23,42,0.97))",
                                            boxShadow:
                                                "0 0 0 1px rgba(6,182,212,0.06), 0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                                        }}
                                    >
                                        {/* Top accent line */}
                                        <div
                                            className="absolute top-0 left-0 w-full"
                                            style={{
                                                height: "2px",
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(59,130,246,0.5), transparent)",
                                            }}
                                        />

                                        {/* Question header */}
                                        <div
                                            className="shrink-0"
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "clamp(0.25rem, 0.7dvh, 0.5rem)",
                                            }}
                                        >
                                            <div
                                                className="flex items-center"
                                                style={{
                                                    gap: "clamp(0.375rem, 0.8dvh, 0.5rem)",
                                                }}
                                            >
                                                <div
                                                    className="rounded-full"
                                                    style={{
                                                        width: "clamp(5px, 0.8dvh, 7px)",
                                                        height: "clamp(5px, 0.8dvh, 7px)",
                                                        background: "#06b6d4",
                                                        boxShadow:
                                                            "0 0 12px rgba(6,182,212,0.6)",
                                                    }}
                                                />
                                                <span
                                                    className="font-semibold text-cyan-400/70 uppercase tracking-[0.15em]"
                                                    style={{
                                                        fontSize:
                                                            "clamp(0.5rem, 1.1dvh, 0.625rem)",
                                                    }}
                                                >
                                                    {
                                                        allQuestions[
                                                            currentStep
                                                        ].blockTitle
                                                    }
                                                </span>
                                            </div>
                                            <h4
                                                className="font-display font-bold text-white/95 leading-snug"
                                                style={{
                                                    fontSize:
                                                        "clamp(0.875rem, 2.2dvh, 1.25rem)",
                                                }}
                                            >
                                                {
                                                    allQuestions[currentStep]
                                                        .question
                                                }
                                            </h4>
                                        </div>

                                        {/* Input Section */}
                                        <div className="flex-1 flex flex-col justify-center overflow-y-auto">
                                            {allQuestions[currentStep]
                                                .options &&
                                            allQuestions[currentStep].options!
                                                .length > 0 ? (
                                                <div
                                                    className="grid grid-cols-1"
                                                    style={{
                                                        gap: "clamp(0.375rem, 0.9dvh, 0.75rem)",
                                                    }}
                                                >
                                                    {(
                                                        allQuestions[
                                                            currentStep
                                                        ].options || []
                                                    ).map(
                                                        (
                                                            opt: string,
                                                            idx: number,
                                                        ) => (
                                                            <motion.button
                                                                key={opt}
                                                                whileHover={{
                                                                    x: 4,
                                                                    transition:
                                                                        {
                                                                            duration: 0.2,
                                                                        },
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.98,
                                                                }}
                                                                onClick={() =>
                                                                    setAnswers({
                                                                        ...answers,
                                                                        [allQuestions[
                                                                            currentStep
                                                                        ].id ||
                                                                        `q-${currentStep}`]:
                                                                            opt,
                                                                    })
                                                                }
                                                                className={clsx(
                                                                    "w-full rounded-xl text-left font-medium transition-all flex items-center justify-between group border",
                                                                    answers[
                                                                        allQuestions[
                                                                            currentStep
                                                                        ].id ||
                                                                            `q-${currentStep}`
                                                                    ] === opt
                                                                        ? "border-cyan-500/50 text-white"
                                                                        : "border-white/[0.06] text-white/70 hover:text-white hover:border-white/15",
                                                                )}
                                                                style={{
                                                                    padding:
                                                                        "clamp(0.5rem, 1.4dvh, 1rem) clamp(0.75rem, 1.5dvw, 1.25rem)",
                                                                    background:
                                                                        answers[
                                                                            allQuestions[
                                                                                currentStep
                                                                            ]
                                                                                .id ||
                                                                                `q-${currentStep}`
                                                                        ] ===
                                                                        opt
                                                                            ? "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.12))"
                                                                            : "rgba(255,255,255,0.03)",
                                                                    boxShadow:
                                                                        answers[
                                                                            allQuestions[
                                                                                currentStep
                                                                            ]
                                                                                .id ||
                                                                                `q-${currentStep}`
                                                                        ] ===
                                                                        opt
                                                                            ? "0 0 20px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.08)"
                                                                            : "inset 0 1px 0 rgba(255,255,255,0.03)",
                                                                }}
                                                            >
                                                                <div
                                                                    className="flex items-center"
                                                                    style={{
                                                                        gap: "clamp(0.5rem, 1dvh, 0.75rem)",
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={clsx(
                                                                            "font-mono font-bold shrink-0 flex items-center justify-center rounded-lg",
                                                                            answers[
                                                                                allQuestions[
                                                                                    currentStep
                                                                                ]
                                                                                    .id ||
                                                                                    `q-${currentStep}`
                                                                            ] ===
                                                                                opt
                                                                                ? "text-cyan-300"
                                                                                : "text-white/30",
                                                                        )}
                                                                        style={{
                                                                            fontSize:
                                                                                "clamp(0.563rem, 1.2dvh, 0.75rem)",
                                                                            width: "clamp(1.25rem, 3dvh, 1.75rem)",
                                                                            height: "clamp(1.25rem, 3dvh, 1.75rem)",
                                                                            background:
                                                                                answers[
                                                                                    allQuestions[
                                                                                        currentStep
                                                                                    ]
                                                                                        .id ||
                                                                                        `q-${currentStep}`
                                                                                ] ===
                                                                                opt
                                                                                    ? "rgba(6,182,212,0.15)"
                                                                                    : "rgba(255,255,255,0.05)",
                                                                            border: `1px solid ${answers[allQuestions[currentStep].id || `q-${currentStep}`] === opt ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.08)"}`,
                                                                        }}
                                                                    >
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                                idx,
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            fontSize:
                                                                                "clamp(0.75rem, 1.7dvh, 0.938rem)",
                                                                        }}
                                                                    >
                                                                        {opt}
                                                                    </span>
                                                                </div>
                                                                <CheckCircle2
                                                                    className={clsx(
                                                                        "shrink-0 ml-2 transition-all",
                                                                        answers[
                                                                            allQuestions[
                                                                                currentStep
                                                                            ]
                                                                                .id ||
                                                                                `q-${currentStep}`
                                                                        ] ===
                                                                            opt
                                                                            ? "opacity-100 text-cyan-400"
                                                                            : "opacity-0 group-hover:opacity-20 text-white/40",
                                                                    )}
                                                                    style={{
                                                                        width: "clamp(0.875rem, 2dvh, 1.25rem)",
                                                                        height: "clamp(0.875rem, 2dvh, 1.25rem)",
                                                                    }}
                                                                />
                                                            </motion.button>
                                                        ),
                                                    )}
                                                </div>
                                            ) : allQuestions[currentStep]
                                                  .type === "boolean" ? (
                                                <div
                                                    className="grid grid-cols-2"
                                                    style={{
                                                        gap: "clamp(0.5rem, 1.2dvh, 1rem)",
                                                    }}
                                                >
                                                    {["Sí", "No"].map((opt) => (
                                                        <motion.button
                                                            key={opt}
                                                            whileHover={{
                                                                y: -3,
                                                                transition: {
                                                                    duration: 0.2,
                                                                },
                                                            }}
                                                            whileTap={{
                                                                scale: 0.96,
                                                            }}
                                                            onClick={() =>
                                                                setAnswers({
                                                                    ...answers,
                                                                    [allQuestions[
                                                                        currentStep
                                                                    ].id ||
                                                                    `q-${currentStep}`]:
                                                                        opt,
                                                                })
                                                            }
                                                            className={clsx(
                                                                "border rounded-xl font-bold transition-all text-center",
                                                                answers[
                                                                    allQuestions[
                                                                        currentStep
                                                                    ].id ||
                                                                        `q-${currentStep}`
                                                                ] === opt
                                                                    ? "border-cyan-500/50 text-white"
                                                                    : "border-white/[0.06] text-white/60 hover:text-white hover:border-white/15",
                                                            )}
                                                            style={{
                                                                padding:
                                                                    "clamp(0.75rem, 2.5dvh, 1.5rem)",
                                                                fontSize:
                                                                    "clamp(0.938rem, 2.2dvh, 1.125rem)",
                                                                background:
                                                                    answers[
                                                                        allQuestions[
                                                                            currentStep
                                                                        ].id ||
                                                                            `q-${currentStep}`
                                                                    ] === opt
                                                                        ? "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.12))"
                                                                        : "rgba(255,255,255,0.03)",
                                                                boxShadow:
                                                                    answers[
                                                                        allQuestions[
                                                                            currentStep
                                                                        ].id ||
                                                                            `q-${currentStep}`
                                                                    ] === opt
                                                                        ? "0 0 20px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.08)"
                                                                        : "inset 0 1px 0 rgba(255,255,255,0.03)",
                                                            }}
                                                        >
                                                            {opt}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <textarea
                                                    placeholder="Describe tu respuesta aquí..."
                                                    className="w-full flex-1 rounded-xl text-white/90 font-medium outline-none transition-all resize-none placeholder:text-white/25"
                                                    style={{
                                                        padding:
                                                            "clamp(0.625rem, 1.5dvh, 1rem)",
                                                        fontSize:
                                                            "clamp(0.75rem, 1.6dvh, 0.875rem)",
                                                        minHeight:
                                                            "clamp(60px, 15dvh, 150px)",
                                                        background:
                                                            "rgba(255,255,255,0.04)",
                                                        border: "1px solid rgba(255,255,255,0.08)",
                                                        boxShadow:
                                                            "inset 0 2px 4px rgba(0,0,0,0.2)",
                                                    }}
                                                    value={
                                                        answers[
                                                            allQuestions[
                                                                currentStep
                                                            ].id ||
                                                                `q-${currentStep}`
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        setAnswers({
                                                            ...answers,
                                                            [allQuestions[
                                                                currentStep
                                                            ].id ||
                                                            `q-${currentStep}`]:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>

                                        {/* Navigation */}
                                        <div
                                            className="flex items-center justify-between shrink-0"
                                            style={{
                                                paddingTop:
                                                    "clamp(0.5rem, 1dvh, 1rem)",
                                                borderTop:
                                                    "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            <button
                                                onClick={handleBackBtn}
                                                disabled={currentStep === 0}
                                                className="flex items-center font-semibold uppercase tracking-[0.15em] text-white/30 hover:text-white/60 disabled:opacity-0 transition-colors"
                                                style={{
                                                    gap: "clamp(0.25rem, 0.5dvh, 0.5rem)",
                                                    fontSize:
                                                        "clamp(0.563rem, 1.1dvh, 0.688rem)",
                                                }}
                                            >
                                                <ArrowLeft
                                                    style={{
                                                        width: "clamp(0.75rem, 1.8dvh, 1rem)",
                                                        height: "clamp(0.75rem, 1.8dvh, 1rem)",
                                                    }}
                                                />
                                                Atrás
                                            </button>

                                            <motion.button
                                                whileHover={{
                                                    scale: 1.03,
                                                    y: -1,
                                                }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() =>
                                                    handleNext(
                                                        allQuestions.length,
                                                    )
                                                }
                                                disabled={
                                                    isSubmitting ||
                                                    (allQuestions[currentStep]
                                                        .type !== "text" &&
                                                        !answers[
                                                            allQuestions[
                                                                currentStep
                                                            ].id ||
                                                                `q-${currentStep}`
                                                        ])
                                                }
                                                className="rounded-xl font-bold uppercase tracking-[0.12em] transition-all flex items-center disabled:opacity-40 disabled:cursor-not-allowed text-white"
                                                style={{
                                                    padding:
                                                        "clamp(0.5rem, 1.3dvh, 0.875rem) clamp(1rem, 2.5dvw, 1.75rem)",
                                                    fontSize:
                                                        "clamp(0.563rem, 1.1dvh, 0.688rem)",
                                                    gap: "clamp(0.375rem, 0.7dvh, 0.5rem)",
                                                    background:
                                                        "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                                    boxShadow:
                                                        "0 0 20px rgba(6,182,212,0.25), 0 4px 12px rgba(0,0,0,0.3)",
                                                }}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2
                                                            className="animate-spin"
                                                            style={{
                                                                width: "clamp(0.75rem, 1.8dvh, 1rem)",
                                                                height: "clamp(0.75rem, 1.8dvh, 1rem)",
                                                            }}
                                                        />{" "}
                                                        Procesando...
                                                    </>
                                                ) : (
                                                    <>
                                                        {currentStep ===
                                                        allQuestions.length - 1
                                                            ? "Finalizar"
                                                            : "Continuar"}
                                                        <ChevronRight
                                                            style={{
                                                                width: "clamp(0.75rem, 1.8dvh, 1rem)",
                                                                height: "clamp(0.75rem, 1.8dvh, 1rem)",
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-fade-in relative z-10">
                        {/* Original Brand Atom Box */}
                        <div className="relative group flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                            <BrandAtom variant="colored" className="w-24 h-24 relative z-10" />
                        </div>
                        <div className="text-center space-y-3 max-w-md mx-auto relative h-24">
                            <h3 className="text-xl font-display font-semibold text-navy-950 tracking-tight">
                                Generando Protocolo...
                            </h3>

                            <div className="relative h-12 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={phraseIndex}
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                            filter: "blur(4px)",
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                            filter: "blur(4px)",
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                        }}
                                        className="text-slate-500 text-sm font-medium leading-relaxed absolute w-full text-center"
                                    >
                                        {LOADING_PHRASES[phraseIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-center gap-1.5 pt-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            opacity: [0.3, 1, 0.3],
                                            scale: [1, 1.2, 1],
                                            backgroundColor: [
                                                "#cbd5e1",
                                                "#2563eb",
                                                "#cbd5e1",
                                            ],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                        className="w-1.5 h-1.5 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
