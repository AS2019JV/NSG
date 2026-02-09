"use client";

import { EducationContent, Message } from "@/types/education";
import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { educationService } from "@/lib/education";
import { useAppStore } from "@/store/useAppStore";
import clsx from "clsx";

interface ContentChatProps {
    item: EducationContent;
    onBack: () => void;
}

export default function ContentChat({ item }: ContentChatProps) {
    const { strategyPreferences } = useAppStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "system",
            content: `Hola. He procesado tu recurso "${item.title}". ¿En qué puedo ayudarte hoy con esta información?`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const triggerQuestions = async () => {
            const fullData = item.fullData as any;
            const isCompleted = fullData?.question_process?.completed;

            if (isCompleted === false) {
                try {
                    console.log(
                        "[ContentChat] Disparando webhook de preguntas...",
                    );
                    await fetch(
                        "https://personal-n8n.suwsiw.easypanel.host/webhook/questions",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                action: "start_questions",
                                contentId: item.id,
                                telegramId: fullData?.telegram_id,
                            }),
                        },
                    );
                } catch (error) {
                    console.error("Error triggering n8n questions:", error);
                }
            }
        };

        triggerQuestions();
    }, [item]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await educationService.contentChat(
                item.id,
                input,
                messages,
                strategyPreferences,
            );
            setMessages((prev) => [...prev, response]);
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex gap-4 max-w-3xl",
                            msg.role === "user"
                                ? "ml-auto flex-row-reverse"
                                : "mr-auto",
                        )}
                    >
                        <div
                            className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === "user"
                                    ? "bg-navy-900 text-white"
                                    : "bg-blue-100 text-blue-600",
                            )}
                        >
                            {msg.role === "user" ? (
                                <User className="w-4 h-4" />
                            ) : (
                                <Bot className="w-4 h-4" />
                            )}
                        </div>
                        <div
                            className={clsx(
                                "p-4 rounded-2xl text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-200"
                                    : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100",
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4 mr-auto">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-slate-100 bg-white">
                <div className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Escribe tu pregunta estratégica..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-navy-900 text-white rounded-xl hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
