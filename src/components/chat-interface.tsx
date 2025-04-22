"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    FormEvent,
    ChangeEvent,
    DragEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Attachment, UIMessage } from "ai";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail } from "./ui/sidebar";
import SidebarHeaderButtons from "./sidebar-header-buttons";
import { useSettingsStore } from "@/store/settingsStore";
import { useCustomInstructionsStore } from "@/store/customInstructionsStore";

export function ChatInterface() {
    const { model, temperature, developerMode, streaming, markdownEnabled } = useSettingsStore();
    const { userInterestsAndValues, systemTraits, username, occupation } = useCustomInstructionsStore();
    const markToolCallStarted = useChatStore((s) => s.markToolCallStarted);
    const markToolCallFinished = useChatStore((s) => s.markToolCallFinished);
    const markSourcesShown = useChatStore((s) => s.markSourcesShown);
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit: originalHandleSubmit,
        status,
        stop,
        reload,
        append,
        setMessages,
    } = useChat({
        maxSteps: 5,

        onToolCall: async ({ toolCall }) => {
            if (toolCall.toolName === 'web_search') {
                markToolCallStarted(toolCall.toolCallId);
            }

        },

        onFinish: (message) => {
            // Look through parts for tool results
            for (const part of message.parts ?? []) {
                if (
                    part.type === 'tool-invocation' &&
                    part.toolInvocation.toolName === 'web_search' &&
                    part.toolInvocation.state === 'result'
                ) {
                    markToolCallFinished(part.toolInvocation.toolCallId);

                    // Mark sources as shown when tool call results are available
                    const sources = part.toolInvocation.result?.sources ?? [];
                    if (sources.length > 0) {
                        markSourcesShown(message.id); // Make sure this triggers a state update
                    }
                }
            }
        },
        body: {
            settings: {
                model,
                temperature,
                developerMode,
                streaming,
                markdownEnabled
            },
            customInstructions: {
                username,
                systemTraits,
                userInterestsAndValues,
                occupation
            }
        },
    });
    const [isDragging, setIsDragging] = useState(false);

    // Use FileList for upload and preview
    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);

    // Generate preview URLs
    const previewURLs = useMemo(() => {
        if (!files) return [];
        return Array.from(files).map((file) => URL.createObjectURL(file));
    }, [files]);

    // Clean up blob URLs on unmount or file change
    useEffect(() => {
        return () => {
            previewURLs.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewURLs]);

    const explainCode = useCallback(
        (code: string, lang: string) => {
            append({
                role: "user",
                content: `Hey, can you explain the following code snippet?\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\nPlease provide a detailed explanation.`,
            });
        },
        [append]
    );

    const handlePrefill = useCallback(
        (value: string) => {
            handleInputChange({ target: { value } } as ChangeEvent<HTMLTextAreaElement>);
        },
        [handleInputChange]
    );

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    }, []);

    const removeAttachedFile = useCallback(
        (index: number) => {
            if (!files) return;

            const updatedFiles = Array.from(files).filter((_, i) => i !== index);
            const dataTransfer = new DataTransfer();
            updatedFiles.forEach((file) => dataTransfer.items.add(file));
            setFiles(dataTransfer.files.length > 0 ? dataTransfer.files : undefined);
        },
        [files]
    );

    const handleFormSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setIsUploadingFiles(true);

            let attachments: Attachment[] = [];

            if (files && files.length > 0) {
                const uploaded = await Promise.all(
                    Array.from(files).map(async (file) => {
                        const formData = new FormData();
                        formData.append("file", file);

                        const res = await fetch("/api/blob-upload", {
                            method: "POST",
                            body: formData,
                        });

                        if (!res.ok) {
                            console.error("Upload failed:", res.statusText);
                            return null;
                        }

                        const data: {
                            url: string;
                            downloadUrl: string;
                            pathname: string;
                            contentType: string;
                            contentDisposition: string;
                        } = await res.json();

                        return {
                            url: data.url,
                            contentType: data.contentType,
                            name: file.name,
                        } satisfies Attachment;
                    })
                );

                attachments = uploaded.filter(
                    (item) => item !== null
                );
            }

            setIsUploadingFiles(false);

            originalHandleSubmit(e, {
                experimental_attachments: attachments,
            });

            setFiles(undefined);
        },
        [files, originalHandleSubmit]
    );



    //---------- Utilities ----------

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };


    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        const droppedFilesArray = Array.from(droppedFiles);
        if (droppedFilesArray.length > 0) {
            const validFiles = droppedFilesArray.filter(
                (file) =>
                    file.type.startsWith("image/") || file.type.startsWith("text/")
            );

            if (validFiles.length === droppedFilesArray.length) {
                const dataTransfer = new DataTransfer();
                validFiles.forEach((file) => dataTransfer.items.add(file));
                setFiles(dataTransfer.files);
            } else {
                toast.error("Only image and text files are allowed!");
            }

            setFiles(droppedFiles);
        }
        setIsDragging(false);
    };

    const handlePaste = (event: React.ClipboardEvent) => {
        const items = event.clipboardData?.items;

        if (items) {
            const files = Array.from(items)
                .map((item) => item.getAsFile())
                .filter((file): file is File => file !== null);

            if (files.length > 0) {
                const validFiles = files.filter(
                    (file) =>
                        file.type.startsWith("image/") || file.type.startsWith("text/")
                );

                if (validFiles.length === files.length) {
                    const dataTransfer = new DataTransfer();
                    validFiles.forEach((file) => dataTransfer.items.add(file));
                    setFiles(dataTransfer.files);
                } else {
                    toast.error("Only image and text files are allowed");
                }
            }
        }
    };


    const onNewChat = () => {
        useChatStore.getState().reset();
        setMessages([]);
        handleInputChange({ target: { value: "" } } as ChangeEvent<HTMLTextAreaElement>);
    }




    return (
        <div className="flex h-screen max-h-screen bg-white overflow-hidden"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="h-[3.5rem] py-3">
                        <SidebarHeaderButtons onNewChat={onNewChat} />
                    </SidebarHeader>
                    <SidebarContent>
                        <ChatSidebar />
                    </SidebarContent>
                    <SidebarFooter />
                    <SidebarRail className="dark:after:bg-neutral-800 dark:hover:after:bg-neutral-600 dark:transition-colors dark:duration-200" />
                </Sidebar>
                <SidebarInset>

                    <AnimatePresence>
                        {isDragging && (
                            <motion.div
                                // --- Base Styling ---
                                className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 p-8 pointer-events-none bg-white/95"
                                // --- Animation ---
                                initial={{ opacity: 0, scale: 0.95 }} // Start slightly smaller and faded out
                                animate={{ opacity: 1, scale: 1 }}   // Animate to full opacity and size
                                exit={{ opacity: 0, scale: 0.95 }}     // Fade out and shrink slightly
                                transition={{ duration: 0.2, ease: "easeInOut" }} // Smooth transition
                            >
                                <div className="flex flex-col items-center justify-center gap-3 p-10 dark:bg-zinc-800 border-2 border-dashed border-primary/90 rounded-xl shadow-lg">
                                    <UploadCloud
                                        className="text-primary/90 dark:text-blue-400"
                                        size={48} // Larger icon
                                    />

                                    {/* --- Text --- */}
                                    <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                                        Drop files here to upload
                                    </div>
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Accepts images and text files
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div
                        className="flex-1 flex flex-col min-w-0 min-h-0"
                    >
                        <ChatHeader onNewChat={onNewChat} />

                        <ChatMessages
                            messages={messages as UIMessage[]}
                            status={status}
                            explainCode={explainCode}
                            onPrefill={handlePrefill}
                            isDragging={isDragging}
                            reload={reload}
                        />
                        <ChatInput
                            input={input}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleFormSubmit}
                            status={status}
                            stop={stop}
                            files={files}
                            previewURLs={previewURLs}
                            onFileChange={handleFileChange}
                            onRemoveFile={removeAttachedFile}
                            isUploadingFiles={isUploadingFiles}
                            handlePaste={handlePaste}
                        />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
