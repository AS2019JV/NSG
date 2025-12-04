"use client";
import { useUIStore } from "@/store/useUIStore";
import { X, Mic, Paperclip, ArrowUp } from "lucide-react";
import clsx from "clsx";

export default function AIModal() {
  const { isAIOpen, toggleAI } = useUIStore();

  if (!isAIOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-xl" onClick={toggleAI}></div>
        
        {/* Modal Container */}
        <div className="bg-slate-50 w-full h-[100dvh] lg:h-[85vh] lg:max-w-5xl lg:rounded-[2.5rem] shadow-2xl flex flex-col relative z-10 overflow-hidden lg:border lg:border-white/40 lg:ring-1 lg:ring-white/50 animate-fade-in-up">
            
            {/* Close Button */}
            <button onClick={toggleAI} className="absolute top-6 right-6 lg:top-8 lg:right-8 p-2.5 bg-white/60 hover:bg-white rounded-full transition shadow-sm z-50 backdrop-blur-md group border border-white/20">
                <X className="w-5 h-5 text-slate-500 group-hover:text-red-500 transition-colors" />
            </button>

            {/* Dynamic Island Header */}
            <div className="absolute top-0 left-0 w-full flex justify-center pt-6 lg:pt-8 z-40 pointer-events-none">
                <div className="dynamic-island pointer-events-auto animate-slide-down">
                    {/* Active State Example */}
                    <div className="island-btn active">
                       <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                       Neural Core Active
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto custom-scroll p-6 lg:p-12 pt-32 lg:pt-40 space-y-8 scroll-smooth w-full">
                <div className="text-center text-slate-400 text-sm mt-20">
                   System Ready. Initialize conversation.
                </div>
            </div>

            {/* Input Area */}
            <div className="shrink-0 relative z-20 safe-pb-modal bg-white/80 backdrop-blur-xl border-t border-slate-200">
                <div className="p-4 sm:p-6 lg:p-8">
                    <form className="relative max-w-4xl mx-auto group" onSubmit={(e) => e.preventDefault()}>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none transform scale-95"></div>
                        <div className="relative flex items-center bg-white border border-slate-200 rounded-3xl shadow-sm focus-within:shadow-md focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300">
                            <div className="flex gap-1 pl-3 text-slate-400">
                                <button type="button" className="p-2.5 hover:bg-slate-100 rounded-xl hover:text-blue-600 transition"><Mic className="w-5 h-5"/></button>
                                <button type="button" className="p-2.5 hover:bg-slate-100 rounded-xl hover:text-blue-600 transition"><Paperclip className="w-5 h-5"/></button>
                            </div>
                            <input type="text" className="flex-1 bg-transparent border-none py-4 px-3 font-medium text-navy-900 focus:ring-0 placeholder-slate-400 text-base focus:outline-none" placeholder="Escribe tu consulta o comando..." autoComplete="off" />
                            <div className="pr-2">
                                <button type="submit" className="p-3 bg-navy-900 text-white rounded-2xl hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center">
                                    <ArrowUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}