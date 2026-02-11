/**
 * Error Boundary component.
 * Catches and displays errors in the component tree.
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#030014] overflow-hidden relative">
          {/* Background Glows */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

          <Card className="w-full max-w-md glass border-white/10 shadow-2xl relative z-10 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                System Glitch
              </CardTitle>
              <CardDescription className="text-white/50 text-base mt-2">
                An unexpected fluctuation occurred in the workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8 pt-4">
              {this.state.error && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs font-mono text-destructive/80 mb-1 uppercase tracking-widest font-bold">Error Detail</p>
                  <p className="text-sm font-mono text-white/70 break-all leading-relaxed">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/";
                }}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Re-initialize Workspace
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
