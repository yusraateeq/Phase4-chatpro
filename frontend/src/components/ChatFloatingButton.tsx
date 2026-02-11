"use client";

import { MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ChatFloatingButton() {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100]"
        >
            <Link href="/chat">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <button className="relative flex items-center justify-center w-16 h-16 bg-black border border-orange-500/50 rounded-full shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent"></div>
                        <MessageSquare className="w-7 h-7 text-orange-500 relative z-10" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-orange-500/20 rounded-full pointer-events-none"
                        />
                    </button>

                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-black/80 backdrop-blur-md border border-orange-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-orange-500" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">AI FOUNDRY</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
