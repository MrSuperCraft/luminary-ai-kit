'use client';

import React, { useMemo } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface Source {
    url: string;
    title?: string;
    description?: string;
    faviconUrl?: string;
}

interface SourcesDisplayProps {
    sources: Source[];
}

export default function SourcesDisplay({ sources }: SourcesDisplayProps) {
    const preparedSources = useMemo(() => {
        return sources.slice(0, 5).map(src => {
            try {
                const domain = new URL(src.url).hostname;
                const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
                return { ...src, faviconUrl };
            } catch {
                return src;
            }
        });
    }, [sources]);

    if (!preparedSources.length) return null;

    const previewSources = preparedSources.slice(0, 3);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border hover:bg-muted/60 transition shadow-sm cursor-pointer">
                    <div className="flex flex-row items-center -space-x-2">
                        {previewSources.map((src, idx) => (
                            <div key={idx}>
                                <Avatar className="w-6 h-6 ring-2 ring-background hover:scale-105 transition-transform">
                                    <AvatarImage src={src.faviconUrl} alt={src.title || src.url} />
                                    <AvatarFallback>
                                        {new URL(src.url).hostname.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        ))}
                    </div>

                </Card>
            </DialogTrigger>


            <DialogContent className="max-w-md rounded-xl px-4 py-4">
                <DialogHeader>
                    <DialogTitle className="text-sm font-semibold text-muted-foreground">
                        References
                    </DialogTitle>
                </DialogHeader>

                <ul className="space-y-3 mt-2 max-h-[300px] overflow-y-auto pr-1">
                    {preparedSources.map((src, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                        >
                            <Link
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                            >
                                <Avatar className="w-6 h-6 mt-0.5 shrink-0">
                                    <AvatarImage src={src.faviconUrl} alt={src.title || src.url} />
                                    <AvatarFallback>
                                        {new URL(src.url).hostname.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground group-hover:underline">
                                        {src.title || new URL(src.url).hostname}
                                    </span>
                                    {src.description && (
                                        <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                                            {src.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </motion.li>
                    ))}
                </ul>



                <DialogClose asChild>
                    <div className="mt-4 flex justify-end">
                        <Button variant="ghost" size="sm">Close</Button>
                    </div>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
