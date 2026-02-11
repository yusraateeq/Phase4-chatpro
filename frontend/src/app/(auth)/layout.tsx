/**
 * Authentication layout with Split "Kinetic" Design.
 * Left: Auth Form
 * Right: Animated Brand Showcase
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-black overflow-hidden font-sans">
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 relative flex flex-col justify-center items-center p-6 lg:p-12 z-20">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden mb-8">
          <Logo size={60} className="text-primary" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {children}
        </div>

        <div className="mt-8 text-center text-xs text-white/30 font-mono">
          <p>SECURE CHANNEL RE-ESTABLISHED</p>
          <p>V 2.5.0 // INDUSTRIAL BUILD</p>
        </div>
      </div>

      {/* RIGHT SIDE - SHOWCASE (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 justify-center items-center overflow-hidden border-l border-white/5">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black" />

        <div className="relative z-10 flex flex-col items-center text-center p-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12 relative"
          >
            {/* Massive Logo */}
            <div className="relative z-10">
              <Logo size={300} className="text-primary drop-shadow-[0_0_50px_rgba(234,88,12,0.3)]" />
            </div>

            {/* Decorative Rings behind logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-orange-500/10 rounded-full border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-orange-500/5 rounded-full"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
              Forge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Legacy</span>
            </h2>
            <p className="text-lg text-white/50 max-w-sm mx-auto font-light leading-relaxed">
              Join the elite builders. Industrial productivity for high-performance teams.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
