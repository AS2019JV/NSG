"use client";

import React, { useState } from "react";
import { X, Plus, Target, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Design constants aligned with NSGCopilot
const GLASS_DRAWER = "bg-navy-950/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl";
const BTN_PRIMARY = "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.25)] transition-all duration-400 rounded-2xl font-bold tracking-tight active:scale-[0.97]";
const INPUT_GLASS = "bg-white/5 hover:bg-white/10 focus:bg-white/15 border border-white/10 focus:border-blue-500/30 transition-all duration-300 rounded-xl outline-none text-white";

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface AddActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (action: { title: string; description: string; impact: string }) => void;
}

export default function AddActionModal({ isOpen, onClose, onSave }: AddActionModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [impact, setImpact] = useState("Medio");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;
        onSave({ title, description, impact });
        setTitle("");
        setDescription("");
        setImpact("Medio");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn("fixed top-0 right-0 h-full w-full max-w-lg z-[111] p-8 flex flex-col shadow-2xl", GLASS_DRAWER)}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Plus className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter text-white text-bright-white">Nueva Acción</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Título de la Acción</label>
                                    <input 
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ej: Revisión de métricas semanales"
                                        className={cn(INPUT_GLASS, "w-full px-5 py-4 text-lg font-medium")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#86868B] uppercase tracking-widest ml-1">Descripción</label>
                                    <textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Define brevemente el objetivo de esta acción..."
                                        className={cn(INPUT_GLASS, "w-full p-5 min-h-[120px] text-[15px] resize-none leading-relaxed")}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-[#86868B] uppercase tracking-widest ml-1">Nivel de Impacto</label>
                                    <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                                        {['Bajo', 'Medio', 'Alto'].map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setImpact(level)}
                                                className={cn(
                                                    "py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all duration-300",
                                                    impact === level 
                                                        ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-[1.05]" 
                                                        : "text-slate-500 hover:text-white hover:bg-white/10"
                                                )}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="p-5 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex gap-4 items-start">
                                    <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                                    <p className="text-[12px] text-blue-100/70 leading-relaxed font-bold">
                                        Esta acción se integrará en tu Lista de Acción Inteligente. El Agente I monitorizará su progreso automáticamente.
                                    </p>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!title}
                                    className={cn(BTN_PRIMARY, "w-full py-4 text-lg font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed")}
                                >
                                    Crear Acción
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
