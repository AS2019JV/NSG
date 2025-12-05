import { Cpu, Newspaper, Target, Sunrise, Briefcase, Calendar, BarChart2, Settings, Hexagon, Users, BookOpen, PieChart, Trello, FileSpreadsheet, HeartPulse } from "lucide-react";

export const CONTEXT = {
    consultant: { 
        name: "Dr. Arriaga", 
        avatar: "DA", 
        roleDesc: "Senior Consultant", 
        menu: [
            { id: 'nsg_ios', label: 'NSG Intelligence', icon: Cpu, special: true },
            { id: 'nsg_news', label: 'NSG News', icon: Newspaper },
            { id: 'nsg_clarity', label: 'NSG Clarity', icon: Target },
            { id: 'nsg_horizon', label: 'NSG Horizon', icon: Sunrise },
            { id: 'portfolio', label: 'Cartera de Activos', icon: Briefcase },
            { id: 'calendar', label: 'Agenda Maestra', icon: Calendar },
            { id: 'reports', label: 'Inteligencia de Datos', icon: BarChart2 },
            { id: 'settings', label: 'Configuración', icon: Settings }
        ] 
    },
    psychologist: { 
        name: "Lic. Sofia", 
        avatar: "LS", 
        roleDesc: "Clinical Lead", 
        menu: [ 
            { id: 'nsg_ios', label: 'NSG Intelligence', icon: Cpu, special: true }, 
            { id: 'nsg_news', label: 'NSG News', icon: Newspaper }, 
            { id: 'nsg_clarity', label: 'NSG Clarity', icon: Target }, 
            { id: 'nsg_horizon', label: 'NSG Horizon', icon: Sunrise }, 
            { id: 'clinical_radar', label: 'Análisis Multiaxial', icon: Hexagon }, 
            { id: 'calendar', label: 'Agenda Maestra', icon: Calendar }, 
            { id: 'patients', label: 'Pacientes', icon: Users }, 
            { id: 'library', label: 'Biblioteca', icon: BookOpen },
            { id: 'settings', label: 'Configuración', icon: Settings }

        ] 
    },
    manager: {
        name: "Roberto V.", 
        avatar: "RV", 
        roleDesc: "CEO", 
        menu: [ 
            { id: 'nsg_ios', label: 'NSG Intelligence', icon: Cpu, special: true }, 
            { id: 'nsg_news', label: 'NSG News', icon: Newspaper }, 
            { id: 'nsg_clarity', label: 'NSG Clarity', icon: Target }, 
            { id: 'nsg_horizon', label: 'NSG Horizon', icon: Sunrise }, 
            { id: 'calendar', label: 'Agenda Maestra', icon: Calendar }, 
            { id: 'metrics', label: 'P&L Financiero', icon: PieChart }, 
            { id: 'strategy', label: 'M&A Pipeline', icon: Trello }, 
            { id: 'reports', label: 'Reportes Board', icon: FileSpreadsheet },
            { id: 'settings', label: 'Configuración', icon: Settings }
 
        ] 
    },
    patient: {
        name: "Paciente",
        avatar: "PA",
        roleDesc: "Patient",
        menu: [
            { id: 'nsg_ios', label: 'NSG Intelligence', icon: Cpu, special: true },
            { id: 'nsg_clarity', label: 'NSG Clarity', icon: Target },
            { id: 'nsg_news', label: 'NSG News', icon: Newspaper }, 
            { id: 'wellness', label: 'Bienestar', icon: HeartPulse },
            { id: 'calendar', label: 'Agenda', icon: Calendar },
            { id: 'settings', label: 'Configuración', icon: Settings }

        ]
    }
};

export type RoleType = keyof typeof CONTEXT;
