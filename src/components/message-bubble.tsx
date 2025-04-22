"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { User, Sparkle } from "lucide-react";
import React, { useId } from "react";
import { Markdown } from "./markdown";

interface MessageBubbleProps {
    text: string;
    role: "system" | "user" | "assistant" | "data";
    streaming?: boolean;
    isLast: boolean;
    explainCode: (code: string, lang: string) => void;
}

export function GradientIcon({ Icon }: { Icon: typeof Sparkle }) {
    const gradientId = useId();
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="100%" y2="0">
                    <stop offset="0%" stopColor="#4285f4" />
                    <stop offset="50%" stopColor="#9b72cb" />
                    <stop offset="100%" stopColor="#d96570" />
                </linearGradient>
            </defs>
            <Icon stroke={`url(#${gradientId})`} className="w-4 h-4" />
        </svg>
    );
}

export function MessageBubble({
    text,
    role,
}: MessageBubbleProps) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "w-full flex",
                isUser ? "justify-end" : "justify-start",
                "py-1 px-4"
            )}
        >
            <div className={cn("flex w-full max-w-3xl gap-3", isUser && "flex-row-reverse")}>
                <Avatar
                    className={cn(
                        "h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1 max-w-[80%]",
                        isUser ? "bg-primary" : "bg-muted"
                    )}
                >
                    {isUser ? (
                        <User className="h-5 w-5 text-primary-foreground dark:text-white" />
                    ) : (
                        <>
                            <Sparkle
                                className="size-5"
                                strokeOpacity={0}
                                fill="url(#gemini-gradient)"
                                stroke="url(#gemini-gradient)"
                            />
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient
                                        id="gemini-gradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#00DCFA" />
                                        <stop offset="50%" stopColor="#A020F0" />
                                        <stop offset="100%" stopColor="#FF007F" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </>
                    )}
                </Avatar>

                <div
                    className={cn(
                        "rounded-2xl px-4 py-2 text-base break-words",
                        isUser ? "bg-primary text-primary-foreground" : "prose max-w-none prose-pre:bg-transparent",
                    )}
                >
                    {!isUser ? (
                        <Markdown>
                            {text}
                        </Markdown>
                    ) : (
                        <>{text}</>
                    )
                    }
                </div>
            </div>
        </div>
    );
}
