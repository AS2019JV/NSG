"use client";

import { useAppStore } from "@/store/useAppStore";
import {
    Activity,
    ChevronDown,
    Layers,
    Scale,
    BrainCircuit,
} from "lucide-react";
import { CONTEXT, RoleType } from "@/data/context";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import clsx from "clsx";
import { m, AnimatePresence } from "framer-motion";

// Update Props Interface
interface DynamicIslandProps {
    currentMode: string;
    setMode: (mode: string) => void;
    selectedModel?: string;
    setSelectedModel?: (model: string) => void;
    intelligenceMode?: "pulse" | "compare" | "fusion" | "deep";
    setIntelligenceMode?: (
        mode: "pulse" | "compare" | "fusion" | "deep",
    ) => void;
    isThinking?: boolean;
    isDeep?: boolean;
    setIsDeep?: (isDeep: boolean) => void;
}

import BrandAtom from "@/components/ui/BrandAtom";

export default function DynamicIsland({
    currentMode,
    setMode,
    selectedModel,
    setSelectedModel,
    intelligenceMode = "pulse",
    setIntelligenceMode,
    isThinking = false,
    isDeep = false,
    setIsDeep,
}: DynamicIslandProps) {
    const { currentRole } = useAppStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Get menu items for current role - Robust fallback
    const roleKey =
        currentRole && CONTEXT[currentRole as RoleType]
            ? (currentRole as RoleType)
            : "consultant";
    const menuItems = CONTEXT[roleKey]?.menu || [];

    // Reconstruct list: Standard + Specific List in Exact Order
    const targetOrder = ["nsg_copilot", "nsg_horizon", "nsg_news", "settings"];
    const menuMap = new Map(menuItems.map((i) => [i.id, i]));

    const allItems = [
        { id: "standard", label: "Standard", icon: Activity },
        ...targetOrder
            .map((id) => menuMap.get(id))
            .filter((item): item is NonNullable<typeof item> => !!item),
    ];

    return (
        <div
            className="relative z-50 flex flex-col items-center justify-start pt-2 xs:pt-4 gap-3 xs:gap-4 md:gap-6 w-full"
            ref={containerRef}
        >
            {/* 1. System Status Indicator (Apple Pro Label) */}
            <button
                onClick={() =>
                    intelligenceMode === "fusion" &&
                    setSelectedModel &&
                    setSelectedModel("BS Fusion")
                }
                className={clsx(
                    "flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-1 rounded-lg backdrop-blur-md shadow-sm animate-fade-in group transition-all duration-300",
                    intelligenceMode === "fusion"
                        ? "cursor-pointer hover:bg-white/10"
                        : "cursor-default bg-white/5 border border-white/10",
                    intelligenceMode === "fusion" &&
                        selectedModel === "BS Fusion"
                        ? "bg-blue-500/10 border border-blue-500/20 ring-1 ring-blue-500/10"
                        : "bg-white/5 border border-white/10",
                )}
            >
                <div
                    className={clsx(
                        "w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                        intelligenceMode === "fusion" &&
                            selectedModel === "BS Fusion"
                            ? "bg-blue-500 shadow-blue-500/50"
                            : "bg-blue-500",
                    )}
                ></div>
                <span
                    className={clsx(
                        "text-[9px] xs:text-[10px] font-bold tracking-[0.15em] uppercase font-display transition-colors",
                        intelligenceMode === "fusion" &&
                            selectedModel === "BS Fusion"
                            ? "text-blue-400"
                            : "text-white/70 group-hover:text-white",
                    )}
                >
                    {intelligenceMode === "fusion"
                        ? "BS AI"
                        : "System BS Intelligence"}
                </span>
            </button>

            {/* 2. Primary Dynamic Island (Navigation) */}
            <div className="relative flex items-center justify-center w-full max-w-[98vw] xs:max-w-[95vw] md:max-w-4xl mx-auto px-1 xs:px-0">
                <div
                    className={clsx(
                        "flex flex-nowrap items-center p-1.5 gap-1 md:p-2 md:gap-2",
                        "bg-navy-950 supports-backdrop-filter:bg-navy-950/90 backdrop-blur-xl", // Ultra-dark Navy/Black
                        "border border-white/10 ring-1 ring-white/5",
                        "rounded-2xl shadow-[0_8px_32px_-6px_rgba(0,0,0,0.4)]",
                        "overflow-x-auto scrollbar-hide transition-all duration-500 ease-spring",
                    )}
                >
                    {allItems.map((item) => {
                        const isActive = currentMode === item.id;
                        const isSpecial = item.id === "nsg_intelligence";
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setMode(item.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl transition-all duration-300 ease-out whitespace-nowrap relative shrink-0 cursor-pointer group min-h-[36px] md:min-h-[44px]",
                                    isActive
                                        ? "bg-blue-600/20 text-blue-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-blue-500/30"
                                        : "text-slate-400 hover:text-white hover:bg-white/5",
                                    isActive &&
                                    isSpecial &&
                                    "bg-blue-600/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-blue-400/30",
                                )}
                            >
                                <Icon
                                    className={clsx(
                                        "w-4 h-4 md:w-4.5 md:h-4.5 transition-colors shrink-0",
                                        isActive
                                            ? "text-blue-300"
                                            : "text-slate-500 group-hover:text-slate-300",
                                    )}
                                />
                                <span className="text-[12px] md:text-[14px] font-semibold tracking-wide">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. AI Model Selector (Conditional) */}
            <AnimatePresence mode="wait">
                {intelligenceMode && (
                    <m.div
                        key={
                            intelligenceMode === "fusion" ? "fusion" : "models"
                        }
                        initial={{
                            opacity: 0,
                            scale: 0.97,
                            y: 2,
                            filter: "blur(4px)",
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            filter: "blur(0px)",
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.97,
                            y: -2,
                            filter: "blur(4px)",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                            mass: 0.5,
                        }}
                        className="flex items-center justify-center mt-2.5 z-40"
                    >
                        <div className="flex items-center justify-center p-1 gap-1 md:p-1.5 md:gap-1.5 mx-auto rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
                            {(intelligenceMode === "fusion"
                                ? ["Chat GPT", "Gemini", "NSG AI", "Claude"]
                                : ["Chat GPT", "Gemini", "Claude"]
                            ).map((model) => {
                                const isSelected = selectedModel === model;

                                // Logic:
                                // 1. Thinking in Compare/Fusion -> All 3 Active
                                // 2. Otherwise -> Only Selected is Active
                                const isMultiActive =
                                    isThinking &&
                                    (intelligenceMode === "compare" ||
                                        intelligenceMode === "fusion");
                                const activeState = isSelected || isMultiActive;
                                const isBlinking = activeState && isThinking;

                                return (
                                    <button
                                        key={model}
                                        onClick={() =>
                                            setSelectedModel &&
                                            setSelectedModel(model)
                                        }
                                        className={clsx(
                                            "relative flex items-center justify-center px-3 py-1.5 md:px-5 md:py-2 rounded-xl transition-colors duration-300 whitespace-nowrap z-10 gap-2 cursor-pointer",
                                            !isSelected && "hover:bg-white/10",
                                        )}
                                    >
                                        {isSelected && (
                                            <m.div
                                                layoutId="active-model-pill"
                                                className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-blue-500/50 -z-10"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        {/* Pro Status Circle */}
                                        <div
                                            className={clsx(
                                                "w-1.5 h-1.5 rounded-full transition-all duration-500 ease-out shadow-sm",
                                                activeState
                                                    ? "bg-blue-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] scale-110"
                                                    : "bg-slate-500/50 scale-100 group-hover:bg-slate-400",
                                                isBlinking && "animate-pulse",
                                            )}
                                        />

                                        <span
                                            className={clsx(
                                                "relative z-10 transition-colors duration-300 text-[11px] md:text-[13px] font-semibold",
                                                isSelected
                                                    ? "text-white"
                                                    : "text-slate-400 group-hover:text-slate-200",
                                            )}
                                        >
                                            {model}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Scrollbar hide styles */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
