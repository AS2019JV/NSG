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
            {/* Left Panel: AI Analysis - Minimalist & Clean */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white rounded-2xl shadow-sm">
                {/* Header - Simplified */}
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Análisis Estratégico AI
                            </p>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Executive Summary - Clean Card */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-md">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                        Reporte Ejecutivo
                    </h3>
                    <p className="text-white/90 leading-relaxed text-[15px]">
                        {summary}
                    </p>
                </section>

                {/* Strategic Analysis */}
                {strategic_analysis.alignment && (
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-blue-500"></div>
                            Alineación Estratégica
                        </h3>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                                    Por qué es vital para ti
                                </h4>
                                <p className="text-slate-700 leading-relaxed">
                                    {strategic_analysis.alignment}
                                </p>
                            </div>
                            {strategic_analysis.friction_bypass && (
                                <div>
                                    <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">
                                        Superando tu fricción
                                    </h4>
                                    <p className="text-slate-700 leading-relaxed">
                                        {strategic_analysis.friction_bypass}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Key Insights */}
                {key_insights.length > 0 && (
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-purple-500"></div>
                            Insights Clave
                        </h3>
                        <div className="grid gap-4">
                            {key_insights.map((insight: any, i: number) => {
                                const IconComponent =
                                    iconMap[insight.icon] || Sparkles;
                                return (
                                    <div
                                        key={i}
                                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                                    >
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <p className="text-slate-700 leading-relaxed font-medium flex-1">
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
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-emerald-500"></div>
                            Plan de Acción
                        </h3>
                        <div className="grid gap-6">
                            {action_plan.map((step: any, i: number) => {
                                const impactColors = {
                                    High: "emerald",
                                    Medium: "blue",
                                    Low: "slate",
                                };
                                const color =
                                    impactColors[
                                        step.impact as keyof typeof impactColors
                                    ] || "slate";

                                return (
                                    <div key={i} className="relative group">
                                        {i !== action_plan.length - 1 && (
                                            <div className="hidden md:block absolute left-9 top-16 bottom-[-24px] w-0.5 bg-slate-100"></div>
                                        )}
                                        <div className="flex gap-6 items-start">
                                            <div className="hidden md:flex flex-col items-center gap-2 shrink-0 w-20 pt-2">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    Paso
                                                </div>
                                                <div
                                                    className={`text-3xl font-display font-bold text-${color}-500`}
                                                >
                                                    0{i + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="md:hidden text-xs font-bold text-emerald-500 uppercase tracking-widest">
                                                        Paso 0{i + 1}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`px-3 py-1 bg-${color}-50 text-${color}-700 text-xs font-bold rounded-full`}
                                                        >
                                                            {step.impact} Impact
                                                        </span>
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            ⏱ {step.time}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                                                    {step.task}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* Right Panel: Chat - Sticky & Minimalist */}
            <div className="w-full lg:w-[440px] lg:sticky lg:top-8 lg:self-start flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-lg overflow-hidden lg:max-h-[calc(99vh-4rem)]">
                {/* Chat Header - Simplified */}
                <div className="px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Asistente de Profundización
                            </h3>
                            <p className="text-xs text-slate-500">
                                Pregunta lo que necesites
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages - Clean & Readable */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 transparent",
                    }}
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
                                <div className="w-7 h-7 mt-0.5 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 flex items-center justify-center">
                                    <BrandAtom className="w-full h-full text-white" />
                                </div>
                            )}
                            <div
                                className={clsx(
                                    "max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-slate-900 text-white rounded-br-sm shadow-sm"
                                        : "bg-white text-slate-700 rounded-bl-sm border border-slate-100 shadow-sm",
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Suggested Questions - Minimal Pills */}
                    {messages.length === 1 &&
                        suggested_questions.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-start pl-10 pt-2">
                                {suggested_questions.map(
                                    (q: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(q)}
                                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium rounded-lg transition-all"
                                        >
                                            {q}
                                        </button>
                                    ),
                                )}
                            </div>
                        )}

                    {/* Typing Indicator - Subtle */}
                    {isTyping && (
                        <div className="flex justify-start w-full gap-3 pl-10">
                            <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div
                                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.15s" }}
                                ></div>
                                <div
                                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.3s" }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input - Clean & Focused */}
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
                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
