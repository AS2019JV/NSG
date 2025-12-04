"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { use } from "react"; 

// Lazy load components map
const Views: Record<string, any> = {
  // Main System
  nsg_ios: dynamic(() => import("@/components/views/NSGSystem")),
  
  // Modules
  nsg_news: dynamic(() => import("@/components/views/NSGNews")),
  accountability: dynamic(() => import("@/components/views/NSGClarity")),
  nsg_horizon: dynamic(() => import("@/components/views/NSGHorizon")),
  
  // Features
  calendar: dynamic(() => import("@/components/views/CalendarView")),
  metrics: dynamic(() => import("@/components/views/Metrics")),
  strategy: dynamic(() => import("@/components/views/Strategy")),
  wellness: dynamic(() => import("@/components/views/Wellness")),
  library: dynamic(() => import("@/components/views/Library")),
  journal: dynamic(() => import("@/components/views/Journal")),
  portfolio: dynamic(() => import("@/components/views/Portfolio")),
  reports: dynamic(() => import("@/components/views/Reports")),
  patients: dynamic(() => import("@/components/views/Patients")),
  clinical_radar: dynamic(() => import("@/components/views/ClinicalRadar")),
  deliverables: dynamic(() => import("@/components/views/Deliverables")),
  settings: dynamic(() => import("@/components/views/Settings")),
};

interface PageProps {
  params: Promise<{ view: string }>;
}

export default function ViewPage({ params }: PageProps) {
  // Unwrap params using React.use() or await (Next.js 15+ pattern)
  const resolvedParams = use(params);
  
  const Component = Views[resolvedParams.view];

  if (!Component) {
    return notFound();
  }

  return <Component />;
}