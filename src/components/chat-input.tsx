/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Send, Loader2, Mic, ImageIcon, XCircle } from "lucide-react";
import Image from "next/image";
import { FileIcon } from "./file-icon";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | any) => void; // Keep any for synthetic events
    handleSubmit: (e: React.FormEvent<HTMLFormElement>, options?: any) => void;
    status: string;
    stop: () => void;
    files: FileList | undefined;
    previewURLs: string[];
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
    isUploadingFiles?: boolean; // Track file upload progress
    handlePaste: (event: React.ClipboardEvent) => void;
}

export function ChatInput({
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    files,
    previewURLs,
    onFileChange,
    onRemoveFile,
    handlePaste,
    isUploadingFiles = false,
}: ChatInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Separate streaming state from file uploading
    const isStreaming = status === "submitted" || status === "streaming";
    // We disable most elements when uploading files.
    const disableUI = isUploadingFiles || isStreaming;
    // We want to allow "stop" functionality when the AI is streaming.

    // Use an explicit state for enabling stop button if streaming
    const [canStop, setCanStop] = useState(false);

    useEffect(() => {
        setCanStop(isStreaming);
    }, [isStreaming]);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto"; // Reset height
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
        }
    }, [input]);

    // Trigger hidden file input
    const handleImageButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Handle Enter key press for submission
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.ctrlKey && e.key === "v") {
                handlePaste(e as unknown as React.ClipboardEvent);
            }
            if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
                e.preventDefault(); // Prevent newline
                if (!disableUI && input.trim()) {
                    // Create a synthetic event with the form element
                    const syntheticEvent = {
                        preventDefault: () => { },
                        currentTarget: e.currentTarget.form,
                    } as unknown as React.FormEvent<HTMLFormElement>;
                    handleSubmit(syntheticEvent);
                }
            }
        },
        [input, disableUI, handleSubmit, handlePaste]
    );

    // Handle click on Send/Stop button
    const handleSendClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            // When stop is available (i.e. during streaming), call stop
            if (canStop) {
                stop();
            }
            // Otherwise, form submission is already triggered by the button type="submit" on form elements.
        },
        [canStop, stop]
    );

    // Determine button disablement logic:
    // When streaming, allow stop (unless file upload is active).
    // Otherwise, disable when input is empty or if file upload is active.
    const sendButtonDisabled = isUploadingFiles || (!isStreaming && !input.trim());

    return (
        <div className="p-2">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <div className="relative rounded-xl border border-gray-300 bg-white dark:bg-neutral-900 dark:border-neutral-600 shadow-sm p-3">
                        {files && files.length > 0 && (
                            <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                                {Array.from(files).map((file, index) => {
                                    const isImage = file.type.startsWith("image/");
                                    const previewURL = isImage ? previewURLs[index] : undefined;
                                    return (
                                        <div
                                            key={index}
                                            className="relative w-20 h-20 flex-shrink-0 rounded-md border shadow-sm overflow-hidden"
                                        >
                                            {isImage ? (
                                                <Image
                                                    src={previewURL!}
                                                    alt={`Preview ${index}`}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover rounded-md"
                                                />
                                            ) : (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex flex-col items-center justify-center w-full h-full bg-muted text-muted-foreground rounded-md px-2 py-3 gap-1">
                                                                <FileIcon fileType={file.type} fileName={file.name} className="size-6" />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{file.name}</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => onRemoveFile(index)}
                                                className="absolute top-0.5 right-0.5 bg-white/70 hover:bg-white rounded-full dark:bg-neutral-800/70 dark:hover:bg-neutral-800 p-0.5 h-5 w-5 transition-colors duration-200 ease-in-out text-primary hover:text-red-600"
                                                aria-label="Remove file"
                                                disabled={disableUI}
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="relative w-full pb-9">

                            <Textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Message AI Assistant..."
                                className="min-h-[60px] max-h-[150px] w-full resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 dark:bg-inherit"
                                aria-label="Chat message input"
                                rows={1}
                            />

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={onFileChange}
                                disabled={disableUI}
                            />

                            <div className="absolute right-0 -bottom-1 flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
                                            disabled={disableUI}
                                            onClick={handleImageButtonClick}
                                        >
                                            <ImageIcon className="h-4 w-4" />
                                            <span className="sr-only">Upload image</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Upload image</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                                            disabled={disableUI}
                                        >
                                            <Mic className="h-4 w-4" />
                                            <span className="sr-only">Voice input</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Voice input (coming soon)</TooltipContent>
                                </Tooltip>
                                <Button
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-black text-white hover:bg-gray-800"
                                    // Override disablement if streaming (so stop can be invoked)
                                    disabled={sendButtonDisabled}
                                    onClick={handleSendClick}
                                    aria-label={isStreaming ? "Stop generating message" : "Send message"}
                                >
                                    {isStreaming ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-center text-gray-500 px-3">
                        <span>
                            AI Assistants can make mistakes. Consider checking important information.
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
