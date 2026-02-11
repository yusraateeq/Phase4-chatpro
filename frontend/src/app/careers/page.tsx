"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket, Code, Brush, BarChart } from "lucide-react";

export default function CareersPage() {
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="text-center mb-24">
                        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">Forge the <span className="text-primary italic">Future</span></h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                            We are looking for elite pioneers to join our collective. Do you have what it takes to architect the next-gen manifestation suite?
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {[
                            { role: "Core Protocol Engineer", icon: <Code />, team: "Infrastructure", type: "Remote" },
                            { role: "Visual Experience Architect", icon: <Brush />, team: "Design", type: "Hybrid" },
                            { role: "Growth Manifestation Lead", icon: <Rocket />, team: "Operations", type: "Remote" },
                            { role: "Data Flow Analyst", icon: <BarChart />, team: "Dynamics", type: "Remote" }
                        ].map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between group hover:bg-white/5 transition-all"
                            >
                                <div className="flex items-center gap-6 mb-4 md:mb-0">
                                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        {job.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{job.role}</h3>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-xs uppercase tracking-widest text-primary/70">{job.team}</span>
                                            <span className="text-xs uppercase tracking-widest text-white/20">{job.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 font-bold px-8 h-12 rounded-xl">
                                    Manifest Application
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-32 text-center glass p-16 rounded-[4rem] border border-primary/20">
                        <h2 className="text-3xl font-bold mb-6 italic">Don't see your resonance?</h2>
                        <p className="text-white/40 mb-10 max-w-xl mx-auto">
                            We're always open to unexpected talent. Send us your manifestation of how you can impact Todo Pro.
                        </p>
                        <Button variant="outline" className="h-14 px-12 border-white/10 text-lg hover:bg-primary/10 hover:text-primary transition-all">
                            General Transmission
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
