"use client";

import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Globe, Database, UserCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
    const lastUpdate = "9 de Marzo, 2026";
    
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">
                            Volver al inicio
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">
                            NSG Intelligence
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase mb-4 border border-blue-100">
                        <Lock className="w-3 h-3" />
                        Privacidad y Seguridad
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Política de <span className="text-blue-600">Privacidad</span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                        En <strong>BS Intelligence</strong> (propiedad de Next Strategy Group), la protección de tu propiedad intelectual y datos personales es nuestra prioridad. Detallamos cómo gestionamos la información dentro de nuestro ecosistema de inteligencia.
                    </p>
                    <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
                        <span>Última actualización: {lastUpdate}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>Lectura de 6 min</span>
                    </div>
                </header>

                <div className="grid gap-8">
                    {/* Sección 1: Recopilación */}
                    <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                1. Información que Recopilamos
                            </h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>Para operar la plataforma de NSG Intelligence, recopilamos los siguientes tipos de datos:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                <li className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <UserCheck className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span><strong>Identidad:</strong> Nombre, email y Telegram ID para la sincronización del bot de asistencia.</span>
                                </li>
                                <li className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <Database className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span><strong>Documentación:</strong> Archivos PDF, Word y transcripciones que subes a tu Bóveda de Conocimiento.</span>
                                </li>
                                <li className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <Globe className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span><strong>Actividad Técnica:</strong> Logs de interacción con la IA, cookies de sesión y datos de uso de Fathom Video.</span>
                                </li>
                                <li className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span><strong>Facturación:</strong> Historial de transacciones y estado de suscripción gestionados a través de Stripe.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 2: Uso de la IA */}
                    <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                2. Procesamiento por IA y Terceros
                            </h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>Utilizamos proveedores líderes para procesar tu información, garantizando estándares de seguridad:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Stripe:</strong> Gestiona de forma segura tus datos de pago. Nosotros no almacenamos información de tarjetas de crédito.</li>
                                <li><strong>Modelos de Lenguaje (IA):</strong> La información de tus documentos se procesa para generar análisis estratégicos. Los datos no se utilizan para entrenar modelos públicos de terceros sin anonimización previa.</li>
                                <li><strong>n8n y Automatizaciones:</strong> Orquestamos flujos de datos para conectar tu contenido con las herramientas de análisis.</li>
                                <li><strong>Google Calendar:</strong> Si vinculas tu cuenta, accedemos a tu agenda exclusivamente para la gestión de recordatorios estratégicos.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 3: Seguridad */}
                    <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                3. Medidas de Protección
                            </h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Encriptación <strong>AES-256</strong> para el almacenamiento de documentos en nuestra base de datos sensible.</li>
                                <li>Conexiones cifradas mediante <strong>TLS/SSL</strong> en todo momento.</li>
                                <li>Acceso restringido basado en JWT (JSON Web Tokens) y cookies seguras HttpOnly.</li>
                                <li>Aislamiento de contenedores en infraestructura VPS dedicada para prevenir fugas de datos.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 4: Derechos */}
                    <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                4. Tus Derechos (RGPD)
                            </h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>Puedes ejercer tus derechos de acceso, rectificación, supresión y portabilidad en cualquier momento. Si deseas eliminar tu cuenta y todos los documentos asociados a tu estrategia, puedes hacerlo desde el panel de configuración o contactándonos directamente.</p>
                            <p className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic flex flex-col md:flex-row items-center gap-4">
                                <span className="font-semibold text-slate-900">Contacto de Privacidad:</span>
                                <a href="mailto:iagents.nsg@gmail.com" className="text-blue-600 hover:underline font-medium not-italic">
                                    iagents.nsg@gmail.com
                                </a>
                            </p>
                        </div>
                    </section>
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-200 text-center">
                    <p className="text-slate-400 text-sm">
                        &copy; 2026 Next Strategy Group. Todo el procesamiento de datos se realiza bajo estándares de seguridad internacional.
                    </p>
                </footer>
            </main>
        </div>
    );
}

