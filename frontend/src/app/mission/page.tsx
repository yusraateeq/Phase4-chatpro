"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Globe, Heart } from "lucide-react";

export default function MissionPage() {
    return (
        <div className="min-h-screen bg-[#030014] text-white selection:bg-primary/30 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
            </div>

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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <Logo size={80} className="text-primary mx-auto mb-8" />
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase italic">Our Mission</h1>

                    <div className="grid gap-8">
                        {[
                            {
                                icon: <Target className="h-10 w-10 text-primary" />,
                                title: "Precision Execution",
                                desc: "Our mission is to provide the tools necessary for precise goal execution. We eliminate the friction between thought and action."
                            },
                            {
                                icon: <Globe className="h-10 w-10 text-primary" />,
                                title: "Global Synergy",
                                desc: "Connecting 2 million+ tasks into a global network of productivity, empowering individuals across 120 countries."
                            },
                            {
                                icon: <Heart className="h-10 w-10 text-primary" />,
                                title: "Human Potential",
                                desc: "We believe in the untapped potential of every human being. Todo Pro is the catalyst for that eruption of progress."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="glass p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 text-left"
                            >
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                                    {item.icon}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold">{item.title}</h3>
                                    <p className="text-white/50 text-lg leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
