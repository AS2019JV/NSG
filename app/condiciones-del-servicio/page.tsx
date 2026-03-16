'use client';

import { ArrowLeft, Gavel, Scale, FileCheck, CheckCircle2, AlertTriangle, CreditCard, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
    const lastUpdate = "9 de Marzo, 2026";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Volver al inicio</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Scale className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">NSG Legal</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-4 border border-indigo-100">
                        <Gavel className="w-3 h-3" />
                        Acuerdo de Licencia
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Condiciones del <span className="text-indigo-600">Servicio</span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                        Al utilizar <strong>BS Intelligence</strong> y los servicios de <strong>Next Strategy Group (NSG)</strong>, aceptas estos términos. Nuestra misión es potenciar tu estrategia mediante IA, bajo un marco de responsabilidad mutua.
                    </p>
                    <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
                        <span>Última actualización: {lastUpdate}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>Lectura de 8 min</span>
                    </div>
                </header>

                <div className="grid gap-8">
                    {/* 1. Descripción */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <FileCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">1. Definición del Servicio</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            NSG proporciona una plataforma de inteligencia estratégica que incluye el procesamiento de documentos, automatización de tareas vía n8n, asistencia por bots de Telegram y análisis prospectivo mediante modelos de lenguaje de gran escala (LLM).
                        </p>
                    </section>

                    {/* 2. Suscripciones */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">2. Suscripciones y Pagos</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                El acceso a planes avanzados (Estratega, Enterprise) se rige por suscripciones gestionadas a través de <strong>Stripe</strong>.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Facturación Automática:</strong> Las suscripciones se renuevan automáticamente al final de cada periodo.</li>
                                <li><strong>Cancelación:</strong> Puedes cancelar en cualquier momento desde tu panel de facturación. La cancelación tendrá efecto al final del periodo pagado.</li>
                                <li><strong>Reembolsos:</strong> Debido a los costos operativos de procesamiento de IA, generalmente no se ofrecen reembolsos por periodos ya iniciados.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. IA y Responsabilidad */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">3. Limitaciones de la IA</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                El usuario reconoce que los resultados generados por IA pueden contener imprecisiones o "alucinaciones".
                            </p>
                            <div className="p-4 bg-amber-50 rounded-xl text-amber-900 text-sm">
                                <strong>Importante:</strong> BS Intelligence es una herramienta de asistencia estratégica. Las decisiones finales basadas en los análisis del sistema son responsabilidad exclusiva del usuario. No garantizamos precisión absoluta en el procesamiento de datos complejos.
                            </div>
                        </div>
                    </section>

                    {/* 4. Propiedad de Datos */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">4. Propiedad Intelectual</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                <strong>Tus Datos:</strong> Mantienes la propiedad total sobre los documentos y el contenido que subes a la plataforma.
                            </p>
                            <p>
                                <strong>Nuestra Tecnología:</strong> NSG retiene todos los derechos sobre los algoritmos, interfaces, códigos fuente y metodologías propietarias utilizadas en BS Intelligence.
                            </p>
                        </div>
                    </section>

                    {/* 5. Uso Prohibido */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">5. Uso No Autorizado</h2>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Prohibido el uso de la plataforma para fines ilegales o para infringir derechos de terceros.</li>
                            <li>No se permite el "scraping" masivo o intentos de ingeniería inversa de nuestros procesos de IA.</li>
                            <li>La cuenta es personal e intransferible; el uso compartido de credenciales puede resultar en la suspensión del servicio.</li>
                        </ul>
                    </section>
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-200 text-center">
                    <p className="text-slate-400 text-sm">
                        &copy; 2026 Next Strategy Group. Si tienes dudas legales, contáctanos en <a href="mailto:iagents.nsg@gmail.com" className="hover:text-indigo-600 underline">iagents.nsg@gmail.com</a>
                    </p>
                </footer>
            </main>
        </div>
    );
}

