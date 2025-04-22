"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { UIMessage } from "ai";
import { NoMessagesView } from "./no-messages-view";
import { ChatMessageItem } from "./chat-message-item"; // Import the new component
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ChatMessagesProps {
    messages: UIMessage[];
    status: string; // 'idle', 'streaming', 'submitted', 'error' etc.
    explainCode: (code: string, lang: string) => void;
    onPrefill: (value: string) => void;
    isDragging: boolean;
    reload: () => void;
}

export function ChatMessages({ messages, status, explainCode, onPrefill, reload }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    // Auto-scroll to bottom when new messages arrive or streaming starts
    useEffect(() => {
        if (isAtBottom && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, status, isAtBottom]); // Trigger also on status change for streaming start

    // Detect if user has scrolled up
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Add a small threshold to prevent floating point issues
        const bottomThreshold = 5;
        setIsAtBottom(scrollHeight - scrollTop - clientHeight <= bottomThreshold);
    }, []);

    return (
        <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto py-4 px-4 md:px-8"
            onScroll={handleScroll}
        >
            <div className="max-w-4xl mx-auto space-y-6">
                {messages.length === 0 ? (
                    <NoMessagesView onPrefill={onPrefill} />
                ) : (
                    <>
                        {messages.map((item, idx) => (
                            <ChatMessageItem
                                key={item.id}
                                message={item}
                                streaming={status === "streaming"}
                                isLast={idx === messages.length - 1}
                                explainCode={explainCode}
                            />
                        ))
                        }
                        {status === "error" && (
                            <div className="flex items-center justify-between gap-4 p-4 border border-destructive text-destructive rounded-xl bg-destructive/10 w-1/2 mx-auto">
                                <div className="flex gap-2 items-center">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className="text-sm">Something went wrong.</span>
                                </div>
                                <Button size="sm" className="bg-red-700/60 hover:bg-red-800 cursor-pointer dark:text-white" onClick={() => { reload(); toast.info("Reloading...") }}>
                                    <RefreshCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                    </>
                )}
                {/* Anchor for scrolling */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}