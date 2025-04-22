'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import {
    EditIcon,
    MessagesSquare,
    Search,
    SidebarCloseIcon,
} from 'lucide-react';
import { useSidebar } from './ui/sidebar';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from './ui/tooltip';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './ui/command';

interface SidebarHeaderButtonsProps {
    onNewChat: () => void;
}

export default function SidebarHeaderButtons({
    onNewChat,
}: SidebarHeaderButtonsProps) {
    const { toggleSidebar } = useSidebar();
    const [open, setOpen] = useState(false);

    // Base button classes for ghost‑icon buttons in light/dark
    const iconBtnClasses =
        'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100';

    return (
        <>
            <div className="pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={iconBtnClasses}
                                onClick={toggleSidebar}
                            >
                                <SidebarCloseIcon className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-sm font-normal">
                            Close Sidebar
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip delayDuration={200}>
                            <TooltipTrigger>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={iconBtnClasses}
                                    onClick={() => setOpen(true)}
                                >
                                    <Search className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm font-normal">
                                Search Chats <br /> Ctrl + K
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={200}>
                            <TooltipTrigger>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={iconBtnClasses}
                                    onClick={onNewChat}
                                >
                                    <EditIcon className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm font-normal">
                                New Chat
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                title="Search Chats"
                description="Search your chats by name"
            >
                <CommandInput
                    placeholder="Type a command or search..."
                    searchIcon={<></>}
                    className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-600"
                />
                <CommandList className="bg-white dark:bg-neutral-800">
                    <CommandEmpty className="text-neutral-500 dark:text-neutral-400">
                        No results found.
                    </CommandEmpty>
                    <CommandGroup
                        heading="Suggestions"
                        className="text-neutral-700 dark:text-neutral-300"
                    >
                        <CommandItem
                            onSelect={() => {
                                setOpen(false);
                                onNewChat();
                            }}
                            className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                            <MessagesSquare className="size-4 mr-2" />
                            New Chat
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
