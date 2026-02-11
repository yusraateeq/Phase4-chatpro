"use client";

import { motion } from "framer-motion";
import { Hammer, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Loading() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
            {/* Background Embers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,80,0,0.05),transparent_60%)]" />
                <div className="absolute bottom-0 left-[20%] w-2 h-2 bg-orange-500 rounded-full animate-ember opacity-0" />
                <div className="absolute bottom-0 left-[40%] w-3 h-3 bg-red-500 rounded-full animate-ember opacity-0 animation-delay-2000" />
                <div className="absolute bottom-0 left-[60%] w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ember opacity-0 animation-delay-4000" />
                <div className="absolute bottom-0 left-[80%] w-2.5 h-2.5 bg-orange-400 rounded-full animate-ember opacity-0 animation-delay-2000" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-12">
                {/* Hammer Animation */}
                <div className="relative">
                    <motion.div
                        initial={{ rotate: -45 }}
                        animate={{ rotate: 45 }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }}
                        className="text-primary drop-shadow-[0_0_20px_rgba(255,80,0,0.4)]"
                    >
                        <Hammer size={120} />
                    </motion.div>

                    {/* Impact Spark */}
                    <motion.div
                        className="absolute -right-8 top-0 text-yellow-300"
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, times: [0.4, 0.5, 0.6] }}
                    >
                        <Sparkles size={40} />
                    </motion.div>
                </div>

                {/* Forging Text */}
                <div className="flex flex-col items-center gap-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tighter uppercase text-magma"
                    >
                        Forging Workspace
                    </motion.h2>

                    {/* Molten Progress Bar */}
                    <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden border border-border/20">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-yellow-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.5, ease: "linear" }}
                            style={{ boxShadow: "0 0 10px rgba(255, 80, 0, 0.5)" }}
                        />
                    </div>
                </div>

                {/* Status Items */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground"
                >
                    <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Tempering Assets...
                    </motion.span>
                </motion.div>
            </div>

            {/* Footer Watermark */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground"
            >
                Industrial Standard
            </motion.div>
        </main>
    );
}
