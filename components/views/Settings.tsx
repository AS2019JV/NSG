'use client';

import React, { useState } from 'react';
import { Bell, Shield, Moon, Settings as SettingsIcon, Zap, Globe, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import clsx from "clsx";
import { useAppStore } from "@/store/useAppStore";
import api from "@/lib/api";
import { authService } from "@/lib/auth";

export default function Settings() {
  const { showToast } = useToast();
  const { theme, setTheme, userId } = useAppStore();

  // Integrations state
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isCheckingCalendar, setIsCheckingCalendar] = useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.verifySession();
        if (data?.user?.telegram_id) {
          setTelegramId(data.user.telegram_id);
        }
      } catch (error) {
        // Silent fail
      }
    };
    fetchUser();
    
    // Check Google Calendar connection
    const checkCalendar = async () => {
      setIsCheckingCalendar(true);
      try {
        const res = await api.get('/google/calendar/events');
        if (res.status === 200) {
          setIsCalendarConnected(true);
        }
      } catch (e) {
        setIsCalendarConnected(false);
      } finally {
        setIsCheckingCalendar(false);
      }
    };
    checkCalendar();
  }, []);

  const handleConnectCalendar = async () => {
    if (isCalendarConnected) {
      try {
        await api.delete('/google/calendar');
        setIsCalendarConnected(false);
        showToast('Google Calendar desconectado', 'info');
      } catch (e) {
        showToast('Error al desconectar', 'error');
      }
    } else {
      try {
        const res = await api.get('/google/auth');
        if (res.data?.url) {
          window.open(res.data.url, '_blank');
        }
      } catch (e) {
        showToast('Error al conectar', 'error');
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`Tema cambiado a ${newTheme === 'dark' ? 'Oscuro' : 'Claro'}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up pb-10 px-4 sm:px-0">

      {/* Header */}
      <div className="bg-linear-to-br from-slate-50 to-slate-100 p-6 rounded-3xl border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-6 h-6 text-slate-600" />
          <h2 className="font-display font-bold text-3xl text-navy-900">Configuración del Sistema</h2>
        </div>
        <p className="text-slate-600 text-sm">Personaliza tu experiencia, integraciones y preferencias de uso</p>
      </div>

      {/* Integrations Section */}
      <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <ExternalLink className="w-6 h-6 text-slate-600" />
          <div>
            <h3 className="font-display font-bold text-xl text-navy-950">Integraciones</h3>
            <p className="text-slate-500 text-sm">Conecta tu cuenta con plataformas externas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Telegram Integration */}
          <IntegrationCard
            name="Telegram"
            icon={
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M11.944 0C5.352 0 0 5.352 0 11.944c0 6.592 5.352 11.944 11.944 11.944c6.592 0 11.944-5.352 11.944-11.944C23.888 5.352 18.536 0 11.944 0zm5.66 8.16l-1.928 9.096c-.144.644-.528.804-1.068.5l-2.936-2.164l-1.416 1.364c-.156.156-.288.288-.588.288l.212-3.04l5.524-4.992c.24-.212-.052-.332-.372-.12l-6.828 4.3l-2.948-.92c-.64-.2-.652-.64.132-.948l11.524-4.44c.532-.2.996.12.804.976z" />
              </svg>
            }
            color="[#0088cc]"
            connected={!!telegramId}
            connectedText={`ID: ${telegramId}`}
            onAction={() => {
              if (!telegramId) {
                window.open(`https://t.me/nsg_preguntasyrespuestas_bot?start=${userId}`, '_blank');
              } else {
                showToast('Telegram ya conectado', 'info');
              }
            }}
          />

          {/* Google Calendar Integration */}
          <IntegrationCard
            name="Google Calendar"
            icon={
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            }
            color="blue-600"
            connected={isCalendarConnected}
            connectedText="Sincronizado"
            loading={isCheckingCalendar}
            onAction={handleConnectCalendar}
          />
        </div>
      </div>

      {/* System Preferences Card */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-card border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-navy-950">Preferencias del Sistema</h3>
            <p className="text-slate-500 text-sm">Ajusta el comportamiento de la aplicación</p>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleItem
            icon={Bell}
            title="Notificaciones Inteligentes"
            desc="Recibe alertas basadas en contexto y prioridad"
            color="blue"
            active={true}
            onClick={() => showToast('Preferencia de notificaciones actualizada', 'info')}
          />
          <ToggleItem
            icon={Shield}
            title="Modo Privacidad Avanzada"
            desc="Ocultar datos sensibles en dashboard compartido"
            color="purple"
            active={false}
            onClick={() => showToast('Preferencia de privacidad actualizada', 'info')}
          />
          <ToggleItem
            icon={Moon}
            title="Modo Oscuro"
            desc="Activar interfaz oscura para reducir fatiga visual"
            color="orange"
            active={theme === 'dark'}
            onClick={toggleTheme}
          />
          <ToggleItem
            icon={Globe}
            title="Sincronización en Tiempo Real"
            desc="Mantener datos sincronizados automáticamente"
            color="blue"
            active={true}
            onClick={() => showToast('Sincronización activada', 'success')}
          />
        </div>
      </div>

      {/* System Info */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Versión del Sistema</p>
            <p className="font-bold text-lg text-navy-900">v14.4.0-STABLE</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Última Actualización</p>
            <p className="font-medium text-sm text-slate-700">11 Enero 2026</p>
          </div>
        </div>
      </div>

    </div>
  );
}

// Toggle Item Component
interface ToggleItemProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: 'blue' | 'purple' | 'orange';
  active: boolean;
  onClick?: () => void;
}

function ToggleItem({ icon: Icon, title, desc, color, active, onClick }: ToggleItemProps) {
  const styles = {
    blue: {
      container: "hover:border-blue-300",
      iconBox: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
    },
    purple: {
      container: "hover:border-purple-300",
      iconBox: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
    },
    orange: {
      container: "hover:border-orange-300",
      iconBox: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
    }
  };

  const currentStyle = styles[color];

  return (
    <div
      className={clsx(
        "flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 transition-colors group cursor-pointer",
        currentStyle.container
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={clsx("p-3 rounded-xl transition-colors", currentStyle.iconBox)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-navy-900 text-sm">{title}</p>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>

      {/* Switch Toggle */}
      <div className={clsx(
        "relative w-12 h-6 rounded-full transition-colors",
        active ? "bg-emerald-500" : "bg-slate-300"
      )}>
        <div className={clsx(
          "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
          active ? "right-1" : "left-1"
        )} />
      </div>
    </div>
  );
}

// Integration Card Component
interface IntegrationCardProps {
  name: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  connectedText?: string;
  loading?: boolean;
  onAction: () => void;
}

function IntegrationCard({ name, icon, color, connected, connectedText, loading, onAction }: IntegrationCardProps) {
  return (
    <div className={clsx(
      "p-5 rounded-2xl border transition-all",
      connected 
        ? `bg-${color}/5 border-${color}/20` 
        : "bg-slate-50 border-slate-200 hover:border-slate-300"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            connected ? `bg-white text-${color}` : "bg-white text-slate-400"
          )}>
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-navy-900 text-sm">{name}</h4>
            <p className="text-xs text-slate-500">
              {connected ? (connectedText || 'Conectado') : 'No conectado'}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={onAction}
        disabled={loading}
        className={clsx(
          "w-full py-2 px-4 rounded-xl text-xs font-bold transition",
          connected
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : `bg-${color} text-white hover:opacity-90`,
          loading && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? 'Verificando...' : connected ? 'Desconectar' : 'Conectar'}
      </button>
    </div>
  );
}
