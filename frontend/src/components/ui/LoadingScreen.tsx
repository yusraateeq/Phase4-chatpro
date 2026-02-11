"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [isMounted, setIsMounted] = useState(false);
    const text = "TODO PRO";
    const letters = text.split("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Define flying-in directions for each character
    const getInitialProps = (index: number) => {
        const directions = [
            { x: -500, y: 0 },    // Left
            { x: 0, y: -500 },    // Top
            { x: 500, y: 0 },     // Right
            { x: 0, y: 500 },     // Bottom
            { x: -400, y: -400 }, // Top-Left
            { x: 400, y: -400 },  // Top-Right
            { x: -400, y: 400 },  // Bottom-Left
            { x: 400, y: 400 },   // Bottom-Right
        ];
        return directions[index % directions.length];
    };

    if (!isMounted) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#030014] text-white relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />

            <div className="relative z-10 flex flex-col items-center gap-12">
                {/* Logo Reveal First */}
                <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                    }}
                >
                    <Logo size={140} className="text-primary drop-shadow-[0_0_30px_rgba(var(--primary),0.3)]" />
                </motion.div>

                {/* Flying Letters Animation */}
                <div className="flex items-center justify-center overflow-hidden h-20">
                    <div className="flex">
                        {letters.map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{
                                    opacity: 0,
                                    ...getInitialProps(i),
                                    rotate: Math.random() * 360 - 180
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    rotate: 0
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.5 + (i * 0.1), // Starts after logo reveal
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 12
                                }}
                                className={`text-5xl md:text-7xl font-black tracking-tight ${char === " " ? "w-6 md:w-10" : "bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 px-0.5"
                                    }`}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Action Status */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="h-1.5 w-6 rounded-full bg-primary/30 overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-primary w-full"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                        Establishing Dynamic Connection
                    </p>
                </motion.div>
            </div>

            {/* Branded Watermark */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.8em]"
            >
                <span>Secure</span>
                <div className="h-1 w-1 rounded-full bg-white" />
                <span>Optimized</span>
                <div className="h-1 w-1 rounded-full bg-white" />
                <span>Manifested</span>
            </motion.div>
        </main>
    );
}
