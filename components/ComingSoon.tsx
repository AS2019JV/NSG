"use client";

import { Rocket, Calendar, Lightbulb } from "lucide-react";

interface ComingSoonProps {
    title: string;
    subtitle?: string;
    estimatedDate?: string;
}

/**
 * Coming Soon Component
 * Shows a professional "coming soon" message for features in development
 */
export default function ComingSoon({
    title,
    subtitle = "Estamos trabajando en esta funcionalidad",
    estimatedDate,
}: ComingSoonProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-2 animate-fade-in-up">
            <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Rocket className="w-10 h-10 text-blue-600" />
                </div>

                <h2 className="text-3xl font-bold text-navy-900 mb-2">
                    {title}
                </h2>

                <p className="text-slate-600 mb-6">{subtitle}</p>

                <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
                    <p className="text-sm text-slate-700 font-medium mb-3">
                        Esta función estará disponible próximamente
                    </p>

                    {estimatedDate && (
                        <div className="flex items-center justify-center gap-2 text-blue-700">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold">
                                Estimado: {estimatedDate}
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-slate-700" />
                        <span className="font-semibold text-slate-700">
                            Mantente atento:
                        </span>{" "}
                        Estamos construyendo algo increíble para ti
                    </p>
                </div>
            </div>
        </div>
    );
}
