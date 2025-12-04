"use client";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import AIModal from "@/components/layout/AIModal";
import { useUIStore } from "@/store/useUIStore";
import DayDetailPanel from "@/components/features/DayDetailPanel";
import clsx from "clsx";

// Optional: Import DayDetailPanel if you componentize it
// import DayDetailPanel from "@/components/features/DayDetailPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDayPanelOpen, toggleDayPanel } = useUIStore();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. Sidebar (Fixed or Slide-out) */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 flex flex-col relative overflow-hidden w-full h-full">
        
        {/* Header */}
        <TopNav />

        {/* Dynamic Page Content */}
        <div id="workspace-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scroll safe-bottom-scroll scroll-smooth w-full">
           {children}
        </div>

      </main>

      {/* 3. Global Modals (Overlaying everything) */}
      <AIModal />
      
      {/* 4. Day Detail Panel (Slide Over) - Inline implementation for brevity */}
      <DayDetailPanel />
         <div 
           className={clsx(
             "fixed inset-0 bg-navy-950/20 z-[105] backdrop-blur-sm transition-opacity",
             isDayPanelOpen ? "opacity-100 block" : "opacity-0 hidden pointer-events-none"
           )} 
           onClick={toggleDayPanel}
         />
         <div className={clsx(
            "fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[110] border-l border-slate-200 flex flex-col h-full",
            isDayPanelOpen ? "translate-x-0" : "translate-x-full"
         )}>
             {/* ... Content from your #day-detail-panel HTML ... */}
         </div>
      </>

    </div>
  );
}