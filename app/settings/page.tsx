"use client";

import DashboardCard from "@/components/dashboard/DashboardCard";
import ThemeToggle from "@/components/controls/ThemeToggle";
import { User, Bell, Lock, Globe, Shield, Database, Cpu } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="font-display font-bold text-3xl text-navy-900">Settings</h1>
          <p className="text-slate-500 mt-1">Configure your NSG Intelligence experience</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {/* Profile Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" /> Profile & Account
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                     DA
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-navy-900">Dr. Arriaga</h3>
                     <p className="text-slate-500">Senior Consultant</p>
                     <button className="text-sm text-blue-600 font-bold mt-1 hover:underline">Edit Profile</button>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">Email Address</label>
                     <input type="email" value="arriaga@nsg.com" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">Department</label>
                     <input type="text" value="Strategic Consulting" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                  </div>
               </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4" /> Appearance
            </h2>
            <DashboardCard title="Theme Preferences" glassmorphism={true}>
               <ThemeToggle />
            </DashboardCard>
          </section>

          {/* System Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4" /> System
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="divide-y divide-slate-100">
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                           <Database className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-navy-900 text-sm">Context Cache</h4>
                           <p className="text-xs text-slate-500">Manage AI context memory</p>
                        </div>
                     </div>
                     <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition">Clear Cache</button>
                  </div>

                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                           <Shield className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-navy-900 text-sm">Data Privacy</h4>
                           <p className="text-xs text-slate-500">Encryption & retention policies</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-600">Active</span>
                     </div>
                  </div>

                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                           <Bell className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-navy-900 text-sm">Notifications</h4>
                           <p className="text-xs text-slate-500">Alert preferences</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     </label>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
