"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto w-full px-2 pb-2">
      <div className="relative flex flex-col gap-2 bg-card border border-muted/50 rounded-3xl shadow-2xl shadow-black/5 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300 p-2 overflow-hidden">
        {/* Decorative Gradient Background for focus */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none bg-transparent px-4 py-4 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 max-h-[300px] scrollbar-thin z-10"
        />

        <div className="flex items-center justify-between px-2 pb-2 z-10">
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-full bg-muted/50 border border-muted-foreground/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Gemini Flash
            </div>
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className={cn(
              "h-10 w-10 rounded-2xl shadow-lg transition-all duration-300",
              input.trim()
                ? "bg-primary text-primary-foreground shadow-primary/20 scale-100 rotate-0"
                : "bg-muted text-muted-foreground/40 scale-90 rotate-12 opacity-50"
            )}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-center font-medium text-muted-foreground/40 uppercase tracking-[0.2em]">
        Think big. Design fast. Stay organized.
      </p>
    </form>
  );
}
