"use client";

import { useState, useEffect } from "react";
import { Newspaper, Zap, Search, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import api from "@/lib/api";
import clsx from "clsx";
import ComingSoon from "@/components/ComingSoon";
import { NewsCard } from "@/components/ui/NewsCard";
import { useUIStore } from "@/store/useUIStore";
import { Banner } from "@/components/ui/Banner";

interface NewsItem {
    _id: string;
    title: string;
    content: string;
    date: string;
    link?: string;
    categories: string[];
    tag: string;
    source: string;
    color: string;
    analysis?: string;
    createdAt: string;
}

export default function INews() {
    const { currentRole } = useAppStore();
    const { openAI, setAIMode } = useUIStore();
    const [activeTab, setActiveTab] = useState<"market" | "archive">("market");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const endpoint =
                    activeTab === "archive"
                        ? "/news/search?type=analyzed"
                        : "/news/search";
                const response = await api.get(endpoint);
                setNews(response.data);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [activeTab]);

    const handleAnalyze = async (id: string) => {
        setAnalyzingId(id);
        try {
            // Trigger backend process
            await api.post(`/news/analyze/${id}`);

            // Open AI Modal in research mode to show the analysis "progress" in UI
            setAIMode("research");
            openAI();
        } catch (error) {
            console.error("Error analyzing news:", error);
        } finally {
            setAnalyzingId(null);
        }
    };

    const hasAccess = [
        "admin",
        "psychologist",
        "consultant",
        "manager",
    ].includes(currentRole || "");

    if (!hasAccess && currentRole !== "patient") {
        return (
            <ComingSoon
                title="I News"
                subtitle="Sistema de Inteligencia de Noticias Globales en desarrollo"
                estimatedDate="Q2 2026"
            />
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scroll safe-bottom-scroll scroll-smooth w-full animate-fade-in-up flex flex-col items-center bg-navy-950 text-white selection:bg-blue-600/40">
            <div className="w-full px-2 xs:px-4 lg:px-12 py-8 max-w-[1700px]">
                {/* 1. HERO BANNER - Dashboard Optimized Style */}
                <Banner
                    badge="Hyper-Intelligence Feed"
                    title="I Hyper-News"
                    description="Inteligencia de mercado curada algorítmicamente para acelerar tus objetivos estratégicos."
                />

                {/* Sub-header Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.03] backdrop-blur-md px-6 py-4 rounded-3xl border border-white/5 shadow-2xl mt-12">
                    <div className="flex items-center gap-3">
                        <div className="flex bg-navy-900/50 p-1 rounded-2xl border border-white/5">
                            {["market", "archive"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t as any)}
                                    className={clsx(
                                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeTab === t
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-slate-500 hover:text-slate-300",
                                    )}
                                >
                                    {t === "market" ? "Neural Feed" : "Archivo Táctico"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-navy-900/50 border border-white/5 px-5 py-2.5 rounded-2xl w-full md:w-80 group focus-within:border-blue-500/50 transition-all">
                        <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400" />
                        <input
                            placeholder="Buscar inteligencia..."
                            className="bg-transparent text-xs font-bold outline-none w-full text-white placeholder:text-slate-700"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-full">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-white/5 border-t-blue-600 rounded-full animate-spin"></div>
                                <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
                                Decodificando Frecuencias Globales...
                            </p>
                        </div>
                    ) : news.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.map((item) => (
                                <NewsCard
                                    key={item._id}
                                    source={item.source || "NSG"}
                                    title={item.title}
                                    tag={item.tag || item.categories[0] || "Global"}
                                    color={item.color || "emerald"}
                                    description={item.content}
                                    time={new Date(item.createdAt).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "short",
                                    })}
                                    isAnalyzed={!!item.analysis}
                                    onAnalyze={() => handleAnalyze(item._id)}
                                    isAnalyzing={analyzingId === item._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-navy-900/40 rounded-[3rem] p-24 border-2 border-dashed border-white/5 flex flex-col items-center text-center max-w-3xl mx-auto backdrop-blur-3xl">
                            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20">
                                <Newspaper className="w-10 h-10 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-black text-bright-white mb-2 font-display uppercase tracking-tight">
                                Feed Silencioso
                            </h3>
                            <p className="text-slate-400 max-w-sm font-medium">
                                No se han detectado nuevas señales en este canal.
                                Vuelve pronto para nuevos insights estratégicos.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
