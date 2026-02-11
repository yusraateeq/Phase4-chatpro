"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className, size = 40 }: LogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            >
                {/* Outer Orbiting Ring */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="60 220"
                    className="text-primary/40 animate-[spin_3s_linear_infinite]"
                />

                {/* Inner Orbiting Arc */}
                <path
                    d="M90 50C90 72.0914 72.0914 90 50 90C27.9086 90 10 72.0914 10 50"
                    stroke="url(#logo-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-[pulse_2s_ease-in-out_infinite]"
                />

                {/* Central Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="32"
                    fill="url(#logo-gradient)"
                    className="animate-[pulse_4s_ease-in-out_infinite]"
                />

                {/* Checkmark */}
                <path
                    d="M38 50L46 58L62 42"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[check-draw_1.5s_ease-out_forwards]"
                    style={{
                        strokeDasharray: 40,
                        strokeDashoffset: 0,
                    }}
                />

                <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="hsla(263, 70%, 55%, 1)" />
                        <stop offset="1" stopColor="hsla(250, 50%, 40%, 1)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse" />

            <style jsx>{`
        @keyframes check-draw {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
        </div>
    );
}
