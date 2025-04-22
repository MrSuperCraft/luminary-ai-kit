/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import type { ToolInvocation } from "ai";
import { GenerateChartDisplay } from "./generate-chart-display";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge, Check, CheckCircle, ClipboardCopy, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Weather } from "./weather-card";
import { QuoteDisplay } from "./quote-display";

interface ToolCallDisplayProps {
    toolInvocation: ToolInvocation;
}

interface ToolResultRendererProps {
    toolName: string;
    result: any;
}

function extractResult(result: any): string {
    if (typeof result === "object" && result !== null) {
        if ("output" in result) return result.output;
        if ("value" in result) return result.value;
        if ("result" in result) return result.result;
        return JSON.stringify(result, null, 2);
    }
    return String(result);
}

export function ToolResultRenderer({ toolName, result }: ToolResultRendererProps) {
    switch (toolName) {
        case "run_code": {
            const output = extractResult(result);
            return <RunCodeDisplay result={output} />;
        }

        case "generate_chart": {
            const inner = (typeof result === "object" && result !== null && "result" in result)
                ? (result as any).result
                : null;

            if (
                typeof inner === "object" &&
                inner !== null &&
                "chartType" in inner &&
                Array.isArray(inner.data)
            ) {
                const { chartType, data, color, title, labels } = inner;

                // If there's no data, show fallback
                if (data.length === 0) {
                    return (
                        <Card className="p-4 mt-2 text-center bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                No data available to render the chart.
                            </p>
                        </Card>
                    );
                }

                const [xKey, yKey] = Object.keys(data[0]);

                return (
                    <GenerateChartDisplay
                        chartType={chartType}
                        data={data}
                        xKey={xKey}
                        yKey={yKey}
                        color={color}
                        title={title}
                        labels={labels}
                    />
                );
            }

            return (
                <pre className="text-sm text-muted-foreground">
                    <span className="font-semibold">Could not render the chart. Data:</span>
                    {JSON.stringify(result, null, 2)}
                </pre>
            );
        }

        case "calculate": {
            const calcResult = extractResult(result);
            return <CalculateDisplay result={calcResult} />;
        }

        case "get_weather": {
            return (
                <Weather weatherAtLocation={result} />
            );
        }

        case "get_random_quote": {
            const { content, author } = result.result;

            return <QuoteDisplay content={content} author={author} />
        }

        case "web_search": {
            const { sources } = result;

            if (sources && sources.length === 0) {
                return (
                    <p className="text-sm text-red-700 font-medium flex items-center">
                        <XCircle className="size-4 mr-2" />
                        Error in Search: No results found.
                    </p>
                )
            }

            return (
                <p className="text-sm text-emerald-600 font-medium flex items-center">
                    <CheckCircle className="size-4 mr-2" />
                    Web search completed successfully!
                </p>
            );
        }

        default:
            return <p className="text-sm text-muted-foreground">Unknown tool result format.</p>;
    }
}

export function ToolCallDisplay({ toolInvocation }: ToolCallDisplayProps) {
    const { toolName, state } = toolInvocation;
    const [explanation,] = useState<string | null>(null);
    // const [hasFetched, setHasFetched] = useState(false);

    const isLoading = state === "call" || state === "partial-call";
    const hasResult = state === "result";
    const isError = !isLoading && !hasResult;
    const fallbackLoadingText = `Calling ${toolName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}...`;

    return (
        <div className="ml-11 my-4 space-y-2">
            {isLoading && (
                <p className="text-sm font-medium text-muted-foreground animate-shimmer bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 bg-clip-text">
                    {fallbackLoadingText}
                </p>
            )}

            {hasResult && (
                <>
                    {explanation && (
                        <p className="text-xs italic text-muted-foreground">{explanation}</p>
                    )}
                    <ToolResultRenderer toolName={toolName} result={toolInvocation.result} />
                </>
            )}


            {isError && (
                <p className="text-sm text-red-600">I couldn&apos;t complete this task.</p>
            )}

            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
                .animate-shimmer {
                    background-size: 400% 100%;
                    animation: shimmer 2s linear infinite;
                }
            `}</style>
        </div>
    );
}



export function RunCodeDisplay({ result }: { result: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    return (
        <Card className="mt-6 bg-neutral-800 text-neutral-100 shadow-lg border border-neutral-700">
            <CardHeader className="relative flex items-center justify-between px-6 py-2 border-b border-neutral-700">
                <CardTitle className="text-lg font-semibold">Code Output</CardTitle>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="absolute right-6"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-green-400" />
                            ) : (
                                <ClipboardCopy className="w-5 h-5" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
                </Tooltip>
            </CardHeader>
            <CardContent className="p-6">
                <div className="max-h-96 overflow-auto rounded-lg bg-neutral-900 p-4">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                        {result}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}



export function CalculateDisplay({ result }: { result: string | number }) {
    return (
        <Card className="p-4 mt-2 text-center bg-gray-50 border border-gray-200 rounded-2xl shadow-md">
            <p className="text-muted-foreground text-sm mb-2">Calculation Result</p>
            <Badge className="text-lg px-4 py-2 rounded-xl bg-blue-100 text-blue-700">{result}</Badge>
        </Card>
    );
}
