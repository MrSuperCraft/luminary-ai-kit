"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChatHistoryItem {
    id: string;
    title: string;
    date: string;
}

interface ChatSidebarProps {
    onSelectChat?: (id: string) => void;
    currentChatId?: string;
}

export function ChatSidebar({ onSelectChat, currentChatId }: ChatSidebarProps) {
    const [openSection, setOpenSection] = useState<"today" | "yesterday" | "previous" | null>("today");

    const chatHistory: Record<string, ChatHistoryItem[]> = {
        today: [
            { id: "1", title: "Weather in New York", date: "Today" },
            { id: "2", title: "Product search for headphones", date: "Today" },
            { id: "3", title: "Currency conversion help", date: "Today" },
        ],
        yesterday: [
            { id: "4", title: "Web search about AI trends", date: "Yesterday" },
            { id: "5", title: "Help with JavaScript code", date: "Yesterday" },
        ],
        previous: [
            { id: "6", title: "Travel recommendations", date: "3 days ago" },
            { id: "7", title: "Recipe for chocolate cake", date: "5 days ago" },
            { id: "8", title: "Book recommendations", date: "1 week ago" },
        ],
    };

    const renderChatList = (items: ChatHistoryItem[]) =>
        items.map((chat) => (
            <button
                key={chat.id}
                onClick={() => onSelectChat?.(chat.id)}
                className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    currentChatId === chat.id
                        ? "bg-neutral-200 dark:bg-neutral-700"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    "text-neutral-900 dark:text-neutral-100"
                )}
            >
                {chat.title}
            </button>
        ));

    const sections: { key: "today" | "yesterday" | "previous"; label: string }[] = [
        { key: "today", label: "Today" },
        { key: "yesterday", label: "Yesterday" },
        { key: "previous", label: "Previous 7 Days" },
    ];

    return (
        <div className="h-full flex flex-col border-r border-neutral-200 dark:border-neutral-700">
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
                {sections.map(({ key, label }) => (
                    <Collapsible
                        key={key}
                        open={openSection === key}
                        onOpenChange={(isOpen) => setOpenSection(isOpen ? key : null)}
                    >
                        <CollapsibleTrigger
                            className={cn(
                                "flex w-full items-center justify-between px-2 py-1 text-xs font-medium",
                                "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            )}
                        >
                            {label}
                            <ChevronDownIcon
                                className={cn(
                                    "h-4 w-4 transition-transform",
                                    openSection === key ? "rotate-0" : "rotate-180"
                                )}
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="mt-2 space-y-1">{renderChatList(chatHistory[key])}</div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>

            {/* Bottom slot */}
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
                {/* Add any extra links/buttons here */}
            </div>
        </div>
    );
}
