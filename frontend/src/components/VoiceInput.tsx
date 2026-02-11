"use client";

import "regenerator-runtime/runtime";
import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
    onTranscript: (transcript: string) => void;
    isProcessing?: boolean;
}

const VoiceInput = ({ onTranscript, isProcessing }: VoiceInputProps) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Update parent component with transcript
    useEffect(() => {
        if (transcript) {
            onTranscript(transcript);
        }
    }, [transcript, onTranscript]);

    if (!isMounted) {
        return null;
    }

    if (!browserSupportsSpeechRecognition) {
        console.warn("Browser does not support speech recognition.");
        return null;
    }

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    return (
        <Button
            onClick={toggleListening}
            disabled={isProcessing}
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-xl transition-all duration-300 w-10 h-10",
                listening
                    ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-900/20 animate-pulse"
                    : "bg-black/60 border border-orange-600/20 text-white/60 hover:text-orange-500 hover:border-orange-500"
            )}
            type="button"
            title={listening ? "Stop listening" : "Start voice input"}
        >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
    );
};

export default VoiceInput;
