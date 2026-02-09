"use client";

import { EducationContent } from "@/types/education";
import { ArrowLeft, Sparkles, MessageSquare } from "lucide-react";
import ContentChat from "./ContentChat";

interface ContentDetailProps {
    item: EducationContent;
    onBack: () => void;
}

export default function ContentDetail({ item, onBack }: ContentDetailProps) {
    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-navy-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="font-bold text-navy-900 leading-none">
                                {item.title}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-blue-500" />
                                Agente de Inteligencia Estratégica
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-hidden">
                <ContentChat item={item} onBack={onBack} />
            </main>
        </div>
    );
}
