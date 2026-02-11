"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Trash2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteTaskDialogProps {
  task: Task;
  onTaskDeleted: (taskId: string) => void;
}

export function DeleteTaskDialog({
  task,
  onTaskDeleted,
}: DeleteTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await tasksApi.delete(task.id);
      toast.success("SYSTEM_NOTICE: OBJECTIVE_PURGED");
      onTaskDeleted(task.id);
      setOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.data?.detail || "ERR: PURGE_FAILURE");
      } else {
        toast.error("ERR: UNKNOWN_INTERFERENCE");
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
          className="h-8 w-8 text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{ clipPath: CLIP_PATH }}
        className="bg-transparent border-none sm:max-w-[450px] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="relative bg-[#030014] p-10 border border-white/10 group">
          {/* Animated Background Diagnostic */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)",
              backgroundSize: "24px 24px"
            }} />
          </div>

          <div className="relative z-10 space-y-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto w-20 h-20 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative h-full w-full border-2 border-destructive/40 flex items-center justify-center bg-destructive/10 overflow-hidden" style={{ clipPath: CLIP_PATH }}>
                <ShieldAlert className="h-10 w-10 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              </div>
            </motion.div>

            <DialogHeader className="space-y-4">
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-white font-mono flex items-center justify-center gap-2">
                <span className="text-destructive tracking-widest">[</span>
                PURGE_OBJECTIVE
                <span className="text-destructive tracking-widest">]</span>
              </DialogTitle>
              <DialogDescription className="text-white/50 text-base font-mono leading-relaxed px-4">
                {`>> INITIALIZING PERMANENT REMOVAL OF:`}
                <br />
                <span className="text-white font-black uppercase mt-2 block tracking-tight">"{task.title}"</span>
                <br />
                {`>> THIS ACTION IS IRREVERSIBLE.`}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="flex-1 h-14 font-mono font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
              >
                ABORT
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 h-14 font-mono font-black uppercase tracking-[0.3em] bg-destructive hover:bg-destructive/90 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] group/btn relative overflow-hidden"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                {isLoading ? "PURGING..." : "EXECUTE"}
              </Button>
            </DialogFooter>
          </div>

          {/* Diagnostic Decals */}
          <div className="absolute top-4 right-6 text-[8px] font-mono text-white/10 pointer-events-none select-none">
            SEC_LVL: OMEGA
            <br />
            VOID_INIT: TRUE
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
