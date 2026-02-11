"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { chatApi, ApiError, Message } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import VoiceInput from "@/components/VoiceInput";

interface ChatComponentProps {
    initialConversationId?: string;
}

export function ChatComponent({ initialConversationId }: ChatComponentProps) {
    const [messages, setMessages] = useState<Partial<Message>[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleVoiceInput = (transcript: string) => {
        setInput(transcript);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Partial<Message> = {
            role: "user",
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await chatApi.sendMessage({
                message: input,
                conversation_id: conversationId,
            });

            setConversationId(response.conversation_id);

            const botMessage: Partial<Message> = {
                role: "assistant",
                content: response.message,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error: unknown) {
            console.error("Chat error:", error);
            let detail = "I'm sorry, I couldn't process that. Please try again.";

            if (error instanceof ApiError) {
                const errorData = error.data?.detail;
                if (typeof errorData === 'string') {
                    detail = errorData;
                } else if (errorData && typeof errorData === 'object') {
                    // Handle FastAPI structured errors (e.g., validation errors)
                    detail = JSON.stringify(errorData);
                }
            }

            const errorMessage: Partial<Message> = {
                role: "assistant",
                content: detail,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[600px] border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Chat Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-orange-500/20"
            >
                <AnimatePresence initial={false}>
                    {messages.length === 0 && (
                        <div className="text-center text-white/40 py-10 font-mono text-sm">
                            &gt; SYSTEM READY. INITIALIZE CONTEXT...
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${msg.role === "user" ? "bg-orange-500/20 border-orange-500/40" : "bg-neutral-800 border-white/10"
                                    }`}>
                                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-orange-600 text-white rounded-tr-none"
                                    : "bg-neutral-800/80 text-white/90 border border-white/5 rounded-tl-none"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-3 items-center text-white/40 text-xs font-mono ml-11">
                                <Loader2 size={14} className="animate-spin" />
                                PROCESSING...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex gap-2 relative items-center">
                    <VoiceInput onTranscript={handleVoiceInput} isProcessing={isLoading} />
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type or speak command..."
                        className="flex-1 bg-black/60 border-orange-600/20 rounded-xl focus:border-orange-500 transition-all font-mono"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-orange-600 hover:bg-orange-500 rounded-xl px-4 shadow-lg shadow-orange-950/20"
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}



