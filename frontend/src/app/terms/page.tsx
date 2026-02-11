"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gavel, Zap, Target } from "lucide-react";

export default function TermsPage() {
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
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-6xl md:text-8xl font-black mb-16 tracking-tighter italic">Terms of Focus</h1>

                    <div className="grid gap-12">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 uppercase tracking-widest">
                                <Zap className="h-5 w-5" /> 01. Optimal Use
                            </h2>
                            <p className="text-white/60 leading-relaxed text-lg">
                                By entering the Todo Pro workspace, you commit to the pursuit of high-performance execution. Misuse of the Manifestation Engine for trivial or malicious intent is discouraged.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 uppercase tracking-widest">
                                <Target className="h-5 w-5" /> 02. Account Fidelity
                            </h2>
                            <p className="text-white/60 leading-relaxed text-lg">
                                You are responsible for the security of your access tokens. Sharing cosmic credentials compromises the isolation of your manifestation environment.
                            </p>
                        </section>

                        <section className="glass p-12 rounded-[3.5rem] border-white/5">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white/40">
                                <Gavel className="h-5 w-5" /> Protocol Amendment
                            </h3>
                            <p className="text-white/30 text-sm">
                                These terms are subject to dynamic evolution. Continued use of the platform after an update constitutes acceptance of the new focus parameters.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
