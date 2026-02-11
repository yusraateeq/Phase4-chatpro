"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Server, Cpu, Globe } from "lucide-react";

export default function VitalsPage() {
    return (
        <div className="min-h-screen bg-[#030014] text-white selection:bg-primary/30 relative overflow-hidden">
            <nav className="container mx-auto px-4 py-8 relative z-50">
                <Link href="/">
                    <Button variant="ghost" className="gap-2 text-white/60 hover:text-white hover:bg-white/5">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </nav>

            <main className="container mx-auto px-4 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="flex items-center justify-between mb-16">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">System Vitals</h1>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-xs uppercase tracking-widest animate-pulse">
                            All Systems Operational
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { label: "Cosmic Cloud Edge", value: "99.99%", icon: <Server className="h-5 w-5" />, sub: "Global Availability" },
                            { label: "Manifestation Latency", value: "14ms", icon: <Cpu className="h-5 w-5" />, sub: "Average Response Time" },
                            { label: "Secure Handshake", value: "100%", icon: <Activity className="h-5 w-5" />, sub: "JWT Validation Success" },
                            { label: "Network Propagation", value: "Green", icon: <Globe className="h-5 w-5" />, sub: "Multi-Region Sync" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-10 rounded-[2.5rem] group hover:border-primary/30 transition-all border-white/5"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-white/5 text-white/40 group-hover:text-primary transition-colors">
                                        {stat.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{stat.sub}</span>
                                </div>
                                <h3 className="text-sm font-bold text-white/40 mb-2 uppercase tracking-widest">{stat.label}</h3>
                                <p className="text-5xl font-black text-white group-hover:text-primary transition-colors italic">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 glass p-8 rounded-2xl border-white/5 overflow-hidden relative">
                        <div className="flex items-center gap-4 text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">
                            <Activity className="h-3 w-3" /> Historical Pulse
                        </div>
                        <div className="h-20 w-full flex items-end gap-1">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 bg-primary/20 rounded-t-sm"
                                    animate={{ height: [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 70}%`, `${20 + Math.random() * 60}%`] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
