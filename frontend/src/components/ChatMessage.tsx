"use client";

import { useState } from "react";
import { Message } from "../types/chat";
import { cn } from "../lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex gap-4 py-8 px-4 sm:px-6 rounded-3xl transition-all duration-300",
        isUser ? "flex-row-reverse bg-primary/5 ml-12" : "flex-row bg-transparent mr-12"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105",
          isUser
            ? "bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground shadow-primary/20"
            : "bg-background border border-border text-primary shadow-sm"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5" />
        ) : (
          <Bot className="h-5 w-5" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 min-w-0 max-w-[85%] space-y-2",
          isUser ? "text-right items-end" : "text-left items-start"
        )}
      >
        {/* Role & Time Label */}
        <div className={cn(
          "flex items-center gap-2 mb-1",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            {isUser ? "You" : "Assistant"}
          </span>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span className="text-[10px] text-muted-foreground/40 font-medium">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "inline-block px-5 py-4 text-sm leading-relaxed shadow-sm transition-all duration-300",
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-primary/10"
              : "bg-card text-foreground rounded-2xl rounded-tl-none border border-border/50 shadow-black/5"
          )}
        >
          <p className="whitespace-pre-wrap break-words font-medium">{message.content}</p>
        </div>

        {/* Copy Button (only for assistant messages) */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
