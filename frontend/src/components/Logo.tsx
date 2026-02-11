"use client";

import { motion } from "framer-motion";

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className, size = 40 }: LogoProps) {
    return (
        <div className={className} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="premium-gradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#EA580C" /> {/* Orange-600 */}
                        <stop offset="1" stopColor="#DC2626" /> {/* Red-600 */}
                    </linearGradient>
                </defs>

                {/* Precision Orbit Ring - Slow, Elegant Rotation */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    strokeOpacity="0.4"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 30, // Very slow "Precision" speed
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ originX: "50px", originY: "50px" }}
                />

                {/* Main Hexagon Body - Breathing Pulse */}
                <motion.path
                    d="M50 8 L90 32 V78 L50 102 L10 78 V32 L50 8Z"
                    fill="url(#premium-gradient)"
                    initial={{ opacity: 0.9, scale: 0.95 }}
                    animate={{
                        opacity: [0.9, 1, 0.9],
                        scale: [0.95, 1, 0.95]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ originX: "50px", originY: "55px", translateY: "-5px" }}
                />

                {/* Inner Hexagon Detail - Static Stability */}
                <path
                    d="M50 18 L80 36 V74 L50 92 L20 74 V36 L50 18Z"
                    stroke="white"
                    strokeOpacity="0.15"
                    strokeWidth="1.5"
                    fill="none"
                />

                {/* The Checkmark - Clean Entry */}
                <motion.path
                    d="M34 52 L46 64 L66 38"
                    stroke="white"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                />
            </svg>
        </div>
    );
}
