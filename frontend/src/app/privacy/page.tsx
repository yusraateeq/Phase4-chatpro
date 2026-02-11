"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock } from "lucide-react";

export default function PrivacyPage() {
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <Shield className="h-12 w-12 text-primary" />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Privacy Manifest</h1>
                    </div>

                    <div className="space-y-8">
                        <div className="glass p-10 rounded-[2.5rem] border-primary/20">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <Lock className="h-5 w-5 text-primary" /> Cryptographic Integrity
                            </h2>
                            <p className="text-white/50 leading-relaxed">
                                Your data is encrypted at rest and in transit using industry-standard AES-256 protocols. We do not "own" your manifests; we merely provide the conduit for their realization.
                            </p>
                        </div>

                        <div className="glass p-10 rounded-[2.5rem]">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <Eye className="h-5 w-5 text-primary" /> Zero Surveillance
                            </h2>
                            <p className="text-white/50 leading-relaxed">
                                Todo Pro operates on a zero-knowledge architecture. Your task descriptions and personal objectives are never parsed by AI for advertising or data brokerage purposes.
                            </p>
                        </div>

                        <div className="glass p-10 rounded-[2.5rem]">
                            <h3 className="text-xl font-bold mb-4">Data Retention Logic</h3>
                            <p className="text-white/40 text-sm italic">
                                Manifests are retained as long as your account remains in an active lifecycle. Upon transmission of a deletion request, all associated cosmic nodes are purged within 72 hours.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
