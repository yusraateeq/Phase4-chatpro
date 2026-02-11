"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MessageSquare, Headphones } from "lucide-react";

export default function HotlinePage() {
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.3em] mb-8">
                        <Headphones className="h-4 w-4" /> Support Protocol 01
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic">Direct Hotline</h1>
                    <p className="text-xl text-white/40 mb-16 max-w-2xl mx-auto font-medium">
                        Immediate transmission channels for technical anomalies or manifestation inquiries. We are here to ensure your flow remains uninterrupted.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { icon: <Mail className="h-6 w-6" />, label: "Email Transmission", value: "manifest@todo.pro", desc: "Response within 2 hours" },
                            { icon: <Phone className="h-6 w-6" />, label: "Audio Channel", value: "+1 (888) MANIFEST", desc: "Priority support for visionaries" },
                            { icon: <MessageSquare className="h-6 w-6" />, label: "Direct Sync", value: "Chat Interface", desc: "Instant digital liaison" }
                        ].map((channel, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="glass p-8 rounded-3xl border-white/5 space-y-6 group cursor-pointer"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                    {channel.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/20 mb-2">{channel.label}</h3>
                                    <p className="text-xl font-bold text-white mb-2">{channel.value}</p>
                                    <p className="text-xs text-white/40 font-medium">{channel.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20">
                        <Button className="h-16 px-12 bg-primary hover:bg-primary/90 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105">
                            Launch Direct Chat
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
