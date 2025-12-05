"use client";

import { useAppStore } from "@/store/useAppStore";
import { Activity, ChevronDown } from "lucide-react";
import { CONTEXT, RoleType } from "@/data/context";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";

interface DynamicIslandProps {
  currentMode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

export default function DynamicIsland({ currentMode, setMode }: DynamicIslandProps) {
  const { currentRole, isContextCached } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get menu items for current role
  const roleKey = (currentRole as RoleType) || 'consultant';
  const menuItems = CONTEXT[roleKey]?.menu || [];
  
  // Find current mode label
  const currentModeItem = menuItems.find(item => item.id === currentMode);
  const currentModeLabel = currentModeItem?.label || "Standard";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="bg-slate-950 rounded-full px-4 py-2 flex items-center gap-3 shadow-island transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isContextCached ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentRole}</span>
        </div>
        <div className="h-4 w-px bg-white/10"></div>
        
        {/* Mode Selector */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Activity className="w-3 h-3" />
          <span className="text-xs font-bold">{currentModeLabel}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md overflow-hidden min-w-[200px] animate-fade-in-up">
          <div className="py-2">
            {/* Standard Mode */}
            <button
              onClick={() => {
                setMode('standard');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors flex items-center gap-2 ${
                currentMode === 'standard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3 h-3" />
              Standard
            </button>

            {/* Menu Items */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMode(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors flex items-center gap-2 ${
                    currentMode === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800'
                  } ${item.special ? 'border-t border-white/10' : ''}`}
                >
                  <Icon className="w-3 h-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
