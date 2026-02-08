"use client";

import { useState, useRef, useEffect } from "react";
import {
    ArrowLeft,
    Send,
    Sparkles,
    Lightbulb,
    Target,
    Zap,
    TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import BrandAtom from "@/components/ui/BrandAtom";
import { EducationContent, Message } from "@/types/education";
import { useAppStore } from "@/store/useAppStore";

interface ContentDetailProps {
    item: EducationContent;
    onBack: () => void;
}

const iconMap: Record<string, any> = {
    "💡": Lightbulb,
    "🎯": Target,
    "⚡": Zap,
    "🚀": TrendingUp,
};

export default function ContentDetail({ item, onBack }: ContentDetailProps) {
    const { userId } = useAppStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: `Hola! He analizado "${item.title}" específicamente para tu perfil estratégico. ¿En qué puedo ayudarte a profundizar?`,
            type: "text",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Extract AI analysis data from item
    const analysis = (item as any).fullData || {};
    const {
        title = item.title,
        summary = item.summary,
        strategic_analysis = {},
        key_insights = [],
        action_plan = [],
        suggested_questions = [],
    } = analysis;

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isFading, setIsFading] = useState(false);

    // Effect to handle transition when data is loaded
    useEffect(() => {
        if (isDataLoaded) {
            setIsFading(true);
            const timer = setTimeout(() => setIsFading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isDataLoaded]);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("nsg-token")
                    : null;

            const response = await fetch(
                `/api/nsg-education/content/${item.id}/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                        message: text,
                        history: messages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                        userId,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error("Error en la respuesta");
            }

            const data = await response.json();

            setIsTyping(false);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "system",
                content:
                    data.message?.content ||
                    data.output ||
                    "Respuesta procesada.",
                type: "text",
            };
            setMessages((prev) => [...prev, aiMsg]);

            // Temporary Logic: If certain keywords or just for testing, trigger content load
            // The user mentioned an AI agent will send a signal.
            if (aiMsg.content.includes("CARGAR_DATOS") || aiMsg.content.includes("ANÁLISIS_LISTO")) {
                setIsDataLoaded(true);
            }
        } catch (error: any) {
            console.error("Chat Error:", error);
            setIsTyping(false);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "system",
                content:
                    "Error al procesar tu pregunta. Por favor, intenta de nuevo.",
                type: "text",
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* LEFT Panel: Chat (Main focus first) */}
            <div className="w-full lg:w-[480px] flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-lg overflow-hidden lg:h-[calc(100vh-12rem)]">
                {/* Chat Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-all mr-1 shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Asistente Estratégico
                            </h3>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                                Agente de Calibración
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-5 space-y-4 bg-white"
                    style={{ scrollbarWidth: "thin" }}
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx(
                                "flex w-full gap-3 animate-fade-in",
                                msg.role === "user"
                                    ? "justify-end"
                                    : "justify-start",
                            )}
                        >
                            {msg.role === "system" && (
                                <div className="w-7 h-7 mt-0.5 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <BrandAtom className="w-full h-full text-white" />
                                </div>
                            )}
                            <div
                                className={clsx(
                                    "max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                                    msg.role === "user"
                                        ? "bg-slate-900 text-white rounded-br-sm"
                                        : "bg-slate-50 text-slate-700 rounded-bl-sm border border-slate-100",
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Suggested Questions */}
                    {messages.length === 1 &&
                        suggested_questions.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-start pl-10 pt-2">
                                {suggested_questions.map(
                                    (q: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(q)}
                                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition-all shadow-sm"
                                        >
                                            {q}
                                        </button>
                                    ),
                                )}
                            </div>
                        )}

                    {isTyping && (
                        <div className="flex justify-start w-full gap-3 pl-10">
                            <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                <div
                                    className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.15s" }}
                                ></div>
                                <div
                                    className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.3s" }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading Action (Simulation) */}
                {!isDataLoaded && (
                    <div className="px-5 py-3 bg-blue-50/50 border-t border-blue-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                            Estado: Calibrando Inteligencia
                        </span>
                        <button
                            onClick={() => setIsDataLoaded(true)}
                            className="text-[10px] font-bold text-white bg-blue-600 px-2 py-1 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Simular Carga
                        </button>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                !e.shiftKey &&
                                handleSend(input)
                            }
                            placeholder="Escribe tu pregunta..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                        <button
                            onClick={() => handleSend(input)}
                            disabled={!input.trim()}
                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT Panel: Content (Starts as skeleton) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white rounded-3xl border border-slate-100 shadow-sm relative lg:h-[calc(100vh-12rem)]">
                {!isDataLoaded ? (
                    <div className="animate-pulse space-y-8">
                        {/* Header Skeleton */}
                        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-24 bg-slate-100 rounded"></div>
                                <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        {/* Summary Skeleton */}
                        <div className="h-32 bg-slate-900/5 rounded-2xl"></div>
                        {/* Detailed Analysis Skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 w-40 bg-slate-100 rounded"></div>
                            <div className="h-48 bg-slate-50 rounded-3xl"></div>
                        </div>
                        {/* Insights Skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-slate-100 rounded"></div>
                            <div className="grid gap-4">
                                <div className="h-20 bg-slate-50 rounded-2xl"></div>
                                <div className="h-20 bg-slate-50 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={clsx("space-y-8", isFading ? "opacity-0" : "opacity-100 transition-opacity duration-500")}>
                        {/* Header */}
                        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Inteligencia Decodificada
                                    </p>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                                    {title}
                                </h1>
                            </div>
                        </div>

                        {/* Executive Summary */}
                        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                                <BrandAtom className="w-5 h-5 text-blue-400" />
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    Reporte Ejecutivo
                                </h3>
                            </div>
                            <p className="text-white/90 leading-relaxed text-lg font-medium italic">
                                "{summary}"
                            </p>
                        </section>

                        {/* Strategic Analysis */}
                        {strategic_analysis.alignment && (
                            <section className="space-y-6">
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                                    Alineación Estratégica
                                    <div className="flex-1 h-[1px] bg-slate-100"></div>
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-100/50">
                                        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                                            Valor Estratégico
                                        </h4>
                                        <p className="text-slate-700 leading-relaxed text-sm">
                                            {strategic_analysis.alignment}
                                        </p>
                                    </div>
                                    {strategic_analysis.friction_bypass && (
                                        <div className="bg-amber-50/30 p-6 rounded-3xl border border-amber-100/50">
                                            <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3">
                                                Superando Fricción
                                            </h4>
                                            <p className="text-slate-700 leading-relaxed text-sm">
                                                {strategic_analysis.friction_bypass}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Key Insights */}
                        {key_insights.length > 0 && (
                            <section className="space-y-6">
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                                    Insights de Valor
                                    <div className="flex-1 h-[1px] bg-slate-100"></div>
                                </h3>
                                <div className="grid gap-4">
                                    {key_insights.map((insight: any, i: number) => {
                                        const IconComponent =
                                            iconMap[insight.icon] || Sparkles;
                                        return (
                                            <div
                                                key={i}
                                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all flex items-start gap-4 group"
                                            >
                                                <div className="p-3 bg-slate-50 text-slate-900 rounded-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <p className="text-slate-700 leading-relaxed font-semibold flex-1 pt-0.5">
                                                    {insight.text}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Action Plan */}
                        {action_plan.length > 0 && (
                            <section className="space-y-8">
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                                    Plan de Ejecución
                                    <div className="flex-1 h-[1px] bg-slate-100"></div>
                                </h3>
                                <div className="space-y-4">
                                    {action_plan.map((step: any, i: number) => {
                                        const impactColors: Record<string, string> = {
                                            High: "emerald",
                                            Medium: "blue",
                                            Low: "slate",
                                        };
                                        const color = impactColors[step.impact] || "slate";

                                        return (
                                            <div key={i} className="flex gap-6 items-start group">
                                                <div className="pt-2">
                                                    <div className={`w-8 h-8 rounded-full border-2 border-${color}-500 flex items-center justify-center text-[10px] font-black text-${color}-600`}>
                                                        0{i + 1}
                                                    </div>
                                                </div>
                                                <div className="flex-1 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest text-${color}-600 py-1 px-2 bg-${color}-50 rounded-md`}>
                                                            {step.impact} Impact
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            EST. {step.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-900 font-bold leading-relaxed">
                                                        {step.task}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
