'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const BACKGROUND_CLASSES = [
    // Gradients
    'bg-gradient-to-br from-[#0f2027] to-[#203a43]',  // deep blue/teal
    'bg-gradient-to-br from-[#1f1c2c] to-[#928DAB]',  // purple/gray
    'bg-gradient-to-br from-[#232526] to-[#414345]',  // charcoal/gray
    'bg-gradient-to-br from-[#141e30] to-[#243b55]',  // navy blue
    // Static solid colors
    'bg-[#1E1E1E]', // dark gray
    'bg-[#2C3E50]', // muted navy
    'bg-[#3B3B98]', // deep indigo
    'bg-[#222831]', // slate black
    'bg-[#2D3436]', // graphite
];

export function QuoteDisplay({
    content,
    author,
}: {
    content: string;
    author: string;
}) {
    const [backgroundClass, setBackgroundClass] = useState<string>('');

    useEffect(() => {
        const random = Math.floor(Math.random() * BACKGROUND_CLASSES.length);
        setBackgroundClass(BACKGROUND_CLASSES[random]);
    }, []);

    return (
        <div
            className={cn(
                'flex flex-col gap-4 rounded-2xl p-5 max-w-[500px] text-left shadow-md border border-neutral-800 transition-colors duration-500',
                backgroundClass,
            )}
        >
            <div className="flex flex-col gap-3">
                <p className="text-neutral-100 text-base italic leading-relaxed">
                    “{content}”
                </p>
                <span className="text-neutral-300 text-sm self-end font-medium tracking-wide">
                    — {author}
                </span>
            </div>
        </div>
    );
}
