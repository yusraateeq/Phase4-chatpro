"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ChatComponent } from "@/components/chat/ChatComponent";
import { LogOut, ArrowLeft, Terminal } from "lucide-react";
import { authApi } from "@/lib/api";
import Link from "next/link";
import Loading from "../loading";
import { toast } from "sonner";

export default function ChatPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            router.push("/login");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            toast.success("SESSION TERMINATED");
            router.push("/login");
        } catch {
            router.push("/login");
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-neutral-950 text-foreground relative overflow-hidden flex flex-col">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/5 blur-[150px] rounded-full" />
            </div>

            {/* Header */}
            <header className="z-50 container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-md rounded-lg border border-border/50 shadow-lg">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2 rounded-lg group-hover:bg-white/5 transition-colors">
                                <ArrowLeft className="h-5 w-5 text-white/60 group-hover:text-white" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Logo size={32} className="text-primary" />
                                <span className="text-xl font-bold tracking-tight">Todo Pro Chat</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <Terminal className="h-3 w-3 text-orange-500" />
                            <span className="text-[10px] font-mono text-orange-500 font-bold uppercase">AI AGENT LINKED</span>
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
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col relative z-10">
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                            AI Command <span className="text-magma">Foundry</span>
                        </h1>
                        <p className="text-white/40 text-sm font-medium">
                            Manage your tasks using natural language processing.
                        </p>
                    </motion.div>

                    <div className="flex-1">
                        <ChatComponent />
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: "Natural Language", desc: "Just say 'Add buy milk for tomorrow' or 'Search for work tasks'." },
                            { title: "Bulk Actions", desc: "Try 'Delete all completed tasks' or 'Reschedule everything to next week'." },
                            { title: "Priority & Tags", desc: "Set priority and organize tasks with tags using simple sentences." }
                        ].map((tip, i) => (
                            <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                                <h4 className="text-xs font-bold text-orange-400 uppercase mb-1">{tip.title}</h4>
                                <p className="text-[11px] text-white/40 leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
