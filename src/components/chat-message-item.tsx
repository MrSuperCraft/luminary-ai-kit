/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { UIMessage } from "ai";
import { MessageBubble } from "@/components/message-bubble";
import { ToolCallDisplay } from "./tool-call-display";
import SourcesDisplay, { Source } from "./sources-display";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";


interface ChatMessageItemProps {
    message: UIMessage;
    streaming: boolean;
    isLast: boolean;
    explainCode: (code: string, lang: string) => void;
}

export function ChatMessageItem({
    message,
    streaming,
    isLast,
    explainCode,
}: ChatMessageItemProps) {

    const { showSources } = useSettingsStore();
    const finished = useChatStore((s) => s.finishedMessages);
    const toolStarted = useChatStore((s) => s.toolStartedMessages);
    const toolFinished = useChatStore((s) => s.toolFinishedMessages);
    const shownSources = useChatStore((s) => s.shownSources);
    const markShown = useChatStore((s) => s.markSourcesShown);

    const allSources: Source[] = message.parts
        ?.flatMap((part) =>
            part.type === "tool-invocation" &&
                "result" in part.toolInvocation &&
                Array.isArray((part.toolInvocation.result as any).sources)
                ? (part.toolInvocation.result as any).sources
                : []
        )
        .filter((s) => s.url && s.title) ?? [];

    // once message + tools done, markSourcesShown
    useEffect(() => {
        const mid = message.id;
        const msgDone = finished.has(mid);
        const toolsOK =
            !toolStarted.has(mid) || toolFinished.has(mid);
        if (msgDone && toolsOK && allSources.length > 0 && !shownSources.has(mid)) {
            markShown(mid);
        }
    }, [
        message.id,
        finished,
        toolStarted,
        toolFinished,
        allSources.length,
        shownSources,
        markShown,
    ]);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        toast.success("Copied Text!");
    };

    return (
        <div className="gap-3">
            {message.parts?.map((part, i) => {
                if (part.type === "text") {
                    return (
                        <MessageBubble
                            key={i}
                            text={part.text}
                            role={message.role}
                            streaming={streaming}
                            isLast={isLast}
                            explainCode={explainCode}
                        />
                    );
                }

                if (part.type === "tool-invocation") {
                    return (
                        <div key={i} className="space-y-3">
                            <ToolCallDisplay toolInvocation={part.toolInvocation} />
                        </div>
                    );
                }
                return null;
            })}

            {message.annotations && (
                <>{JSON.stringify(message.annotations)}</>
            )}

            {/* images */}
            {message.experimental_attachments && (
                <div className="mt-2 flex justify-end space-y-2">
                    {message.experimental_attachments
                        .filter((a) => a.contentType?.startsWith("image/"))
                        .map((att, idx) => (
                            <Image
                                key={idx}
                                src={att.url}
                                width={300}
                                height={300}
                                alt={att.name ?? ''}
                                className="rounded-md shadow-sm max-w-xs"
                            />
                        ))}
                </div>
            )}

            {/* only render once store.shownSources has this id */}
            {shownSources.has(message.id) && showSources && (
                <div className="mt-2">
                    <SourcesDisplay sources={allSources} />
                </div>
            )}

            {/* action buttons (hidden) */}
            {message.role === "assistant" && (
                <div className="items-center gap-1 mt-1 ml-10 hidden">
                    <Button variant="ghost" size="icon">
                        <ThumbsUp className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <ThumbsDown className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        title="Copy message"
                    >
                        <Copy className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>
            )}
        </div>
    );
}
