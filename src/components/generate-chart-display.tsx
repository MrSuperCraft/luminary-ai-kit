/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Type for Recharts data: an array of objects with string/number values.
type RechartsData = Record<string, string | number>[];

// Type for Chart.js–like data: an object with labels and datasets.
interface ChartJsLikeData {
    labels: string[];
    datasets: { data: number[]; label?: string }[];
}

// Updated props interface
export interface ChartDisplayProps {
    chartType: "line" | "bar" | "pie";
    // Expected data in one of the formats or as a JSON string.
    data: RechartsData | ChartJsLikeData | string;
    // Optional keys; if not provided, derived from the first data record.
    xKey?: string;
    yKey?: string;
    // A color override (e.g., CSS variable such as "--color-chart-1")
    color?: string;
    // Title to display above the chart
    title?: string;
    // Axis labels passed as an object { x: "X Axis Label", y: "Y Axis Label" }
    labels?: { x: string; y: string };
    // Optional description text below the title.
    description?: string;
}

// Type guard for Chart.js–like data.
function isChartJsData(data: unknown): data is ChartJsLikeData {
    return (
        typeof data === "object" &&
        data !== null &&
        "labels" in data &&
        "datasets" in data &&
        Array.isArray((data as any).labels) &&
        Array.isArray((data as any).datasets)
    );
}

// Type guard for Recharts data.
function isRechartsData(data: unknown): data is RechartsData {
    return (
        Array.isArray(data) &&
        data.every((item) => typeof item === "object" && item !== null)
    );
}

export function GenerateChartDisplay({
    chartType,
    data,
    xKey,
    yKey,
    color = "var(--color-chart-1)",
    title = "Generated Chart",
    labels,
    description,
}: ChartDisplayProps) {
    let parsed: unknown = data;

    // If data is a string, attempt to parse it.
    if (typeof data === "string") {
        try {
            parsed = JSON.parse(data);
        } catch (err) {
            console.error("Failed to parse chart data:", err);
            parsed = null;
        }
    }

    let chartData: RechartsData = [];
    let derivedXKey = xKey;
    let derivedYKey = yKey;

    // If the parsed data is in Chart.js–like format:
    if (isChartJsData(parsed)) {
        const dataset = parsed.datasets[0];
        chartData = parsed.labels.map((label, i) => ({
            name: label,
            value: dataset.data[i],
        }));
        derivedXKey = derivedXKey || "name";
        derivedYKey = derivedYKey || "value";
        // Override axis labels if not provided.
        labels = labels || { x: "Name", y: "Value" };
    }
    // Otherwise, if it's an array (assumed Recharts data):
    else if (isRechartsData(parsed)) {
        // Filter each entry to only include string/number values.
        chartData = parsed.map((entry) => {
            const safe: Record<string, string | number> = {};
            for (const [key, val] of Object.entries(entry)) {
                if (typeof val === "string" || typeof val === "number") {
                    safe[key] = val;
                }
            }
            return safe;
        });

        if (chartData.length > 0 && (!derivedXKey || !derivedYKey)) {
            const keys = Object.keys(chartData[0]);
            derivedXKey = derivedXKey || keys[0];
            derivedYKey = derivedYKey || (keys.length >= 2 ? keys[1] : keys[0]);
        }

        // If axis labels are missing, derive default labels from keys.
        labels = labels || {
            x: (derivedXKey || "X").charAt(0).toUpperCase() + (derivedXKey || "X").slice(1),
            y: (derivedYKey || "Y").charAt(0).toUpperCase() + (derivedYKey || "Y").slice(1),
        };
    }

    const isEmpty = chartData.length === 0;

    // Build a config object for your ChartContainer.
    // Here we assign each dataset key a label and color.
    const config: ChartConfig = {};
    const datasetKeys = Array.from(
        new Set(
            chartData.flatMap((entry) =>
                Object.keys(entry).filter((key) => key !== derivedXKey)
            )
        )
    );
    datasetKeys.forEach((key, idx) => {
        config[key] = {
            label: labels ? (labels.y === key ? labels.y : key) : key,
            color: `var(--color-chart-${(idx % 5) + 1})`,
        };
    });

    // Function to render the appropriate chart type.
    const renderChart = () => {
        switch (chartType) {
            case "line":
                return (
                    <LineChart data={chartData}>
                        <XAxis
                            dataKey={derivedXKey}
                            tickLine={false}
                            axisLine={false}
                            label={
                                labels
                                    ? { value: labels.x, position: "insideBottom", offset: -5 }
                                    : undefined
                            }
                        />
                        <YAxis
                            label={
                                labels
                                    ? { value: labels.y, angle: -90, position: "insideLeft" }
                                    : undefined
                            }
                        />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        {datasetKeys.map((key) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={config[key]?.color || color}
                                strokeWidth={2}
                                dot
                            />
                        ))}
                    </LineChart>
                );

            case "bar":
                return (
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey={derivedXKey}
                            tickLine={false}
                            axisLine={false}
                            label={
                                labels
                                    ? { value: labels.x, position: "insideBottom", offset: -5 }
                                    : undefined
                            }
                        />
                        <YAxis
                            label={
                                labels
                                    ? { value: labels.y, angle: -90, position: "insideLeft" }
                                    : undefined
                            }
                        />
                        <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
                        {datasetKeys.map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={config[key]?.color || color}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                );

            case "pie":
                return (
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey={derivedYKey ?? "value"}
                            nameKey={derivedXKey}
                            innerRadius={60}
                            outerRadius={80}
                            label
                        >
                            {chartData.map((_, idx) => (
                                <Cell
                                    key={`cell-${idx}`}
                                    fill={`var(--color-chart-${(idx % 5) + 1})`}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                    </PieChart>
                );

            default:
                return <p className="text-sm text-muted-foreground">Invalid chart type.</p>;
        }
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription className="text-muted-foreground text-sm">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <p className="text-sm text-muted-foreground">No valid data to display.</p>
                ) : (
                    <ChartContainer config={config} className="mx-auto" style={{ maxHeight: "300px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
