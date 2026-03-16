"use client";

import React, { useMemo, useState } from "react";
import {
    Bell,
    Bot,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Filter,
    LayoutGrid,
    MessageSquare,
    Phone,
    Search,
    Sparkles,
    TrendingUp,
    User,
    Users,
    XCircle,
    BarChart2,
    Target,
    X,
    Atom,
    ArrowRight,
    Monitor,
    MoreHorizontal,
    ArrowUpRight,
    FileText,
    Mic,
    Activity
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

/**
 * BS Intelligence CRM — Sovereign OS Edition
 * -------------------------------------------------------------
 * Ultra-Premium Interface for high-performance sales orchestration.
 */

interface Lead {
    id: number;
    name: string;
    pipeline: "advisor" | "ai";
    stage: string;
    advisor: string;
    source: string;
    city: string;
    interest: string;
    budget: string;
    propertyType: "departamento" | "lote" | "casa" | "comercial";
    score: number;
    priority: "alta" | "media" | "baja";
    nextAction: string;
    lastTouch: string;
    tags: string[];
    notes: string;
    timeline: { date: string; event: string; type: "ia" | "humano" | "sistema" }[];
    retell?: {
        summary: string;
        painPoints: string[];
        objections: string[];
        transcriptionSnippet: string;
        duration: string;
        sentiment: number; // 0 to 100
        strategicKey: string;
        callLatencies?: string;
        trustScore?: number; // 0 to 100
        interestSignal?: "high" | "medium" | "low";
    };
}

interface Notification {
    id: number;
    type: string;
    title: string;
    detail: string;
    time: string;
}

const CRM_CONFIG = {
    brand: {
        name: "Intelligence",
        accent: "CRM",
        subtitle: "Sistema de Orquestación Comercial Prospectiva",
    },
    pipelines: {
        advisor: {
            label: "Asesores Elite",
            icon: Users,
            stages: [
                { id: "nuevo", name: "Captación" },
                { id: "prioridad", name: "Prioridad" },
                { id: "contacto", name: "Contacto" },
                { id: "perfilamiento", name: "Calificación" },
                { id: "conversion", name: "Conversión" },
                { id: "seguimiento", name: "Nutrición" },
                { id: "cierre", name: "Cierre" },
            ],
        },
        ai: {
            label: "Agentes IA",
            icon: Bot,
            stages: [
                { id: "inbound", name: "Respuesta 0-5m" },
                { id: "analisis", name: "Análisis IA" },
                { id: "demo", name: "Demo Virtual" },
                { id: "negociacion", name: "Cierre IA" },
                { id: "exito", name: "Éxito" },
                { id: "retencion", name: "Retención" },
            ],
        },
    },
};

const initialLeads: Lead[] = [
    {
        id: 1,
        name: "Carlos Méndez",
        pipeline: "advisor",
        stage: "prioridad",
        advisor: "Estefanía",
        source: "Meta Ads",
        city: "Playa del Carmen",
        interest: "Condo Luxury Tulum",
        budget: "$450,000 USD",
        propertyType: "departamento",
        score: 94,
        priority: "alta",
        nextAction: "Validar Financiamiento",
        lastTouch: "12m",
        tags: ["inversionista", "usa"],
        notes: "Busca ROI alto mayor al 12%. Interesado en rentas vacacionales.",
        retell: {
            summary: "Perfil de inversor experimentado. Prioriza seguridad jurídica.",
            painPoints: ["Opacidad legal", "Tiempos de entrega"],
            objections: ["Distancia al centro"],
            transcriptionSnippet: "IA: '¿Qué busca?' Cliente: 'Seguridad sobre todo.'",
            duration: "05:12",
            sentiment: 82,
            strategicKey: "Seguridad Jurídica Blindada",
            callLatencies: "Avg: 820ms",
            trustScore: 89,
            interestSignal: "high"
        },
        timeline: [
            { date: "16:45", event: "Registro Sistema", type: "sistema" },
            { date: "16:47", event: "Análisis IA: Score 94", type: "ia" }
        ]
    },
    {
        id: 2,
        name: "Andrea Salas",
        pipeline: "advisor",
        stage: "contacto",
        advisor: "Alex",
        source: "LinkedIn",
        city: "CDMX",
        interest: "Lote Premium Selva",
        budget: "$120,000 USD",
        propertyType: "lote",
        score: 76,
        priority: "media",
        nextAction: "Enviar Brochure Técnico",
        lastTouch: "1h",
        tags: ["sustentable", "zoom"],
        notes: "Interesada en sustentabilidad y paneles solares.",
        timeline: [{ date: "Ayer", event: "Mensaje LinkedIn DM", type: "humano" }]
    },
    {
        id: 3,
        name: "Roberto Núñez",
        pipeline: "advisor",
        stage: "nuevo",
        advisor: "Estefanía",
        source: "Web Direct",
        city: "Querétaro",
        interest: "Tulum Beach Front",
        budget: "$980,000 USD",
        propertyType: "departamento",
        score: 91,
        priority: "alta",
        nextAction: "Confirmar Interés",
        lastTouch: "5m",
        tags: ["vip", "contado"],
        notes: "Interés en Penthouse con vista al mar.",
        timeline: [{ date: "18:00", event: "Entrada Web", type: "sistema" }]
    },
    {
        id: 4,
        name: "Mariana Torres",
        pipeline: "ai",
        stage: "inbound",
        advisor: "IA Setter 01",
        source: "WhatsApp",
        city: "Guadalajara",
        interest: "Residencial Riviera",
        budget: "$650,000 USD",
        propertyType: "casa",
        score: 95,
        priority: "alta",
        nextAction: "Traspaso Inmediato",
        lastTouch: "4m",
        tags: ["ia-calificado", "vip"],
        notes: "Capital listo, busca casa de retiro.",
        retell: {
            summary: "Busca retiro tranquilo cerca de la naturaleza. Presupuesto flexible.",
            painPoints: ["Ruido urbano", "Seguridad"],
            objections: ["Costo de mantenimiento"],
            transcriptionSnippet: "Cliente: 'Quiero escuchar los pájaros, no los autos.'",
            duration: "08:20",
            sentiment: 95,
            strategicKey: "Paz Acústica Certificada",
            callLatencies: "Avg: 780ms"
        },
        timeline: [{ date: "17:10", event: "WA Contact", type: "ia" }]
    },
    {
        id: 5,
        name: "Julian Fox",
        pipeline: "ai",
        stage: "demo",
        advisor: "IA Setter 01",
        source: "Instagram",
        city: "Miami",
        interest: "Eco-Lodge Tulum",
        budget: "$320,000 USD",
        propertyType: "lote",
        score: 88,
        priority: "media",
        nextAction: "Perfilamiento AI",
        lastTouch: "15m",
        tags: ["ecofriendly"],
        notes: "Preguntando por permisos de construcción.",
        timeline: [{ date: "17:30", event: "IG Direct", type: "ia" }]
    },
    {
        id: 6,
        name: "Elena Rivas",
        pipeline: "advisor",
        stage: "perfilamiento",
        advisor: "Alex",
        source: "Referido",
        city: "Monterrey",
        interest: "Office Hub Cancún",
        budget: "$2.5M USD",
        propertyType: "comercial",
        score: 98,
        priority: "alta",
        nextAction: "Presentación Comité",
        lastTouch: "2h",
        tags: ["corporativo", "expansión"],
        notes: "Inversión institucional para cowork.",
        timeline: [{ date: "14:00", event: "Referido Directo", type: "humano" }]
    },
    {
        id: 7,
        name: "Sergio Luna",
        pipeline: "ai",
        stage: "negociacion",
        advisor: "IA Setter 02",
        source: "Landing",
        city: "Barcelona",
        interest: "Playamar Penthouse",
        budget: "$740,000 USD",
        propertyType: "departamento",
        score: 82,
        priority: "media",
        nextAction: "Tour Virtual Interactiva",
        lastTouch: "45m",
        tags: ["internacional"],
        notes: "Solicitó planos técnicos en PDF.",
        timeline: [{ date: "16:15", event: "Landing Form", type: "sistema" }]
    },
    {
        id: 8,
        name: "Sofia Vega",
        pipeline: "advisor",
        stage: "seguimiento",
        advisor: "Estefanía",
        source: "TikTok",
        city: "Puebla",
        interest: "Smart Studio Tulum",
        budget: "$195,000 USD",
        propertyType: "departamento",
        score: 72,
        priority: "baja",
        nextAction: "Drip Marketing",
        lastTouch: "1d",
        tags: ["millennial", "inversionista-joven"],
        notes: "Primera inversión inmobiliaria.",
        timeline: [{ date: "Lunes", event: "TikTok Form", type: "sistema" }]
    },
    {
        id: 9,
        name: "Marco Rossi",
        pipeline: "ai",
        stage: "analisis",
        advisor: "IA Setter 02",
        source: "Google Search",
        city: "Milán",
        interest: "Villa Paraíso",
        budget: "$1.2M USD",
        propertyType: "casa",
        score: 96,
        priority: "alta",
        nextAction: "Cierre AI en Proceso",
        lastTouch: "10m",
        tags: ["cierre-ia", "urgente"],
        notes: "Negociando condiciones de pago fraccionado.",
        timeline: [{ date: "16:00", event: "Chat IA Activo", type: "ia" }]
    },
    {
        id: 10,
        name: "Laura Ortiz",
        pipeline: "advisor",
        stage: "cierre",
        advisor: "Alex",
        source: "Web Direct",
        city: "Tijuana",
        interest: "Terreno Industrial",
        budget: "$3.8M USD",
        propertyType: "comercial",
        score: 99,
        priority: "alta",
        nextAction: "Firma de Contrato",
        lastTouch: "1h",
        tags: ["finalizado", "vip"],
        notes: "Todo listo para escrituración.",
        timeline: [{ date: "09:00", event: "Revisión Legal OK", type: "sistema" }]
    },
    {
        id: 11,
        name: "Daniela Ruiz",
        pipeline: "ai",
        stage: "exito",
        advisor: "IA Setter 01",
        source: "WhatsApp",
        city: "Vallarta",
        interest: "Condo Marina",
        budget: "$550,000 USD",
        propertyType: "departamento",
        score: 92,
        priority: "media",
        nextAction: "Proceso Post-Venta",
        lastTouch: "2d",
        tags: ["cerrado-ia"],
        notes: "Cliente muy satisfecho con el proceso autónomo.",
        timeline: [{ date: "Ayer", event: "Pago Confirmado", type: "sistema" }]
    },
    {
        id: 12,
        name: "Hugo Boss",
        pipeline: "advisor",
        stage: "conversion",
        advisor: "Estefanía",
        source: "LinkedIn",
        city: "Nueva York",
        interest: "Penthouse Horizon",
        budget: "$1.8M USD",
        propertyType: "departamento",
        score: 89,
        priority: "alta",
        nextAction: "Mandar Contrato",
        lastTouch: "3h",
        tags: ["internacional", "vip"],
        notes: "Comprador de alto perfil.",
        timeline: [{ date: "Hoy", event: "Oferta Aceptada", type: "humano" }]
    },
    {
        id: 13,
        name: "Karla Soule",
        pipeline: "advisor",
        stage: "contacto",
        advisor: "IA Setter 02",
        source: "Ads",
        city: "Miami",
        interest: "Lote Selva 2",
        budget: "$85,000 USD",
        propertyType: "lote",
        score: 65,
        priority: "baja",
        nextAction: "Nutrición IA",
        lastTouch: "5m",
        tags: ["nuevo"],
        notes: "Buscando primera inversión.",
        timeline: [{ date: "Ahora", event: "Registro", type: "sistema" }]
    },
    {
        id: 14,
        name: "Fernando Gil",
        pipeline: "advisor",
        stage: "prioridad",
        advisor: "Alex",
        source: "Web",
        city: "Madrid",
        interest: "Villa Luxe",
        budget: "$2.1M USD",
        propertyType: "casa",
        score: 87,
        priority: "alta",
        nextAction: "Llamada de Calidad",
        lastTouch: "4h",
        tags: ["europeo"],
        notes: "Viene a México en 2 semanas.",
        timeline: [{ date: "Hoy", event: "Agendó Cita", type: "humano" }]
    },
    {
        id: 15,
        name: "Beatrice Valli",
        pipeline: "ai",
        stage: "retencion",
        advisor: "IA Setter 01",
        source: "Existing",
        city: "Roma",
        interest: "Residencial 3",
        budget: "$400,000 USD",
        propertyType: "casa",
        score: 94,
        priority: "media",
        nextAction: "Cross-sell AI",
        lastTouch: "12h",
        tags: ["cliente-fiel"],
        notes: "Ya compró antes, busca segunda unidad.",
        timeline: [{ date: "Ayer", event: "Interés detectado", type: "ia" }]
    },
    {
        id: 16,
        name: "Lando Norris",
        pipeline: "advisor",
        stage: "perfilamiento",
        advisor: "Alex",
        source: "Google",
        city: "Londres",
        interest: "Tulum Mansion",
        budget: "$5.2M USD",
        propertyType: "casa",
        score: 93,
        priority: "alta",
        nextAction: "Cierre Presencial",
        lastTouch: "20m",
        tags: ["f1", "vip"],
        notes: "Requiere total privacidad y helipuerto.",
        timeline: [{ date: "16:00", event: "Llamada Alex", type: "humano" }]
    },
    {
        id: 17,
        name: "Marta Sánchez",
        pipeline: "ai",
        stage: "demo",
        advisor: "IA Setter 02",
        source: "Meta",
        city: "Madrid",
        interest: "Estudio Playa",
        budget: "$150,000 USD",
        propertyType: "departamento",
        score: 79,
        priority: "media",
        nextAction: "Seguimiento Demo",
        lastTouch: "1h",
        tags: ["inversionista"],
        notes: "Vio el video 3D completo.",
        timeline: [{ date: "17:00", event: "Video View", type: "ia" }]
    },
    {
        id: 18,
        name: "John Wick",
        pipeline: "advisor",
        stage: "seguimiento",
        advisor: "Estefanía",
        source: "Referido",
        city: "NY",
        interest: "Continental Suite",
        budget: "$1.4M USD",
        propertyType: "comercial",
        score: 97,
        priority: "alta",
        nextAction: "Firmar NDA",
        lastTouch: "30m",
        tags: ["seguridad", "vip"],
        notes: "Interesado en propiedades con bóveda.",
        timeline: [{ date: "Hoy", event: "Recomendado por Alex", type: "humano" }]
    },
    {
        id: 19,
        name: "Claire Bennett",
        pipeline: "ai",
        stage: "exito",
        advisor: "IA Setter 01",
        source: "Web",
        city: "Texas",
        interest: "Lote Selva 3",
        budget: "$95,000 USD",
        propertyType: "lote",
        score: 100,
        priority: "alta",
        nextAction: "Referido",
        lastTouch: "3d",
        tags: ["cerrado"],
        notes: "Firma digital completada en 48h.",
        timeline: [{ date: "Lunes", event: "Firma Digital", type: "sistema" }]
    },
    {
        id: 20,
        name: "Oscar Piastri",
        pipeline: "advisor",
        stage: "cierre",
        advisor: "Alex",
        source: "LinkedIn",
        city: "Melbourne",
        interest: "Penthouse Turbo",
        budget: "$2.2M USD",
        propertyType: "departamento",
        score: 85,
        priority: "media",
        nextAction: "Enviar Contrato V2",
        lastTouch: "2h",
        tags: ["f1-joven"],
        notes: "Muy interesado en la domótica avanzada.",
        timeline: [{ date: "Hoy", event: "Mensaje LinkedIn", type: "humano" }]
    },
    {
        id: 21,
        name: "Lewis Hamilton",
        pipeline: "ai",
        stage: "inbound",
        advisor: "IA Setter 01",
        source: "IG Ads",
        city: "Londres",
        interest: "Estate Monaco",
        budget: "$12.5M USD",
        propertyType: "casa",
        score: 98,
        priority: "alta",
        nextAction: "VIP Transfer",
        lastTouch: "1m",
        tags: ["sir", "vip"],
        notes: "Busca inversión segura en preventa.",
        timeline: [{ date: "Ahora", event: "WA Inbound", type: "ia" }]
    },
    {
        id: 22,
        name: "Max Verstappen",
        pipeline: "ai",
        stage: "analisis",
        advisor: "IA Setter 02",
        source: "Direct",
        city: "Mónaco",
        interest: "Penthouse Red",
        budget: "$8.2M USD",
        propertyType: "departamento",
        score: 95,
        priority: "alta",
        nextAction: "Validación Perfil",
        lastTouch: "10m",
        tags: ["campeon", "contado"],
        notes: "Listo para transferir hoy.",
        timeline: [{ date: "17:00", event: "Análisis Completo", type: "ia" }]
    },
    {
        id: 23,
        name: "Checo Pérez",
        pipeline: "ai",
        stage: "negociacion",
        advisor: "IA Setter 01",
        source: "TikTok",
        city: "Guadalajara",
        interest: "Villa México",
        budget: "$3.5M USD",
        propertyType: "casa",
        score: 92,
        priority: "alta",
        nextAction: "Cierre Digital",
        lastTouch: "30m",
        tags: ["ministry", "mex"],
        notes: "Interesado en financiamiento interno.",
        timeline: [{ date: "Hoy", event: "Oferta IA", type: "ia" }]
    },
    {
        id: 24,
        name: "Fernando Alonso",
        pipeline: "ai",
        stage: "retencion",
        advisor: "IA Setter 02",
        source: "Web",
        city: "Oviedo",
        interest: "Lote Nano",
        budget: "$900,000 USD",
        propertyType: "lote",
        score: 88,
        priority: "media",
        nextAction: "Upsell",
        lastTouch: "1h",
        tags: ["legend", "vip"],
        notes: "Buscando expansión de terreno colindante.",
        timeline: [{ date: "Ayer", event: "Re-engagement", type: "ia" }]
    }
];

const initialNotifications: Notification[] = [
    { id: 1, type: "urgente", title: "Traspaso IA Requerido", detail: "Mariana Torres lista para transferencia.", time: "Hace 2m" },
    { id: 2, type: "recordatorio", title: "Cierre de Meta", detail: "Faltan 2 leads para el objetivo semanal.", time: "Hace 15m" },
];

function StatCard({ icon: Icon, label, value, trend, color = "emerald", highlighted = false }: { icon: React.ElementType; label: string; value: string | number; trend?: string, color?: "emerald" | "navy" | "light", highlighted?: boolean }) {
    const isNavy = color === "navy";
    const isLight = color === "light";

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={clsx(
                "relative flex flex-col justify-between overflow-hidden rounded-[2rem] border bg-navy-900/40 p-6 shadow-2xl backdrop-blur-3xl group transition-all duration-500",
                highlighted ? "border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.2)]" : "border-white/5 hover:border-white/10"
            )}
        >
            <div className="flex items-start justify-between">
                <div className={clsx("rounded-xl border p-2.5 transition-all duration-500 group-hover:scale-110 relative",
                    isNavy ? "border-blue-900/40 bg-blue-900/20 text-blue-400" :
                        isLight ? "border-blue-400/20 bg-blue-400/10 text-blue-400" :
                            "border-blue-500/20 bg-blue-500/10 text-blue-400")}
                >
                    <Icon className="h-4 w-4" />
                    {highlighted && <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_#00ff88] animate-pulse" style={{ backgroundColor: '#00ff88' }} />}
                    {isLight && !highlighted && <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />}
                </div>
                {trend && (
                    <span className={clsx("text-[9px] font-black px-2 py-1 rounded-lg backdrop-blur-md border tracking-widest uppercase",
                        "text-blue-400 bg-blue-400/5 border-blue-400/10")}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-6 text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black font-sans">{label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-4xl font-display font-black text-white tracking-tighter text-bright-white">{value}</p>
                </div>
            </div>
            <div className={clsx("absolute -bottom-4 -right-4 h-24 w-24 blur-3xl rounded-full transition-opacity duration-700 opacity-20 group-hover:opacity-40",
                isNavy ? "bg-blue-900" : isLight ? "bg-blue-500/30" : "bg-blue-600")} />
        </motion.div>
    );
}

function LeadCard({ lead, onClick }: { lead: Lead; onClick: (lead: Lead) => void }) {
    const isHighPotential = lead.score >= 90;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
            className="group flex flex-col rounded-2xl border border-white/5 bg-navy-900/50 p-4 shadow-xl cursor-pointer hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
            onClick={() => onClick(lead)}
        >
            <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-300 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/10">
                            {lead.propertyType}
                        </span>
                        <h4 className="text-sm font-bold text-bright-white group-hover:text-blue-300 transition-colors leading-tight truncate">{lead.name}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1 group-hover:text-slate-300 transition-colors">{lead.interest}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 pt-0.5">
                    {lead.retell && (
                        <div className="flex items-center gap-1.5 bg-blue-400/10 px-2 py-0.5 rounded-lg border border-blue-400/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            <Mic className="h-2.5 w-2.5 text-blue-400 animate-pulse" />
                            <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Call Center AI</span>
                        </div>
                    )}
                    {isHighPotential && <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />}
                    <span className={clsx("h-1.5 w-1.5 rounded-full transition-colors duration-500", lead.priority === "alta" ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.2)]" : "bg-slate-800")} />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Inversión</span>
                    <span className="text-xs font-black text-white group-hover:text-blue-300 transition-colors font-display tracking-tight text-bright-white">{lead.budget}</span>
                </div>
                <div className={clsx("text-[10px] font-black flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-500",
                    isHighPotential ? "text-blue-400 border-blue-400/20 bg-blue-400/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "text-slate-500 border-transparent")}>
                    <Atom className={clsx("h-3 w-3", isHighPotential ? "text-blue-400 animate-pulse" : "text-slate-600")} />
                    <span className="text-bright-white">{lead.score}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function NSGCRM() {
    const [activePipeline, setActivePipeline] = useState<"advisor" | "ai">("advisor");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [search, setSearch] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);

    const pipeline = CRM_CONFIG.pipelines[activePipeline];

    const filteredLeads = useMemo(() => {
        return initialLeads.filter(l =>
            l.pipeline === activePipeline &&
            (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.interest.toLowerCase().includes(search.toLowerCase()))
        );
    }, [activePipeline, search]);

    const avgScore = useMemo(() => {
        if (filteredLeads.length === 0) return 0;
        return Math.round(filteredLeads.reduce((acc, curr) => acc + curr.score, 0) / filteredLeads.length);
    }, [filteredLeads]);

    return (
        <div className="min-h-screen bg-navy-950 text-white font-sans selection:bg-blue-600/40 selection:text-white relative overflow-hidden">
            {/* Background Ambience & Grid */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#020617]">
                {/* Unified subtle grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.015]" />

                {/* Single unified high-performance atmospheric bloom */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#064e3b08,_#020617_80%)]" />

                {/* Integrated light flares */}
                <div className="absolute top-[-20%] left-[-20%] h-[80%] w-[80%] bg-[radial-gradient(circle_at_center,_#10b98108,_transparent_70%)] blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-20%] h-[80%] w-[80%] bg-[radial-gradient(circle_at_center,_#05966905,_transparent_70%)] blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-[1700px] h-screen flex flex-col px-6 py-6 overflow-hidden">

                {/* Command Header */}
                <header className="flex flex-col gap-10 mb-12">
                    {/* Level 1: Brand & Search Row */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-10">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-[2rem] bg-linear-to-br from-blue-700 to-navy-900 flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-linear-to-tr from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <Atom className="h-8 w-8 text-white relative z-10 animate-pulse" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-navy-950 flex items-center justify-center">
                                    <div className="h-3.5 w-3.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-5xl font-display font-black tracking-tighter filter brightness-125 text-bright-white">
                                        {CRM_CONFIG.brand.name}
                                        <span className="italic ml-2 text-white/95">{CRM_CONFIG.brand.accent}</span>
                                    </h1>
                                    <div className="h-8 w-px bg-white/10" />
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-400 shadow-glow animate-pulse" />
                                        <p className="text-white text-[11px] font-black uppercase tracking-[0.4em] font-sans text-bright-white">{pipeline.label}</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-base font-medium mt-2 pl-0.5 tracking-tight">{CRM_CONFIG.brand.subtitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4 rounded-3xl bg-navy-900/50 border border-white/5 px-6 py-3.5 focus-within:border-blue-500/50 transition-all">
                                <Search className="h-4 w-4 text-slate-500" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Filtrar prospectos..."
                                    className="bg-transparent text-xs font-bold outline-none w-48 placeholder:text-slate-700 text-white"
                                />
                            </div>
                            <button onClick={() => setShowNotifications(true)} className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:bg-white/10 group relative">
                                <Bell className="h-4 w-4" />
                                <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-blue-400 rounded-full border border-navy-950 animate-pulse" />
                            </button>
                        </div>
                    </div>

                    {/* Level 2: Wide Pipeline Navigation */}
                    <div className="flex justify-center">
                        <div className="flex p-1.5 rounded-full bg-navy-950/50 border border-white/5 backdrop-blur-3xl shadow-2xl relative w-full max-w-2xl">
                            {Object.entries(CRM_CONFIG.pipelines).map(([key, p]) => (
                                <button
                                    key={key}
                                    onClick={() => setActivePipeline(key as "advisor" | "ai")}
                                    className={clsx(
                                        "flex-1 relative px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 z-10",
                                        activePipeline === key ? "text-white" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    <span className="relative z-10">{p.label}</span>
                                    {activePipeline === key && (
                                        <motion.div
                                            layoutId="active-tab-nav"
                                            className="absolute inset-0 bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-8">
                        <StatCard icon={Users} label="Prospectos Totales" value={filteredLeads.length} trend="+20 unidades" color="navy" />
                        <StatCard icon={Atom} label="Inteligencia Comercial" value={filteredLeads.filter(l => l.priority === "alta").length} trend="Prioridad" color="light" highlighted={true} />
                        <StatCard icon={Target} label="Health Score" value={`${avgScore}%`} trend="Ratio Eficiencia" color="light" />
                        <StatCard icon={TrendingUp} label="Conversión Proyectada" value="32%" trend="vs. Periodo Previo" color="navy" />
                    </div>
                </header>

                {/* Board Environment */}
                <main className="flex-1 min-h-0 mt-4 rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.01]">
                    <div className="h-full w-full overflow-auto custom-scroll p-8">
                        <div className="flex gap-12 min-w-max h-full">

                            {pipeline.stages.map((stage, idx) => {
                                const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
                                return (
                                    <div
                                        key={stage.id}
                                        className="flex flex-col w-[340px] min-w-[340px]"
                                    >
                                        <div className="flex items-center justify-between mb-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "h-2 w-2 rounded-full",
                                                    activePipeline === "ai" ? "bg-blue-400 shadow-[0_0_12px_#34d399]" : "bg-blue-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                )} />
                                                <h3 className="text-[11px] font-black text-bright-white uppercase tracking-[0.3em] flex items-center gap-2">
                                                    {stage.name}
                                                    {activePipeline === "ai" && idx === 0 && (
                                                        <span className="ml-2 px-1.5 py-0.5 bg-blue-600/20 text-blue-400 text-[8px] rounded border border-blue-500/30 animate-pulse uppercase tracking-tighter">Auto-Setter Active</span>
                                                    )}
                                                </h3>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-700">{stageLeads.length}</span>
                                        </div>

                                        <div className="flex-1 space-y-5 overflow-y-auto custom-scroll pr-3">
                                            <AnimatePresence mode="popLayout">
                                                {stageLeads.map(lead => (
                                                    <LeadCard key={lead.id} lead={lead} onClick={setSelectedLead} />
                                                ))}
                                            </AnimatePresence>

                                            {stageLeads.length === 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                                                    className="mt-10 py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem] px-8 text-center"
                                                >
                                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                                        <Monitor className="h-6 w-6 text-slate-600" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Canal en Reposo</p>
                                                    <p className="mt-2 text-[9px] font-medium text-slate-600 leading-relaxed">
                                                        {stage.id === "nuevo" || stage.id === "inbound" ? "Esperando nuevos prospectos de campañas activas." : "Mueve prospectos aquí para avanzar en el embudo."}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>

                <AnimatePresence>
                    {selectedLead && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] bg-navy-950/60 backdrop-blur-xl"
                                onClick={() => setSelectedLead(null)}
                            />
                            <motion.div
                                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 32, stiffness: 300 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#020617] border-l border-white/5 z-[101] shadow-2xl flex flex-col"
                            >
                                {/* Drawer Header */}
                                <div className="p-12 pb-6 border-b border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#3b82f611,_transparent_50%)]" />
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">
                                                    {selectedLead.pipeline === "advisor" ? "Asignación Humana" : "Autónomo IA"}
                                                </span>
                                                <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                                                <span className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em]">{selectedLead.id} // UUID</span>
                                            </div>
                                            <h2 className="text-5xl font-display font-black tracking-tighter text-bright-white leading-none">{selectedLead.name}</h2>
                                            <p className="text-slate-500 text-lg font-medium mt-4 flex items-center gap-2">
                                                <LayoutGrid className="h-4 w-4 text-blue-400" />
                                                {selectedLead.interest}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedLead(null)}
                                            className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all text-slate-500 hover:text-white"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Drawer Content Scrollable */}
                                <div className="flex-1 overflow-y-auto custom-scroll p-12 pt-8 space-y-12">
                                    {/* Intelligence Highlights */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-white/[0.04] to-transparent border border-white/10 relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Probabilidad de Cierre</p>
                                                <ArrowUpRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-6xl font-display font-black text-bright-white group-hover:text-blue-400 transition-colors duration-500">{selectedLead.score}</span>
                                                <span className="text-slate-500 font-bold text-xl">/ 100</span>
                                            </div>
                                            <div className="mt-8 h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${selectedLead.score}%` }} className="h-full bg-linear-to-r from-blue-700 via-blue-500 to-blue-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                                            </div>
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group/card">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Inversión Estimada</p>
                                                <p className="text-2xl font-black text-bright-white leading-tight">{selectedLead.budget}</p>
                                            </div>
                                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 bg-blue-400/10 self-start px-2 py-1 rounded-lg">
                                                <Atom className="h-3 w-3 animate-pulse" /> Inteligencia Comercial
                                            </p>
                                        </div>
                                    </div>

                                    {/* Retell AI Unified Section — Discovery Style */}
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Mic className="h-5 w-5 text-blue-400" />
                                                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-400 rounded-full animate-pulse" />
                                                </div>
                                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnóstico Retell AI</h3>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                <span className="text-[8px] font-black text-blue-400 uppercase">Procesamiento Neural Activo</span>
                                            </div>
                                        </div>

                                        <div className="rounded-[2.5rem] bg-linear-to-b from-white/[0.03] to-transparent border border-white/5 overflow-hidden shadow-2xl">
                                            {/* Audio Player */}
                                            <div className="p-8 bg-blue-600/5 border-b border-white/5 flex items-center gap-6">
                                                <button className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-90">
                                                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                                </button>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <div className="flex flex-col">
                                                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Grabación de Llamada</span>
                                                            <span className="text-xs font-bold text-bright-white uppercase tracking-tighter">RET-4429A_TULUM.MP3</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-blue-400">03:12 / 05:44</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                                                        <div className="absolute inset-0 bg-blue-500/20" />
                                                        <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] relative z-10" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Insights Tabs/Groups */}
                                            <div className="p-8 space-y-8">
                                                {/* Summary Section */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-blue-400">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <h4 className="text-[9px] font-black uppercase tracking-widest">Resumen de Síntesis</h4>
                                                    </div>
                                                    <p className="text-base font-medium text-white/90 leading-relaxed pl-5 border-l-2 border-blue-400/20 italic">
                                                        "{selectedLead.notes || "El cliente muestra un perfil de inversión agresivo, priorizando la ubicación y el retorno de inversión sobre el tiempo de entrega."}"
                                                    </p>
                                                </div>

                                                {/* Sentiment & Latency */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-blue-400">
                                                                <TrendingUp className="h-3 w-3" />
                                                                <span className="text-[8px] font-black uppercase tracking-widest">Sentimiento</span>
                                                            </div>
                                                            <span className="text-[10px] font-black text-blue-400">{selectedLead.retell?.sentiment || 75}%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${selectedLead.retell?.sentiment || 75}%` }} className="h-full bg-blue-400" />
                                                        </div>
                                                    </div>
                                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                                                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                            <Activity className="h-3 w-3" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest">Tech Stack Performance</span>
                                                        </div>
                                                        <p className="text-[11px] font-bold text-slate-400">{selectedLead.retell?.callLatencies || "Avg: 850ms"} // 11Labs-Powered</p>
                                                    </div>
                                                </div>

                                                {/* Core Data Grid */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                                        <div className="flex items-center gap-2 text-blue-400">
                                                            <Target className="h-3 w-3" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest">Pain Points</span>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {(selectedLead.retell?.painPoints || ["Seguridad Jurídica", "ROI < 10%", "Falta de Amenidades"]).map((p, i) => (
                                                                <li key={i} className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                                                                    <div className="h-1 w-1 rounded-full bg-blue-500" /> {p}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                                        <div className="flex items-center gap-2 text-rose-400">
                                                            <XCircle className="h-3 w-3" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest">Objecciones</span>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {(selectedLead.retell?.objections || ["Precio m2", "Distancia al mar", "Mantenimiento"]).map((o, i) => (
                                                                <li key={i} className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                                                                    <div className="h-1 w-1 rounded-full bg-rose-500" /> {o}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Trust & Signals */}
                                                <div className="grid grid-cols-4 gap-4">
                                                    {[
                                                        { l: "Trust Score", v: `${selectedLead.retell?.trustScore || 85}%`, c: "text-blue-400", bg: "bg-blue-400/5" },
                                                        { l: "Interest", v: selectedLead.retell?.interestSignal || "High", c: "text-blue-400", bg: "bg-blue-400/5" },
                                                        { l: "Voice Latency", v: "820ms", c: "text-slate-500", bg: "bg-white/5" },
                                                        { l: "Model", v: "BS-GPT4-o", c: "text-slate-500", bg: "bg-white/5" }
                                                    ].map((s, i) => (
                                                        <div key={i} className={clsx("p-3 rounded-xl border border-white/5 flex flex-col gap-1", s.bg)}>
                                                            <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter">{s.l}</span>
                                                            <span className={clsx("text-[10px] font-black uppercase", s.c)}>{s.v}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Seller Strategy */}
                                                <div className="space-y-4 pt-4 border-t border-white/5">
                                                    <div className="flex items-center gap-2 text-amber-400">
                                                        <Sparkles className="h-3 w-3" />
                                                        <h4 className="text-[9px] font-black uppercase tracking-widest">Estrategia de Cierre Sugerida</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-3 pl-5">
                                                        <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 relative group/insight overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-3 opacity-20 transform group-hover/insight:rotate-12 transition-transform">
                                                                <Atom className="h-8 w-8 text-blue-400" />
                                                            </div>
                                                            <div className="relative z-10">
                                                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Clave de Venta IA</p>
                                                                <p className="text-sm font-bold text-blue-100 italic leading-relaxed">
                                                                    "{selectedLead.retell?.strategicKey || "Enfoca la charla en el Blindaje Legal de la propiedad. El cliente tiene miedo a fraudes locales."}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["ROI 12%", "Ubicación Premium", "Preventa Exclusiva"].map(t => (
                                                                <span key={t} className="text-[8px] font-black px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 uppercase tracking-tighter">{t}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Transcription Snippet */}
                                                <div className="space-y-4 pt-4 border-t border-white/5">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <FileText className="h-3 w-3" />
                                                        <h4 className="text-[9px] font-black uppercase tracking-widest">Transcripción Crítica</h4>
                                                    </div>
                                                    <div className="bg-navy-950/50 p-4 rounded-2xl border border-white/5">
                                                        <p className="text-[11px] font-medium leading-relaxed italic text-slate-400">
                                                            <span className="text-blue-400 font-bold">IA:</span> "¿Qué es lo más importante para usted en esta inversión?" <br />
                                                            <span className="text-bright-white font-bold">Cliente:</span> "Que sea seguro, he escuchado de problemas legales en la zona y no quiero arriesgar mi capital..."
                                                        </p>
                                                    </div>
                                                    <button className="w-full py-2 text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-white transition-colors duration-300">
                                                        Acceder a Transcripción Completa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Analysis */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-8">
                                            <Clock3 className="h-4 w-4 text-blue-400" />
                                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Historial de Orquestación</h3>
                                        </div>
                                        <div className="space-y-6 relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-linear-to-b before:from-blue-500/50 before:via-white/5 before:to-transparent">
                                            {selectedLead.timeline.map((item, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div className={clsx(
                                                        "absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-navy-950 transition-all duration-500 group-hover:scale-125",
                                                        item.type === "ia" ? "bg-blue-400 shadow-[0_0_10px_#10b981]" :
                                                            item.type === "humano" ? "bg-blue-600 shadow-[0_0_10px_#059669]" : "bg-slate-700"
                                                    )} />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{item.date}</span>
                                                            <span className={clsx(
                                                                "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm border",
                                                                item.type === "ia" ? "text-blue-400 border-blue-400/20 bg-blue-400/5" :
                                                                    item.type === "humano" ? "text-blue-400 border-blue-400/20 bg-blue-400/5" : "text-slate-500 border-white/5"
                                                            )}>
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{item.event}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Lead Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { l: "Tipo Propiedad", v: selectedLead.propertyType, i: LayoutGrid },
                                            { l: "Ubicación", v: selectedLead.city, i: Search },
                                            { l: "Origen", v: selectedLead.source, i: Users },
                                            { l: "Siguiente Paso", v: selectedLead.nextAction, i: ArrowRight }
                                        ].map((item, idx) => (
                                            <div key={idx} className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col gap-2 hover:bg-white/[0.02] transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <item.i className="h-3 w-3 text-slate-700" />
                                                    <span className="text-[9px] font-black text-slate-700 uppercase">{item.l}</span>
                                                </div>
                                                <span className="text-sm font-bold text-white/80 capitalize">{item.v}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Context Card */}
                                    <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-blue-700/10 to-transparent border border-blue-500/10 relative overflow-hidden group">
                                        <div className="absolute -right-4 -top-4 h-24 w-24 bg-blue-500/5 blur-3xl rounded-full" />
                                        <div className="flex items-center gap-3 mb-6 relative z-10">
                                            <Atom className="h-5 w-5 text-blue-300 animate-pulse" />
                                            <h3 className="text-xs font-black text-blue-300/80 uppercase tracking-widest">Recomendación IA</h3>
                                        </div>
                                        <p className="text-lg font-medium text-bright-white leading-relaxed italic relative z-10">
                                            "{selectedLead.notes}"
                                        </p>
                                    </div>

                                    <div className="h-32" /> {/* Bottom Spacer for Action Bar */}
                                </div>

                                {/* Drawer Action Bar (Fixed Bottom) */}
                                <div className="p-8 bg-navy-950/90 backdrop-blur-3xl border-t border-white/5 flex gap-4 h-32 items-center relative z-20">
                                    <button className="flex-1 h-16 rounded-2xl bg-blue-700 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3 text-white">
                                        <Atom className="h-4 w-4" />
                                        Ejecutar Orquestación
                                    </button>
                                    <div className="flex gap-3">
                                        {[
                                            { i: MessageSquare, c: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
                                            { i: Phone, c: "bg-blue-600/10 text-blue-400 border-blue-600/20" },
                                            { i: Calendar, c: "bg-slate-500/10 text-slate-400 border-white/10" }
                                        ].map((tool, tIdx) => (
                                            <button key={tIdx} className={clsx("h-16 w-16 rounded-2xl flex items-center justify-center border transition-all hover:scale-105 active:scale-90", tool.c)}>
                                                <tool.i className="h-6 w-6" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Global Notifications Radar */}
                <AnimatePresence>
                    {showNotifications && (
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-[420px] bg-navy-950/95 backdrop-blur-3xl border-l border-white/5 z-[120] shadow-2xl p-10"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-display font-black">Centro de <span className="text-blue-500">Alertas</span></h3>
                                <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {initialNotifications.map(n => (
                                    <motion.div
                                        key={n.id}
                                        whileHover={{ x: -4 }}
                                        className="p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:border-blue-500/40 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">{n.type}</span>
                                            <span className="text-[9px] font-black uppercase text-slate-700">{n.time}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-bright-white mb-1">{n.title}</h4>
                                        <p className="text-slate-500 text-sm font-medium">{n.detail}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Scrollbar Customization */}
            <style jsx global>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }
      `}</style>
        </div>
    );
}
