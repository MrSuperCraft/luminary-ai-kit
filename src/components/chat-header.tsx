

// File: src/components/ChatHeader.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    BotIcon,
    CreditCard,
    EditIcon,
    LogOutIcon,
    PlugIcon,
    Settings as SettingsIcon,
    Settings2,
    SidebarOpen,
    Sparkles,
    UserIcon,
    Sparkle,
    Sliders,
    Terminal,
    Sun,
    Moon,
    Computer,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { useCustomInstructionsStore } from '@/store/customInstructionsStore';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

const models = [
    {
        name: "Llama 3.1 8B Instant",
        params: "8B",
        context: "4K tokens",
        description:
            "Lightweight and optimized for fast inference. Ideal for local deployments and real-time applications.",
        highlights: ["Open-source", "Fast inference", "Coding support"],
        license: "Llama 3.1 License",
    },
    {
        name: "DeepSeek-R1-Distill-Llama-70B",
        params: "70B",
        context: "Up to 131K tokens",
        description:
            "Distilled from Llama 3.3-70B-Instruct, optimized for reasoning and coding tasks with reduced computational requirements.",
        highlights: [
            "MIT License",
            "High reasoning accuracy",
            "Supports tool calling",
        ],
        license: "MIT",
    },
    {
        name: "Llama 3 70B 8192",
        params: "70B",
        context: "8K tokens",
        description:
            "Full-scale model designed for high-accuracy tasks, including research and enterprise applications.",
        highlights: ["Open-source", "Multilingual", "Advanced safety features"],
        license: "Llama 3 License",
    },
];



export function ChatHeader({ onNewChat }: { onNewChat: () => void }) {
    const { toggleSidebar, open } = useSidebar();
    const {
        isOpen,
        setOpen,
        streaming,
        toggleStreaming,
        showSources,
        toggleShowSources,
        markdownEnabled,
        toggleMarkdown,
        developerMode,
        toggleDeveloperMode,
        model,
        setModel,
        temperature,
        setTemperature,
        openSettings,
        closeSettings
    } = useSettingsStore();
    const { username,
        setUsername,
        userInterestsAndValues,
        setUserInterestsAndValues,
        isInstructionsOpen,
        setInstructionsOpen,
        occupation,
        setOccupation,
        setSystemTraits,
        systemTraits,
        traitSuggestions
    } = useCustomInstructionsStore();
    const { theme, setTheme } = useTheme();
    const [active, setActive] = useState<'general' | 'developer'>('general');
    const [modelDialogOpen, setModelDialogOpen] = useState(false);



    return (
        <>
            <div className="py-3 px-4 border-b flex items-center justify-between bg-white dark:bg-transparent sticky top-0 z-10">
                <div className="flex items-center">
                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className={cn(open && 'hidden')} onClick={toggleSidebar}>
                                    <SidebarOpen className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='bottom' className="text-sm font-normal">Open Sidebar</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(open && 'hidden', 'mr-2')}
                                    onClick={onNewChat}
                                >
                                    <EditIcon className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm font-normal">New Chat</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="flex items-center gap-1">
                        <Sparkle
                            className="size-6"
                            strokeOpacity={0}
                            fill="url(#gemini-gradient)"
                            stroke="url(#gemini-gradient)"
                        />

                        /

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
                        <h1 className="text-lg font-medium">Luminary</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Sparkles className="h-4 w-4 mr-1" />Upgrade
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarFallback>
                                    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                                        <UserIcon className="size-5 text-white" />
                                    </div>
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-[300px]">
                            <DropdownMenuItem className='py-3' onClick={() => setModelDialogOpen(true)}>
                                <BotIcon className="size-4 mr-2" />Explore Available Models
                            </DropdownMenuItem>
                            <DropdownMenuItem className='py-3' onClick={() => setInstructionsOpen(true)}>
                                <Settings2 className="size-4 mr-2" />Customize Instructions
                            </DropdownMenuItem>

                            {/* Use store to open modal */}
                            <DropdownMenuItem className='py-3' onClick={openSettings}>
                                <SettingsIcon className="size-4 mr-2" />Settings
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 mx-2" />

                            <DropdownMenuItem className='py-3' onClick={() => alert('Upgrade Plan clicked')}>
                                <CreditCard className="size-4 mr-2" />Upgrade Plan
                            </DropdownMenuItem>
                            <DropdownMenuItem className='py-3' onClick={() => alert("Get Extension clicked")}>
                                <PlugIcon className="size-4 mr-2" />Get Luminary’s search extension
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 mx-2" />
                            <DropdownMenuItem className='py-3' onClick={() => alert('Log out clicked')}>
                                <LogOutIcon className="size-4 mr-2" />Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Settings Modal */}
            <Dialog open={isOpen} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg w-2xl">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>Customize your preferences below.</DialogDescription>
                    </DialogHeader>

                    <div className="flex pt-4">
                        {/* Sidebar */}
                        <nav className="w-40 flex-shrink-0 space-y-2 pr-4 border-r border-neutral-200 dark:border-neutral-700">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full flex items-center justify-start text-left px-3 py-2 rounded-md text-sm",
                                    active === 'general'
                                        ? 'bg-neutral-100 dark:bg-neutral-800 font-medium'
                                        : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                )}
                                onClick={() => setActive('general')}
                            >
                                <Sliders className='mr-2 size-4' /> General
                            </Button>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full flex items-center justify-start text-left px-3 py-2 rounded-md text-sm",
                                    active === 'developer'
                                        ? 'bg-neutral-100 dark:bg-neutral-800 font-medium'
                                        : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                )}
                                onClick={() => setActive('developer')}
                            >
                                <Terminal className='mr-2 size-4' /> Advanced
                            </Button>
                        </nav>

                        {/* Content */}
                        <div className="flex-1 pl-6 space-y-6">
                            {active === 'general' && (
                                <>
                                    {/* Theme */}
                                    <div className='flex items-center justify-between'>
                                        <Label className="block">Theme</Label>
                                        <Select value={theme} onValueChange={setTheme}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light"><Sun className='mr-2 size-4' /> Light</SelectItem>
                                                <SelectItem value="dark"><Moon className='mr-2 size-4' /> Dark</SelectItem>
                                                <SelectItem value="system"><Computer className='mr-2 size-4' /> System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator className='w-full h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700' />

                                    {/* Streaming tool calls */}
                                    <div className="flex items-center justify-between">
                                        <span>Streaming Tools</span>
                                        <Switch checked={streaming} onCheckedChange={toggleStreaming} />
                                    </div>

                                    {/* Show Sources */}
                                    <div className="flex items-center justify-between">
                                        <span>Show Sources</span>
                                        <Switch checked={showSources} onCheckedChange={toggleShowSources} />
                                    </div>

                                    {/* Enable Markdown */}
                                    <div className="flex items-center justify-between">
                                        <span>Enable Markdown</span>
                                        <Switch checked={markdownEnabled} onCheckedChange={toggleMarkdown} />
                                    </div>
                                </>
                            )}

                            {active === 'developer' && (
                                <>
                                    {/* Developer Mode Toggle */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Developer Mode</span>
                                        <Switch checked={developerMode} onCheckedChange={toggleDeveloperMode} />
                                    </div>


                                    <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                        {/* Model */}
                                        <div className='flex items-center justify-between'>
                                            <Label className="block text-sm font-medium">Model</Label>
                                            <Select value={model} onValueChange={setModel}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="llama-3.1-8b-instant">llama 3.1 8b</SelectItem>
                                                    <SelectItem value="deepseek-r1-distill-llama-70b">Deepseek R1 70b</SelectItem>
                                                    <SelectItem value="llama3-70b-8192">Llama 3 70b</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Temperature */}
                                        <div>
                                            <Label className="block text-sm font-medium mb-1">
                                                Temperature ({temperature.toFixed(1)})
                                            </Label>
                                            <Slider
                                                value={[temperature]}
                                                onValueChange={(v) => setTemperature(v[0])}
                                                min={0}
                                                max={1}
                                                step={0.1}
                                            />
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeSettings}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Custom Instructions Modal */}
            <Dialog open={isInstructionsOpen} onOpenChange={() => setInstructionsOpen(false)}>
                <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Customize Luminary</DialogTitle>
                        <DialogDescription>
                            Introduce yourself to get better, more personalized responses
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Name */}
                        <div className="grid gap-1">
                            <Label htmlFor="username" className="text-left mb-2">
                                What should Luminary call you?
                            </Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Occupation */}
                        <div className="grid gap-1">
                            <Label htmlFor="occupation" className="text-left mb-2">
                                What do you do?
                            </Label>
                            <Input
                                id="occupation"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                            />
                        </div>

                        {/* System Traits */}
                        <div className="grid gap-1">
                            <Label htmlFor="systemTraits" className="text-left mb-2">
                                What traits should Luminary have?
                            </Label>
                            <Textarea
                                id="systemTraits"
                                value={systemTraits}
                                onChange={(e) => setSystemTraits(e.target.value)}
                                className="resize-none max-h-40"
                            />
                            <div className="flex flex-wrap gap-2 pt-2">
                                {traitSuggestions
                                    .filter((t) => !systemTraits.includes(t.content))
                                    .slice(0, 10)
                                    .map((t) => (
                                        <Button
                                            key={t.title}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSystemTraits(systemTraits + (systemTraits ? ', ' : '') + t.content);
                                            }}
                                        >
                                            {t.title}
                                        </Button>
                                    ))}
                            </div>    </div>

                        {/* Interests and Values */}
                        <div className="grid gap-1">
                            <Label htmlFor="userInterests" className="text-left mb-2">
                                Anything else Luminary should know?
                            </Label>
                            <Textarea
                                id="userInterests"
                                value={userInterestsAndValues}
                                onChange={(e) => setUserInterestsAndValues(e.target.value)}
                                className="resize-none max-h-40"
                            />
                        </div>
                    </div>

                    {/* Footer with toggle + actions */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-end">
                        <Button variant="secondary" className='mt-3' onClick={() => setInstructionsOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
                <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Available Models</DialogTitle>
                        <DialogDescription>
                            Explore the capabilities and specifications of each model.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                            {models.map((model) => (
                                <div
                                    key={model.name}
                                    className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">{model.name}</h3>
                                        <Badge variant="secondary">{model.params}</Badge>
                                    </div>
                                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                        {model.description}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {model.highlights.map((highlight) => (
                                            <Badge key={highlight} variant="outline">
                                                {highlight}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs text-neutral-500">
                                        License: {model.license}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={() => setModelDialogOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
}
