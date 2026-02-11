"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasksApi, ApiError } from "@/lib/api";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { Plus, Terminal, Activity, Loader2, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onTaskCreated?: (task: Task) => void;
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    general?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = ">> ERR: OBJECTIVE_REQUIRED";
    } else if (title.length > 200) {
      newErrors.title = ">> ERR: OVERFLOW_OBJECTIVE";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const task = await tasksApi.create({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      toast.success("STABILIZATION COMPLETE: TASK_UPLOADED");

      // Reset form
      setTitle("");
      setDescription("");

      if (onTaskCreated) {
        onTaskCreated(task);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ general: error.data?.detail || "ERROR: LINK_FAILURE" });
      } else {
        setErrors({ general: "ERROR: UNKNOWN_INTERFERENCE" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Inverted Apex Geometry (Slightly reduced for mobile)
  const CLIP_PATH = "polygon(0% 0%, calc(100% - 2rem) 0%, 100% 2rem, 100% 100%, 2rem 100%, 0% calc(100% - 2rem))";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="md:sticky md:top-24 w-full"
    >
      <div
        style={{ clipPath: CLIP_PATH }}
        className="glass-card bg-gradient-to-br from-primary/20 via-transparent to-white/5 p-[2px]"
      >
        <Card
          style={{ clipPath: CLIP_PATH }}
          className="bg-[#030014] border-none rounded-none shadow-none"
        >
          <CardHeader className="pb-6 md:pb-8 pt-8 md:pt-12 px-6 md:px-10 relative overflow-hidden">
            {/* Background Data Decals */}
            <div className="absolute top-4 right-6 md:right-10 text-[8px] md:text-[10px] font-mono text-white/5 pointer-events-none select-none">
              APEX_PRTCL_V2.0.4
              <br />
              SYS_STAT: ACTIVE
            </div>

            <CardTitle className="flex items-center gap-3 md:gap-4 text-xl md:text-2xl font-black tracking-tighter uppercase text-white font-mono">
              <span className="text-primary tracking-widest hidden sm:inline">[</span>
              <Activity className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse" />
              <span className="truncate">COMMAND_CENTER</span>
              <span className="text-primary tracking-widest hidden sm:inline">]</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 md:px-10 pb-8 md:pb-12">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
              {/* Objective Input */}
              <div className="space-y-3 md:space-y-4">
                <Label htmlFor="title" className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30 ml-1">
                  {`> [ INPUT_OBJECTIVE ]`}
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">
                    <Terminal className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <Input
                    id="title"
                    placeholder="TRANSITION_DATA..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "bg-white/[0.01] border-white/5 h-12 md:h-16 pl-12 md:pl-14 rounded-none font-mono text-base md:text-lg transition-all duration-500",
                      "placeholder:text-white/5 focus:bg-white/[0.04] focus:border-primary/50 focus:ring-0",
                      "border-l-4 border-l-primary/20 focus:border-l-primary",
                      errors.title && "border-l-destructive/50 border-white/10"
                    )}
                  />
                </div>
                {errors.title && (
                  <p className="text-[10px] text-destructive font-mono font-black uppercase tracking-widest ml-1 animate-pulse">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Context Area */}
              <div className="space-y-3 md:space-y-4">
                <Label htmlFor="description" className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30 ml-1">
                  {`> [ CONTEXT_FLOW ]`}
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 md:top-5 text-primary/40 group-focus-within:text-primary transition-colors">
                    <Database className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <textarea
                    id="description"
                    placeholder="ESTABLISH_PARAMS..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    rows={4}
                    className={cn(
                      "flex w-full bg-white/[0.01] border border-white/5 pl-12 md:pl-14 pr-4 py-4 md:py-5 font-mono text-base md:text-lg transition-all duration-500",
                      "placeholder:text-white/5 focus:bg-white/[0.04] focus:border-primary/50 focus-visible:outline-none",
                      "border-l-4 border-l-white/10 focus:border-l-primary resize-none rounded-none"
                    )}
                  />
                </div>
              </div>

              {/* System Messages */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-3 md:p-4 font-mono text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/5 border border-destructive/20"
                  >
                    {errors.general}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Manifest Button */}
              <div className="pt-4 md:pt-6">
                <Button
                  type="submit"
                  disabled={isLoading || !title.trim()}
                  className={cn(
                    "w-full h-16 md:h-24 text-xl md:text-2xl font-black uppercase tracking-[0.4em] transition-all duration-700 relative overflow-hidden group",
                    "bg-primary hover:bg-primary/90 text-white shadow-[0_0_40px_rgba(var(--primary),0.2)]",
                    "disabled:grayscale disabled:opacity-30 disabled:shadow-none"
                  )}
                  style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 85% 100%, 0% 100%)" }}
                >
                  {/* Binary Pulse Background */}
                  <div className="absolute inset-0 opacity-10 font-mono text-[6px] md:text-[8px] pointer-events-none grid grid-cols-6 items-center justify-center p-1 md:p-2 gap-1 overflow-hidden">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() }}
                      >
                        {Math.round(Math.random())}
                      </motion.span>
                    ))}
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3 md:gap-4 relative z-10 font-mono italic">
                      <Loader2 className="h-6 w-6 md:h-7 md:w-7 animate-spin" />
                      <span className="hidden xs:inline">UPLOADING...</span>
                      <span className="xs:hidden">...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 md:gap-3 relative z-10 font-mono">
                      <Plus className="h-6 w-6 md:h-8 md:w-8 transition-transform group-hover:rotate-90 duration-500" />
                      <span>MANIFEST</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
