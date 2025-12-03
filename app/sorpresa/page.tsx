"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin, IconCoffee, IconDeviceDesktop, IconFileText, IconSchool, IconHeart, IconCertificate } from '@tabler/icons-react';

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(from);

    useEffect(() => {
        const controls = animate(count, to, { duration, ease: "easeOut" });
        return controls.stop;
    }, [count, to, duration]);

    useEffect(() => {
        const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
        return unsubscribe;
    }, [rounded]);

    return <span>{displayValue}</span>;
}

export default function SorpresaPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden py-12">
            {/* Background Grid & USAL Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
                {/* Enhanced USAL Background: Green, White, Gold */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00A859]/20 via-transparent to-[#0a0a0a]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#FFD700]/10 via-transparent to-[#00A859]/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
            </div>

            {/* USAL Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00A859]/10 rounded-full blur-[120px]" />

            <div className="relative z-10 max-w-6xl w-full flex flex-col items-center">

                {/* Header Section */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    {/* USAL Logo */}
                    <div className="mb-8 p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <Image
                            src="/images/usal_logo.png"
                            alt="USAL Logo"
                            width={300}
                            height={100}
                            className="h-auto w-auto object-contain"
                        />
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-white drop-shadow-2xl tracking-tight">
                        Proyecto Final de Ingeniería
                    </h1>
                    <p className="text-2xl text-yellow-500/90 font-light tracking-widest uppercase mb-8">
                        Informática • 2025
                    </p>

                    {/* Acknowledgments */}
                    <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <p className="text-xl text-gray-200 leading-relaxed uppercase font-medium tracking-wide">
                            AGRADECIMIENTO ESPECIAL A <strong className="text-[#FFD700] font-bold">ESTEBAN TISSERA</strong>, PILAR CLAVE EN ESTE RECORRIDO.
                            <br />
                            Y A TODOS LOS PRESENTES POR ACOMPAÑARNOS HOY.
                        </p>
                    </div>
                </motion.div>

                {/* Fun Facts Grid (Creative) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 w-full px-4">
                    {[
                        { icon: IconFileText, label: 'Versiones de "Tesis_Final"', value: 47, bgClass: 'bg-blue-500/10', textClass: 'text-blue-400', delay: 0.2 },
                        { icon: IconDeviceDesktop, label: 'Horas hablando con la IA', value: 210, bgClass: 'bg-purple-500/10', textClass: 'text-purple-400', delay: 0.3 },
                        { icon: IconCoffee, label: 'Cafés consumidos', value: 452, bgClass: 'bg-amber-500/10', textClass: 'text-amber-500', delay: 0.4 },
                        { icon: IconCertificate, label: 'Ganas de recibirme', value: 100, suffix: '%', bgClass: 'bg-green-500/10', textClass: 'text-green-500', delay: 0.5 },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: item.delay, type: "spring" }}
                            className="bg-[#111] backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-yellow-500/30 transition-all group text-center shadow-lg"
                        >
                            <div className={`mx-auto w-14 h-14 rounded-xl ${item.bgClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`h-7 w-7 ${item.textClass}`} />
                            </div>
                            <div className="text-4xl font-bold text-white mb-2 tabular-nums">
                                <Counter from={0} to={item.value} />{item.suffix}
                            </div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{item.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Contact / Links */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center gap-6"
                >
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-yellow-500/30 transition-all cursor-pointer group">
                        <IconBrandLinkedin className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-base text-white/90">/in/santinomassera</span>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-yellow-500/30 transition-all cursor-pointer group">
                        <IconBrandGithub className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                        <span className="text-base text-white/90">github.com/santinomassera1</span>
                    </div>
                </motion.div>

                {/* Footer - Fixed Overlap */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-16 flex justify-center"
                >
                    <div className="flex items-center gap-2 text-white/30 text-xs font-light uppercase tracking-widest">
                        Hecho con <IconHeart className="h-3 w-3 text-red-600 fill-red-600 animate-pulse" /> para la USAL
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
