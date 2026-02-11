"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "@/types/task";
import { tasksApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Terminal, Activity, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EditTaskDialogProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
}

export function EditTaskDialog({
  task,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDescription(task.description || "");
      setErrors({});
    }
  }, [task, open]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = ">> ERR: OBJECTIVE_VOID";
    } else if (title.length > 200) {
      newErrors.title = ">> ERR: OBJECTIVE_TOO_LARGE";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const updatedTask = await tasksApi.update(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
      });

      toast.success("SYSTEM_NOTICE: OBJECTIVE_STABILIZED");
      onTaskUpdated(updatedTask);
      setOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ general: error.data?.detail || "ERR: UPDATE_FAILURE" });
      } else {
        setErrors({ general: "ERR: QUANTUM_DRIFT" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Apex Protocol Geometry
  const CLIP_PATH = "polygon(2.5rem 0%, 100% 0%, 100% calc(100% - 2.5rem), calc(100% - 2.5rem) 100%, 0% 100%, 0% 2.5rem)";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/20 hover:text-white hover:bg-white/5 transition-all duration-300"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{ clipPath: CLIP_PATH }}
        className="bg-transparent border-none sm:max-w-[550px] p-0 overflow-hidden shadow-[0_0_50px_rgba(var(--primary),0.1)]"
      >
        <div className="relative bg-[#030014] p-10 border border-white/10">
          {/* Static Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />

          <div className="relative z-10 space-y-10">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-white font-mono flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/20 border border-primary/20">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                MODIFY_OBJECTIVE
              </DialogTitle>
              <DialogDescription className="text-white/40 font-mono text-sm uppercase tracking-widest pl-1">
                Refining manifestation parameters and contextual flow.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Terminal */}
              <div className="space-y-3">
                <Label htmlFor="edit-title" className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30 ml-1">
                  {`> [ PRIMARY_PARAM ]`}
                </Label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "bg-white/[0.01] border-white/5 h-16 pl-14 rounded-none font-mono text-lg transition-all duration-500",
                      "focus:bg-white/[0.04] focus:border-primary/50 focus:ring-0",
                      "border-l-4 border-l-primary/30 focus:border-l-primary"
                    )}
                  />
                </div>
                <AnimatePresence>
                  {errors.title && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive font-mono font-black tracking-widest ml-1">{errors.title}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Description Database */}
              <div className="space-y-3">
                <Label htmlFor="edit-description" className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30 ml-1">
                  {`> [ EXTENDED_CONTEXT ]`}
                </Label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-5 text-primary/40 group-focus-within/input:text-primary transition-colors">
                    <Database className="h-5 w-5" />
                  </div>
                  <textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    rows={6}
                    className={cn(
                      "flex w-full bg-white/[0.01] border border-white/5 pl-14 pr-4 py-5 font-mono text-lg transition-all duration-500 rounded-none",
                      "focus:bg-white/[0.04] focus:border-primary/50 focus-visible:outline-none resize-none",
                      "border-l-4 border-l-white/10 focus:border-l-primary"
                    )}
                  />
                </div>
              </div>

              {/* Status Message */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 font-mono text-[10px] font-black tracking-widest text-destructive bg-destructive/5 border border-destructive/20 uppercase">
                    {errors.general}
                  </motion.div>
                )}
              </AnimatePresence>

              <DialogFooter className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                  className="flex-1 h-14 font-mono font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-14 font-mono font-black uppercase tracking-[0.3em] bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(var(--primary),0.3)] relative overflow-hidden group/btn"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                  {isLoading ? "REFLECTING..." : "COMMIT_CHANGES"}
                </Button>
              </DialogFooter>
            </form>
          </div>

          {/* Background ID */}
          <div className="absolute top-4 right-6 text-[8px] font-mono text-white/10 pointer-events-none select-none">
            REVISION: v4
            <br />
            STABILITY: NOMINAL
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
