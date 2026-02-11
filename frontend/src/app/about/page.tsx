"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Zap, Shield } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#030014] text-white selection:bg-primary/30 relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
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
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <Logo size={48} className="text-primary" />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">About Visionaries</h1>
                    </div>

                    <div className="glass p-12 rounded-[3rem] space-y-8 leading-relaxed text-lg text-white/70">
                        <p>
                            Todo Pro was founded not as a mere application, but as a <span className="text-white font-bold">manifestation engine</span> for those who refuse to settle for mediocrity. Our team of visionaries believes that every thought is a seed, and every task recorded is a step toward realization.
                        </p>
                        <p>
                            We are obsessed with performance, security, and the psychology of focus. In a world of digital noise, Todo Pro is the frequency of clarity.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 pt-8">
                            {[
                                { icon: <Zap className="h-5 w-5" />, title: "Hyper-Focused", desc: "No distractions. Only your goals." },
                                { icon: <Shield className="h-5 w-5" />, title: "Absolute Isolation", desc: "Your data is your sanctuary." },
                                { icon: <Users className="h-5 w-5" />, title: "Community Driven", desc: "Built for visionaries, by visionaries." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="text-primary">{item.icon}</div>
                                    <h4 className="font-bold text-white">{item.title}</h4>
                                    <p className="text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
