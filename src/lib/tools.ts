// lib/tools.ts
import { tool } from "ai";
import { z } from "zod";
import { pistonRuntimes } from "@/lib/piston";
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';


const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));



export const ChartDataSchema = z.array(
    z.object({
        name: z.string().min(1),
        value: z.number().nullable()
    })
);



export const tools = {
    run_code: tool({
        description: "Execute code in a specific language using the Piston API.",
        parameters: z.object({
            language: z.string().describe("Programming language (js, python, c++, go, etc.)"),
            code: z.string().describe("Code snippet to execute"),
        }),
        execute: async ({ language, code }) => {
            try {
                const runtime = pistonRuntimes.find((r) => {
                    const aliases = [r.language, ...(r.aliases || [])].map((a) => a.toLowerCase());
                    return aliases.includes(language.toLowerCase());
                });

                if (!runtime) {
                    throw new Error(`No runtime found for '${language}'`);
                }

                const fileExt =
                    runtime.language === "javascript"
                        ? "js"
                        : runtime.language === "python"
                            ? "py"
                            : runtime.language === "c++"
                                ? "cpp"
                                : "txt";

                const pistonRequest = {
                    language: runtime.language,
                    version: runtime.version,
                    runtime: runtime.runtime,
                    files: [
                        {
                            name: `code.${fileExt}`,
                            content: code,
                            encoding: "utf8",
                        },
                    ],
                    stdin: "",
                    args: [],
                    compile_timeout: 10000,
                    run_timeout: 3000,
                    compile_cpu_time: 10000,
                    run_cpu_time: 3000,
                    compile_memory_limit: -1,
                    run_memory_limit: -1,
                };

                const res = await fetch("https://emkc.org/api/v2/piston/execute", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pistonRequest),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Piston API error: ${res.status} ${res.statusText} - ${errText}`);
                }

                const data = await res.json();
                const output = data?.run?.output || data?.run?.stdout || data?.run?.stderr;
                if (!output) {
                    throw new Error("No output returned from code execution.");
                }

                return { type: "tool-result", result: output };
            } catch (err) {
                if (err instanceof Error) {
                    return { type: "tool-result", result: `Error: ${err.message}` };
                } else {
                    return { type: "tool-result", result: `An error has occured.` };

                }
            }
        },
    }),

    generate_chart: tool({
        description: "Generate chart data for rendering in a UI component.",
        parameters: z.object({
            type: z.enum(["line", "bar", "pie"]).describe("Chart type"),
            color: z.enum([
                "--color-chart-1",
                "--color-chart-2",
                "--color-chart-3",
                "--color-chart-4",
                "--color-chart-5"
            ]).describe("Chart color"),
            title: z.string().describe("Chart title"),
            labels: z.object({
                x: z.string().describe("X-axis label"),
                y: z.string().describe("Y-axis label")
            }).describe("Axis labels"),
            data: ChartDataSchema
        }),
        execute: async ({ type, data, color, title, labels }) => {
            try {
                // Log to verify the received arguments
                console.log({
                    chartType: type,
                    data,
                    color,
                    title,
                    labels
                });
                const chartData = {
                    chartType: type,
                    data,
                    color,
                    title,
                    labels
                };

                // Ensure a valid output is always returned
                if (!chartData) {
                    throw new Error("Chart data creation failed.");
                }

                return {
                    type: "tool-result",
                    result: chartData
                };
            } catch (err: unknown) {
                console.error("[generate_chart] Error executing tool:", err);
                return {
                    type: "tool-result",
                    result: `Error: ${err instanceof Error ? err.message : "Unknown error"}`
                };
            }
        }
    }),


    get_weather: tool({
        description: 'Get the current weather at a location. Ask for location first if not given.',
        parameters: z.object({
            latitude: z.number(),
            longitude: z.number(),
        }),
        execute: async ({ latitude, longitude }) => {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
            );

            const weatherData = await response.json();
            return weatherData;
        },
    }),

    get_random_quote: tool({
        description: "Fetch a random quote from a free API.",
        parameters: z.object({}),
        execute: async () => {
            try {
                const response = await fetch("https://quotes-api-self.vercel.app/quote");
                if (!response.ok) {
                    console.log(response.statusText)
                    throw new Error(`Failed to fetch quote: ${response.statusText}`);
                }
                const data = await response.json(); // data is an array
                return {
                    type: "tool-result",
                    result: {
                        content: data.quote,
                        author: data.author,
                    },
                };
            } catch (err: unknown) {
                if (err instanceof Error) {
                    return {
                        type: "tool-result",
                        result: {
                            content: "Error fetching quote.",
                            author: err.message,
                        },
                    };
                }

                return {
                    type: "tool-result",
                    result: {
                        content: "Unknown error occurred.",
                        author: "Internal",
                    },
                };
            }
        },
    }),

    web_search: tool({
        description: 'Performs a web search, reads and cleans multiple pages, and returns a synthesized answer along with a list of source URLs.',
        parameters: z.object({
            query: z.string(),
        }),
        execute: async ({ query }) => {
            try {
                const searchUrl = `https://search.rhscz.eu/search?q=${encodeURIComponent(query)}&format=html`;
                console.log(`[web_search] Fetching search results from: ${searchUrl}`);

                // const searchRes = await fetch(searchUrl);
                // if (!searchRes.ok) {
                //     throw new Error(`[web_search] Failed to fetch search results: ${searchRes.status} ${searchRes.statusText}`);
                // }
                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();
                await page.goto(searchUrl, { waitUntil: 'domcontentloaded' }); // Wait for DOM to load
                sleep(1000);
                const htmlContent = await page.content();
                const $ = cheerio.load(htmlContent);


                const urls: string[] = [];
                $('a.result-url, a.result-header, h3 > a').each((_, el) => {
                    const href = $(el).attr('href');
                    if (href && /^https?:\/\//.test(href)) {
                        urls.push(href);
                    }
                });

                const uniqueUrls = [...new Set(urls)].slice(0, 3);
                console.log(`[web_search] URLs to fetch:`, uniqueUrls);

                const sources = await Promise.all(
                    uniqueUrls.map(async (url: string) => {
                        try {
                            console.log(`[web_search] Fetching and extracting metadata for: ${url}`);
                            const res = await fetch(url, {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                                },
                            });

                            if (!res.ok) {
                                console.warn(`[web_search] Failed to fetch ${url}: ${res.status} ${res.statusText}`);
                                return {
                                    url,
                                    title: '',
                                    description: '',
                                    faviconUrl: '',
                                    content: '[Failed to fetch this site.]',
                                };
                            }

                            const pageHtml = await res.text();
                            const $$ = cheerio.load(pageHtml);

                            // Metadata
                            const title = $$('head > title').text().trim() || '';
                            const description =
                                $$('meta[name="description"]').attr('content') ||
                                $$('meta[property="og:description"]').attr('content') ||
                                '';
                            let faviconUrl = '';
                            const iconHref =
                                $$('link[rel="icon"]').attr('href') ||
                                $$('link[rel="shortcut icon"]').attr('href');
                            if (iconHref) {
                                faviconUrl = new URL(iconHref, url).toString();
                            } else {
                                const domain = new URL(url).hostname;
                                faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;
                            }

                            // Clean content
                            $$('script, style, nav, header, footer, noscript, iframe, svg, img, form, button, aside').remove();
                            const rawText = $$('body').text();
                            const cleaned = rawText.replace(/\s+/g, ' ').replace(/[\r\n\t]+/g, ' ').trim().slice(0, 500);

                            return {
                                url,
                                title,
                                description: description.trim(),
                                faviconUrl,
                                content: cleaned,
                            };
                        } catch (err) {
                            console.error(`[web_search] Error processing ${url}:`, err);
                            const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
                            return {
                                url,
                                title: '',
                                description: '',
                                faviconUrl: fallbackFavicon,
                                content: '[Failed to fetch or parse this site.]',
                            };
                        }
                    })
                );

                const result = sources.map(
                    s => `Source: ${s.url}\nTitle: ${s.title}\nDescription: ${s.description}\n${s.content}`
                );

                console.log(`[web_search] Finished metadata collection.`);
                return { result, sources };
            } catch (err) {
                console.error(`[web_search] Unexpected error:`, err);
                return {
                    result: [
                        `[web_search] Unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`
                    ],
                    sources: [],
                };
            }
        },
    }),
}