"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Palette } from "lucide-react";

export default function BrandPage() {
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter">Brand Foundation</h1>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Logo Assets */}
                        <div className="glass p-10 rounded-3xl space-y-8">
                            <div className="flex items-center gap-3 text-primary uppercase tracking-[0.2em] font-bold text-xs">
                                <Logo size={16} /> Identity Assets
                            </div>
                            <div className="h-60 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-12 group relative overflow-hidden">
                                <Logo size={120} className="text-primary cursor-pointer hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-xl mb-1">Primary Manifest Logo</h3>
                                    <p className="text-sm text-white/40">Vector SVG Format</p>
                                </div>
                                <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                                    <Download className="h-4 w-4 mr-2" /> Download
                                </Button>
                            </div>
                        </div>

                        {/* Design System */}
                        <div className="glass p-10 rounded-3xl space-y-8">
                            <div className="flex items-center gap-3 text-primary uppercase tracking-[0.2em] font-bold text-xs">
                                <Palette className="h-4 w-4" /> Visual Spectrum
                            </div>
                            <div className="grid grid-cols-2 gap-4 h-60">
                                <div className="rounded-2xl bg-[#030014] border border-white/10 flex flex-col justify-end p-4">
                                    <span className="text-xs font-bold text-white/30 tracking-widest">DEEP SPACE</span>
                                    <span className="text-xs font-mono text-white/60">#030014</span>
                                </div>
                                <div className="rounded-2xl bg-primary border border-white/10 flex flex-col justify-end p-4">
                                    <span className="text-xs font-bold text-black/30 tracking-widest">NEON PULSE</span>
                                    <span className="text-xs font-mono text-black/60">PRIMARY</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-1">Color Palette</h3>
                                <p className="text-sm text-white/40">Tokens for UI Consistency</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
