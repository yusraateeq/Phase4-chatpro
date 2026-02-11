"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, ApiError } from "@/lib/api";
import { toast } from "sonner";

interface AuthFormProps {
  mode: "login" | "register";
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const isLogin = mode === "login";
  const title = isLogin ? "Access Terminal" : "New Operator";
  const description = isLogin ? "Initialize Session" : "Register Bio-Data";
  const submitText = isLogin ? "Initialize" : "Register";
  const switchText = isLogin ? "No clearance?" : "Already verified?";
  const switchLink = isLogin ? "/register" : "/login";
  const switchLinkText = isLogin ? "Request Access" : "Log In";

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "REQUIRED";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "INVALID PATTERN";

    if (!password) newErrors.password = "REQUIRED";
    else if (!isLogin && password.length < 8) newErrors.password = "MIN LENGTH 8";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await authApi.login({ email, password });
        toast.success("ACCESS GRANTED");
      } else {
        await authApi.register({ email, password });
        toast.success("ID CREATED");
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      const detail = error instanceof ApiError ? error.data?.detail : "CONNECTION FAIL";
      setErrors({ general: detail });
      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl relative overflow-hidden group"
    >
      {/* Animated Glow Border Effect */}
      <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-primary origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">{title}</h1>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-sm font-mono text-white/50 uppercase tracking-widest">{description}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Operator ID</Label>
          <div className="relative">
            <Input
              type="email"
              placeholder="ID@SYSTEM.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-black/50 h-14 border-white/10 text-white font-mono placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase pl-4"
            />
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-white/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white/30 pointer-events-none" />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1"
              >
                // {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Security Key</Label>
          <div className="relative">
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-black/50 h-14 border-white/10 text-white font-mono placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary transition-all pl-4"
            />
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-white/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white/30 pointer-events-none" />
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1"
              >
                // {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {errors.general && (
          <motion.div
            variants={itemVariants}
            className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-wide"
          >
            ⚠ SYSTEM ALERT: {errors.general}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="pt-4">
          <Button
            type="submit"
            className="w-full h-16 bg-white text-black hover:bg-primary hover:text-white text-lg font-black uppercase tracking-widest transition-all duration-300 rounded-none relative overflow-hidden group/btn"
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? "PROCESSING..." : submitText} {isLoading ? "" : "→"}
            </span>
            {/* Hover Fill Effect */}
            <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0" />
          </Button>

          <div className="mt-6 flex justify-between items-center text-xs text-white/40 font-mono uppercase">
            <span>{switchText}</span>
            <a href={switchLink} className="text-primary hover:text-white transition-colors underline decoration-dotted underline-offset-4">
              {switchLinkText}
            </a>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
