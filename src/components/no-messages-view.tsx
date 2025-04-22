"use client"

import { Search, MapPin, Sun, Sparkle } from "lucide-react"
import { motion } from "framer-motion"

interface NoMessagesViewProps {
    onPrefill: (value: string) => void
}

const suggestions = [
    { label: "What’s the weather like?", icon: <Sun className="w-3.5 h-3.5" /> },
    { label: "Search for a product", icon: <Search className="w-3.5 h-3.5" /> },
    { label: "Find local places", icon: <MapPin className="w-3.5 h-3.5" /> },
]

export function NoMessagesView({ onPrefill }: NoMessagesViewProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
            <div className="max-w-md w-full space-y-4">
                <motion.div
                    initial={{ y: 50, opacity: 0 }} // Starts from below and invisible
                    animate={{ y: 0, opacity: 1 }}  // Rise up and become visible
                    transition={{ duration: 0.2, ease: "easeIn" }} // Customize animation duration and easing
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-muted border mx-auto shadow-md"
                >
                    <Sparkle
                        className="size-8"
                        strokeOpacity={0}
                        fill="url(#gemini-gradient)"
                        stroke="url(#gemini-gradient)"
                    />
                    <svg width="0" height="0">
                        <defs>
                            <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00DCFA" />
                                <stop offset="50%" stopColor="#A020F0" />
                                <stop offset="100%" stopColor="#FF007F" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
                    className="text-3xl font-semibold tracking-tight"
                >
                    How can I help you today?
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
                    className="text-sm text-muted-foreground"
                >
                    Ask me anything. I’m here to assist, inform, and explore with you.
                </motion.p>

                <div className="flex justify-center pt-4 gap-2 flex-wrap">
                    {suggestions.map(({ label, icon }, index) => (
                        <motion.button
                            key={label}
                            onClick={() => onPrefill(label)}
                            className="group relative inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border bg-muted text-muted-foreground transition-colors duration-300 overflow-hidden"
                            whileHover="hover"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2 + index * 0.1, // Sequential delay for each button
                                ease: "easeOut"
                            }}
                        >
                            {/* Border sweep animation */}
                            <motion.span
                                variants={{
                                    hover: {
                                        scaleX: 1,
                                        transition: { duration: 0.4, ease: "easeOut" }
                                    },
                                    initial: {
                                        scaleX: 0
                                    }
                                }}
                                initial="initial"
                                className="absolute inset-0 z-0 bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-all duration-300 rounded-full"
                            />

                            {/* Content with icon */}
                            <span className="relative z-10 flex items-center gap-1 group-hover:text-primary">
                                {icon}
                                {label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    )
}
