"use client";

import { Target, TrendingUp, Award, Calendar } from "lucide-react";
import clsx from "clsx";
import { useMemo } from "react";
import { SkeletonStatCard } from "@/components/ui/Skeleton";

interface MetricsData {
    totalCompletions: number;
    byProtocol: {
        morning_clarity: number;
        power_check: number;
        next_day_planning: number;
    };
    completionRate: number;
    activeDays: number;
    perfectDays: number;
    period: "week" | "month";
}

interface MetricsPanelProps {
    metrics: MetricsData;
    isLoading?: boolean;
}

export default function MetricsPanel({
    metrics,
    isLoading = false,
}: MetricsPanelProps) {
    const totalDays = metrics.period === "week" ? 7 : 30;

    const productivityScore = useMemo(() => {
        // Calculate productivity score (0-100)
        const completionWeight = (metrics.completionRate / 100) * 40; // 40% weight
        const perfectDaysWeight = (metrics.perfectDays / totalDays) * 100 * 30; // 30% weight
        const totalCompletionsWeight =
            Math.min((metrics.totalCompletions / (totalDays * 3)) * 100, 100) *
            30; // 30% weight

        return Math.round(
            completionWeight + perfectDaysWeight + totalCompletionsWeight,
        );
    }, [metrics, totalDays]);

    const getScoreColor = (score: number) => {
        if (score >= 80)
            return {
                bg: "bg-blue-600/10",
                text: "text-blue-400",
                border: "border-blue-500/20",
                ring: "ring-blue-500",
            };
        if (score >= 60)
            return {
                bg: "bg-blue-600/10",
                text: "text-blue-400",
                border: "border-blue-500/20",
                ring: "ring-blue-500",
            };
        if (score >= 40)
            return {
                bg: "bg-orange-500/10",
                text: "text-orange-400",
                border: "border-orange-500/20",
                ring: "ring-orange-500",
            };
        return {
            bg: "bg-white/5",
            text: "text-slate-300",
            border: "border-white/10",
            ring: "ring-slate-500",
        };
    };

    const scoreColors = getScoreColor(productivityScore);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonStatCard key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Productivity Score */}
            <div
                className={clsx(
                    "p-8 rounded-[2rem] border backdrop-blur-3xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500",
                    scoreColors.bg,
                    scoreColors.border,
                )}
            >
                <div
                    className={clsx(
                        "absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700",
                        scoreColors.text,
                    )}
                    style={{ background: `currentColor` }}
                ></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div
                            className={clsx(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                scoreColors.bg,
                                scoreColors.text,
                            )}
                        >
                            <Target className="w-5 h-5" />
                        </div>
                        <div
                            className={clsx(
                                "px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                                scoreColors.bg,
                                scoreColors.text,
                            )}
                        >
                            Score
                        </div>
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Tu Nivel de Enfoque
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span
                            className={clsx(
                                "font-display font-black text-5xl text-bright-white",
                                scoreColors.text,
                            )}
                        >
                            {productivityScore}
                        </span>
                        <span className="text-base font-bold text-slate-400">
                            /100
                        </span>
                    </div>

                    {/* Progress Ring */}
                    <div className="mt-4">
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/5">
                            <div
                                className={clsx(
                                    "h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
                                    scoreColors.text.replace("text-", "bg-"),
                                )}
                                style={{ width: `${productivityScore}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-navy-900/60 p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group backdrop-blur-3xl">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-blue-400">
                            Rate
                        </div>
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Efectividad Semanal
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="font-display font-black text-5xl text-bright-white">
                            {metrics.completionRate.toFixed(0)}
                        </span>
                        <span className="text-2xl font-black text-blue-400">
                            %
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 font-medium">
                        {metrics.activeDays} de {totalDays} días activos
                    </p>
                </div>
            </div>

            {/* Perfect Days */}
            <div className="bg-navy-900/60 p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group backdrop-blur-3xl">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                            <Award className="w-5 h-5" />
                        </div>
                        <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-blue-400">
                            Perfect
                        </div>
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Días al 100%
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="font-display font-black text-5xl text-bright-white">
                            {metrics.perfectDays}
                        </span>
                        <span className="text-base font-bold text-slate-400">
                            días
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 font-medium">
                        Los 3 protocolos completados
                    </p>
                </div>
            </div>

            {/* By Protocol */}
            <div className="bg-navy-900/60 p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group backdrop-blur-3xl">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-blue-400">
                            Total
                        </div>
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Total de Logros
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Morning
                                </span>
                            </div>
                            <span className="font-black text-xl text-white text-bright-white">
                                {metrics.byProtocol.morning_clarity}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Power
                                </span>
                            </div>
                            <span className="font-black text-xl text-white text-bright-white">
                                {metrics.byProtocol.power_check}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Next Day
                                </span>
                            </div>
                            <span className="font-black text-xl text-white text-bright-white">
                                {metrics.byProtocol.next_day_planning}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
