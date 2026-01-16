"use client";
import { useEffect, useRef } from "react";
import { DollarSign, Percent, Flame, Calendar } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard"; 
import Chart from "chart.js/auto";
import RoleGuard from "@/components/RoleGuard";

export default function Metrics() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      // --- LEGACY CHART CONFIGURATION ---
      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            { label: 'Ingresos', data: [65, 59, 80, 81, 56, 95], backgroundColor: '#3B82F6', borderRadius: 6 }, 
            { label: 'Gastos', data: [28, 48, 40, 19, 36, 27], backgroundColor: '#E2E8F0', borderRadius: 6 }
          ]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false, 
          scales: { 
            y: { 
              beginAtZero: true, 
              grid: { color: '#F1F5F9' }, // Matches legacy borderDash if supported or simplified
              ticks: { font: { family: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" } } 
            }, 
            x: { 
              grid: { display: false }, 
              ticks: { font: { family: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" } } 
            } 
          }, 
          plugins: { 
            legend: { 
              position: 'bottom', 
              labels: { font: { family: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }, usePointStyle: true } 
            } 
          } 
        }
      });
    }
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto flex flex-col gap-4 xs:gap-5 sm:gap-6 animate-fade-in-up pb-10 px-3 xs:px-4 sm:px-0">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          <StatCard title="Revenue YTD" value="$2.4M" icon={DollarSign} colorClass="text-emerald-600" bgClass="bg-white" />
          <StatCard title="EBITDA" value="32%" icon={Percent} colorClass="text-blue-600" bgClass="bg-white" />
          <StatCard title="Burn Rate" value="$45k" icon={Flame} colorClass="text-orange-500" bgClass="bg-white" />
          <StatCard title="Runway" value="18m" icon={Calendar} colorClass="text-indigo-600" bgClass="bg-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
          {/* CHART CONTAINER */}
          <div className="lg:col-span-2 bg-white p-4 xs:p-5 sm:p-6 rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] shadow-card border border-slate-200">
            <h3 className="font-bold text-navy-900 mb-3 xs:mb-4 text-base xs:text-lg">Proyección Financiera</h3>
            <div className="h-64 xs:h-72 sm:h-80 w-full relative">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white p-4 xs:p-5 sm:p-6 rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] shadow-card border border-slate-200 flex flex-col">
            <h3 className="font-bold text-navy-900 mb-3 xs:mb-4 text-base xs:text-lg">Transacciones Recientes</h3>
            <div className="space-y-2 xs:space-y-3 overflow-y-auto h-64 xs:h-72 sm:h-80 custom-scroll pr-1 xs:pr-2">
               <TransactionItem name="Stripe Inc." amount="+$12,450" type="Ingreso" />
               <TransactionItem name="AWS Cloud" amount="-$2,100" type="Gasto" />
               <TransactionItem name="Consultoría" amount="+$8,500" type="Ingreso" />
               <TransactionItem name="Nómina" amount="-$15,000" type="Gasto" />
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

function TransactionItem({ name, amount, type }: { name: string, amount: string, type: 'Ingreso' | 'Gasto' }) {
  const isIncome = type === 'Ingreso';
  return (
    <div className="flex justify-between items-center p-3 xs:p-4 hover:bg-slate-50 rounded-xl transition cursor-pointer group min-h-[60px]">
      <div className="flex items-center gap-2 xs:gap-3">
        <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] xs:text-xs text-slate-500 group-hover:bg-white group-hover:shadow-sm shrink-0">
          {name.substring(0, 2)}
        </div>
        <div>
          <p className="font-bold text-navy-900 text-xs xs:text-sm">{name}</p>
          <p className="text-[10px] xs:text-xs text-slate-400">{type}</p>
        </div>
      </div>
      <div className={`font-bold text-xs xs:text-sm ${isIncome ? 'text-emerald-600' : 'text-slate-600'}`}>
        {amount}
      </div>
    </div>
  );
}
