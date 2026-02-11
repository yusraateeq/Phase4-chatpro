"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { authApi } from "@/lib/api";
import Loading from "./loading";
import { Logo } from "@/components/Logo";
import { Task } from "@/types/task";
import { toast } from "sonner";
import {
  LogOut,
  ArrowRight,
  Shield,
  Zap,
  Hammer,
  Flame,
  Terminal
} from "lucide-react";

// Animation Constants
const BOOT_SEQUENCE: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const HUD_ITEM: Variants = {
  hidden: { opacity: 0, y: -20, scaleY: 0 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

const PANEL_REVEAL: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "circOut" }
  }
};

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");

    if (token) {
      setIsAuthenticated(true);
    }

    // Force a minimum loading screen for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Reduced slightly from 4s for better UX

    // Parallax Effect Handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("SESSION TERMINATED");
      setIsAuthenticated(false);
      router.refresh();
    } catch {
      authApi.logout();
      setIsAuthenticated(false);
      router.refresh();
    }
  };

  const handleTaskCreated = (_task: Task) => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Authenticated - Show Tasks Dashboard
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-neutral-950 text-foreground relative overflow-hidden font-sans selection:bg-primary/30 selection:text-white perspective-[2000px]">

        {/* Living Background Layer */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Drifting Embers */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              initial={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
                opacity: 0
              }}
              animate={{
                y: [null, Math.random() * -100 + "vh"],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
          ))}

          {/* Ambient Nebulas - Minimized */}
          <motion.div
            animate={{
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[150px] rounded-full mix-blend-screen"
          />

          {/* Holographic Grid */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.01] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

          {/* Scanning Line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[2px] bg-primary/10 blur-[2px]"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Dashboard Navbar - Reverted to Pre-login style */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 container mx-auto px-4 py-6"
        >
          <nav className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-md rounded-lg border border-border/50 shadow-lg">
            <div className="flex items-center gap-3">
              <Logo size={36} className="text-primary animate-flicker" />
              <span className="text-xl font-bold tracking-tight">Todo Pro</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/chat">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 transition-all font-bold"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  AI Chat
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-green-500 font-bold uppercase">Online</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </motion.header>

        {/* Main Interface - Parallax Container */}
        <motion.main
          initial="hidden"
          animate="visible"
          variants={BOOT_SEQUENCE}
          className="container mx-auto px-4 py-8 relative z-10"
        >
          <div className="max-w-7xl mx-auto">

            {/* Simple Dashboard Title */}
            <motion.div
              variants={HUD_ITEM}
              className="mb-10 text-center"
            >
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">Dashboard</span>
              </h1>
              <p className="text-white/40 text-sm font-medium">
                Manage your objectives and maintain focus.
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-12 items-start perspective-[1000px]">

              {/* Left Panel: Task Grid */}
              <motion.div
                variants={PANEL_REVEAL}
                style={{
                  x: mousePos.x * -0.5,
                  y: mousePos.y * -0.5,
                  rotateX: mousePos.y * 0.05,
                  rotateY: mousePos.x * -0.05
                }}
                className="lg:col-span-8 order-2 lg:order-1 h-full"
              >
                <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden min-h-[550px] flex flex-col shadow-2xl transition-all duration-500">
                  {/* Panel Header */}
                  <div className="h-14 bg-gradient-to-r from-orange-900/30 to-transparent flex items-center px-6">
                    <span className="text-sm font-bold text-white uppercase tracking-widest">
                      Active Tasks
                    </span>
                  </div>

                  {/* Panel Content (refined layout only, colors unchanged) */}
                  <div className="p-2 flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-3 text-sm text-white/60">
                      <div className="font-mono text-xs font-bold">1 TASK</div>
                      <div className="font-mono text-xs font-bold text-orange-400">0 COMPLETED</div>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <div className="space-y-4">
                        <TaskList key={refreshTrigger} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Panel: Input & Info */}
              <motion.div
                variants={PANEL_REVEAL}
                style={{
                  x: mousePos.x * -1,
                  y: mousePos.y * -1,
                  rotateX: mousePos.y * 0.1,
                  rotateY: mousePos.x * -0.1
                }}
                className="lg:col-span-4 order-1 lg:order-2 flex flex-col gap-6"
              >

                {/* Input Module */}
                <div className="relative rounded-3xl border border-orange-600/30 bg-gradient-to-br from-neutral-900/60 to-black/30 overflow-hidden backdrop-blur-xl shadow-xl">
                  <div className="p-1">
                    <div className="relative rounded-2xl p-6 bg-neutral-900/60 border border-orange-600/20">
                      <div className="absolute -top-3 left-6 px-3 py-1 bg-black/60 rounded-full text-xs font-bold text-orange-300 uppercase tracking-wider">[ COMMAND_CENTER ]</div>

                      <div className="mt-6 space-y-4">
                        <div className="p-4 bg-black/20 border border-white/5 rounded-lg font-mono text-sm text-white/60">&gt; [ INPUT_OBJECTIVE ]</div>
                        <div className="p-4 bg-black/10 border border-white/6 rounded-lg font-mono text-sm text-white/60">&gt; [ CONTEXT_FLOW ]</div>

                        <div className="pt-2">
                          <TaskForm onTaskCreated={handleTaskCreated} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Module */}
                <div className="space-y-4">
                  <div className="p-5 border border-white/5 bg-white/5 rounded-2xl backdrop-blur-md">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Encrypted Link</h3>
                        <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                          All data is stored in your private cloud mainframe with industrial security.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                      FORGED_BY_Yusra
                    </p>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>
    );
  }

  // Not authenticated - Show Landing Page
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white relative overflow-hidden">
      {/* MAGMA FOUNDRY - High Intensity Living Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-neutral-950 overflow-hidden">
        {/* Layer 1: Base Grid - Slowly Panning */}
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "0px 100px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 100, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 100, 0, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        {/* Layer 2: Moving Magma Plumes (Heat Haze) */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-red-600/20 blur-[150px] rounded-full mix-blend-screen"
        />

        {/* Layer 3: Rising Welding Sparks (Intense) */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-yellow-400 rounded-full box-shadow-glow"
            style={{ width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px' }}
            initial={{
              x: Math.random() * 100 + "vw",
              y: 110 + "vh",
              opacity: 1
            }}
            animate={{
              y: -10 + "vh",
              opacity: [1, 1, 0],
              x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 200}px)`
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Layer 4: Vignette & Scanlines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] pointer-events-none z-20" />
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 container mx-auto px-4 py-6"
      >
        <nav className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-md rounded-lg border border-border/50">
          <div className="flex items-center gap-3">
            <Logo size={36} className="text-primary animate-flicker" />
            <span className="text-xl font-bold tracking-tight">Todo Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 shadow text-primary-foreground font-bold">
                Start Building
              </Button>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center pt-20 pb-32">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Static Glow replacing complex lightning */}
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/30 border border-orange-500/20 text-sm font-bold text-primary mb-8"
          >
            <Flame className="h-4 w-4 animate-flicker" />
            <span>Industrial Grade Productivity</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1] uppercase"
          >
            Forge Your <br />
            <span className="text-magma">Legacy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Raw power for your tasks. Built for those who build. No fluff, just pure functional output.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/register">
              <Button size="lg" className="text-lg font-bold gap-2">
                Start Forging
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg font-bold">
                View Blueprint
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-40 w-full max-w-7xl">
          {[
            {
              icon: <Hammer className="h-6 w-6" />,
              title: "Hardened Tasks",
              desc: "Indestructible task management for high-load workflows."
            },
            {
              icon: <Zap className="h-6 w-6" />,
              title: "High Voltage",
              desc: "Powered by Next.js 16 for instant state updates."
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Ironclad Privacy",
              desc: "Military specs for your data security."
            },
            {
              icon: <Terminal className="h-6 w-6" />,
              title: "AI Command Hub",
              desc: "Manage everything through natural language with our integrated AI agent."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(255,100,0,0.15)] transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="relative z-10 text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">{feature.title}</h3>
              <p className="relative z-10 text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-40 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Tasks Forged", value: "2M+" },
              { label: "Builders", value: "50K+" },
              { label: "Uptime", value: "99.9%" },
              { label: "Global Sites", value: "120+" }
            ].map((stat, i) => (
              <div key={i} className="text-center group p-6 border border-transparent hover:border-border/30 rounded-lg transition-colors">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl md:text-5xl font-black mb-2 text-magma group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Testimonials */}
        <div className="mt-40 w-full max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase mb-4 text-orange-500">Site Reports</h2>
            <p className="text-muted-foreground font-mono">Feedback from the frontline.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Industrial Designer", quote: "No distractions. Just pure output. It's the only tool that keeps up with my pace." },
              { name: "Marcus Thorne", role: "Site Manager", quote: "Solid as a rock. Managing my team's load has never been this straightforward." },
              { name: "Aria Voss", role: "Chief Engineer", quote: "The reliability is unmatched. It feels like a power tool for my mind." }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="ember-card p-10 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl font-serif text-primary">"</div>
                <p className="text-lg italic text-muted-foreground mb-8 font-medium relative z-10">"{t.quote}"</p>
                <div className="relative z-10">
                  <p className="font-bold text-foreground mb-1">{t.name}</p>
                  <p className="text-sm text-primary font-bold uppercase tracking-wide">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        {/* Final CTA - Premium Glass Magma */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 mb-20 w-full max-w-5xl mx-auto px-4"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-orange-900/20 via-black/50 to-black/80 backdrop-blur-2xl">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 p-12 md:p-24 text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-0 tracking-tight leading-tight text-white">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 shadow-glow">Ignite?</span>
              </h2>
              <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the elite guild of high-performance creators. Your legacy begins when you hit the button.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 text-lg shadow-[0_0_30px_rgba(255,80,0,0.3)] hover:shadow-[0_0_50px_rgba(255,80,0,0.5)]">
                    Initialize Project
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="ghost" className="h-14 px-10 text-lg hover:bg-white/5 text-white/70">
                    Access Terminal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      {/* Footer - Minimalist Industrial */}
      <footer className="relative z-10 border-t border-white/10 bg-black pt-20 pb-10">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">

          <div className="mb-8 p-4 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            <Logo size={40} className="text-orange-500" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Todo Pro</h3>
          <p className="text-white/40 max-w-md mx-auto mb-10 text-sm leading-relaxed">
            Forging the future of productivity. Built for those who demand precision, power, and absolute reliability.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-white/60 mb-12">
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Features</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Pricing</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors">System Status</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Terms</span>
          </div>

          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl text-xs text-white/30 px-4">
            <p>© {new Date().getFullYear()} Todo Pro Inc. All rights reserved.</p>

            <div className="flex items-center gap-2 mt-4 md:mt-0 px-3 py-1 rounded-full bg-white/5 border border-white/5">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="font-mono tracking-wider">SYSTEM OPTIMAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
