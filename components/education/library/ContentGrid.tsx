"use client";

import {
    Play,
    FileText,
    CheckCircle2,
    Clock,
    Loader2,
    Type,
    Image as ImageIcon,
    Trash2,
} from "lucide-react";
import { EducationContent } from "@/types/education";
import Image from "next/image";

const MOCK_DATA: EducationContent[] = [
    {
        id: "sample-1",
        title: "Ejemplo: Guía de Optimización Estratégica",
        type: "document",
        source_type: "document",
        status: "ready",
        createdAt: new Date().toISOString(),
        summary:
            "Este es un ejemplo de cómo se visualizan tus recursos una vez procesados por la inteligencia de NSG.",
    },
];

interface ContentGridProps {
    onSelect?: (item: EducationContent) => void;
    onDelete?: (id: string) => void;
    extraItems?: EducationContent[];
}

export default function ContentGrid({
    onSelect,
    onDelete,
    extraItems = [],
}: ContentGridProps) {
    const allItems = [...extraItems, ...MOCK_DATA];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
            {allItems.map((item) => (
                <ContentCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelect?.(item)}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

const getThumbnailUrl = (url?: string) => {
    if (!url) return null;

    // Si es una URL de YouTube corta (youtu.be)
    if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
        if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }

    // Si es una URL de YouTube estándar
    if (url.includes("youtube.com/watch")) {
        try {
            const urlParams = new URLSearchParams(new URL(url).search);
            const id = urlParams.get("v");
            if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        } catch {
            return null;
        }
    }

    return url;
};

const formatDate = (dateStr: string) => {
    try {
        if (!dateStr) return "Fecha no disponible";
        // Si ya es un formato legible (como el mock antiguo)
        if (dateStr.includes("Hace")) return dateStr;

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Reciente";

        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);
    } catch {
        return "Pendiente";
    }
};

function ContentCard({
    item,
    onClick,
    onDelete,
}: {
    item: EducationContent;
    onClick?: () => void;
    onDelete?: (id: string) => void;
}) {
    const thumbnailUrl = getThumbnailUrl(item.thumbnailUrl);
    const sourceType = (item.source_type || item.type) as string;

    const getSourceConfig = (type: string) => {
        const normalizedType = type.toLowerCase();

        if (normalizedType.includes("text")) {
            return {
                icon: Type,
                color: "text-purple-500",
                bg: "bg-purple-50",
            };
        }
        if (normalizedType.includes("doc") || normalizedType.includes("pdf")) {
            return {
                icon: FileText,
                color: "text-blue-500",
                bg: "bg-blue-50",
            };
        }
        if (normalizedType.includes("imag")) {
            return {
                icon: ImageIcon,
                color: "text-emerald-500",
                bg: "bg-emerald-50",
            };
        }
        if (
            normalizedType.includes("video") ||
            normalizedType.includes("youtube")
        ) {
            return {
                icon: Play,
                color: "text-red-500",
                bg: "bg-red-50",
            };
        }

        // Fallback genérico sin icono de video si no es video
        return {
            icon: FileText,
            color: "text-slate-400",
            bg: "bg-slate-50",
        };
    };

    const config = getSourceConfig(sourceType);
    const Icon = config.icon;

    return (
        <div className="group bg-white rounded-3xl border border-slate-100 p-3 hover:border-blue-200 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
            {/* Thumbnail Area */}
            <div
                onClick={onClick}
                className={`aspect-video rounded-2xl relative overflow-hidden mb-4 ${thumbnailUrl ? "bg-slate-100" : config.bg}`}
            >
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={item.title}
                        width={800}
                        height={450}
                        unoptimized={thumbnailUrl.includes("ytimg.com")}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <Icon
                            className={`w-12 h-12 ${config.color} opacity-40 group-hover:scale-110 transition-transform duration-500`}
                        />
                        <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${config.color} opacity-50`}
                        >
                            {sourceType}
                        </span>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <StatusBadge status={item.status} />
                </div>

                {/* Type Icon overlay */}
                <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-navy-900 shadow-sm border border-slate-100">
                    <Icon className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Info */}
            <div className="px-2 pb-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                        onClick={onClick}
                        className="font-bold text-navy-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors flex-1"
                    >
                        {item.title}
                    </h3>

                    {onDelete && item.id !== "sample-1" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar recurso"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>{formatDate(item.createdAt)}</span>

                    {item.status === "ready" && (
                        <button className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-bold border border-blue-100/50">
                            Crear Plan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === "processing") {
        return (
            <div className="bg-blue-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Loader2 className="w-3 h-3 animate-spin" />
                Procesando
            </div>
        );
    }
    if (status === "ready") {
        return (
            <div className="bg-emerald-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-3 h-3" />
                Listo
            </div>
        );
    }
    return (
        <div className="bg-amber-400/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
            <Clock className="w-3 h-3" />
            Pendiente
        </div>
    );
}
