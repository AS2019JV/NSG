# NSG Intelligence - Next.js Premium Interface

![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443322?style=for-the-badge&logo=react&logoColor=white)

Una plataforma de inteligencia profesional de última generación. Diseñada para transformar datos estratégicos en decisiones accionables mediante una interfaz de usuario inmersiva y de alto rendimiento.

## ✨ Pilares de la Experiencia

### 💎 Diseño Premium (Glassmorphism & Neon)

- **UI de Grado Empresarial**: Construida con Tailwind CSS 4, utilizando efectos de `backdrop-blur`, gradientes dinámicos y tipografía de precisión.
- **Interacciones Vivas**: Micro-animaciones con `framer-motion` y efectos de partículas (BrandAtom).
- **Responsive**: Adaptabilidad total de tablet a escritorio profesional.

### 🧠 Módulos de Inteligencia

- **NSG Copilot Pro**: Protocolos de ejecución diaria alineados con la estrategia del usuario.
- **Horizon**: Planificación a largo plazo y proyección de objetivos.
- **Education (Bóveda)**: Gestión de conocimiento donde la IA analiza documentos PDF y extrae estrategias personalizadas.
- **Onboarding Estratégico**: Un flujo interactivo que "calibra" la IA para que piense como el usuario.

### 💳 Gestión de Facturación (Billing)

- **Portal de Precios**: Interfaz limpia para la selección de planes (Explorer, Estratega, Enterprise).
- **Stripe Checkout**: Integración nativa para pagos seguros y suscripciones recurrentes.
- **Dashboard de Plan**: Visualización clara del estado de la suscripción y límites del plan.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router / Turbopack)
- **IA**: Google Gemini 1.5 Pro/Flash + OpenAI Whisper
- **Estado**: Zustand (Persistence & Store Sharding)
- **Estilos**: Tailwind CSS 4 + Lucide React (Iconografía)
- **Analytics**: Fathom Integration
- **Despliegue**: Docker Standalone Build (Ready for VPS)

## 📁 Estructura del Proyecto

```text
NSG-Frontend/
├── app/
│   ├── (auth)/        # Flujos de Login y Registro
│   ├── billing/       # Sección de Pagos y Planes
│   ├── dashboard/     # Núcleo de la aplicación (Copilot, Education, etc.)
│   └── layout.tsx     # Contenedor con Sidebar y TopNav
├── components/
│   ├── ui/            # Componentes atómicos (Botones, Inputs, BrandAtom)
│   ├── features/      # Lógica compleja de cada módulo
│   └── layout/        # Estructura visual persistente
├── lib/               # Servicios (API, Auth, Billing, Gemini)
└── store/             # Gestión de estado global con Zustand
```

## 🚀 Instalación y Desarrollo

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar el entorno**

   Crea un archivo `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Iniciar servidor de desarrollo**

   ```bash
   npm run dev
   ```

## 🐳 Producción con Docker

El frontend está optimizado para ejecutarse en contenedores ligeros mediante el Dockerfile standalone:

```bash
docker build -t nsg-frontend .
```

---
**NSG Intelligence** | Premium Experience v3.2 | Strategic Interface
