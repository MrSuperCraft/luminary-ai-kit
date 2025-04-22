import { InvalidToolArgumentsError, NoSuchToolError, streamText, ToolExecutionError } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";


export async function POST(req: Request) {
    try {
        const openrouter = createOpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY!,
        });

        const { toolName, args } = await req.json();
        const prompt = `Based on the tool "${toolName}" and the following arguments: ${JSON.stringify(args)}, describe what is currently being done as an active step. Use present progressive tense (e.g., "executing", "generating", "fetching") and avoid describing the tool itself. Focus only on what action is being performed *right now* with these arguments. Respond with a short phrase.`;

        const result = streamText({
            model: openrouter("google/gemini-2.5-pro-exp-03-25:free"),
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            abortSignal: req.signal,
            system: "You're a system that explains what a tool is currently doing in simple active phrases.",
        });

        return result.toDataStreamResponse({
            sendUsage: false,
            getErrorMessage: (error) => {
                console.error("[toDataStreamResponse] Encountered error:", error);
                if (NoSuchToolError.isInstance(error)) {
                    return "The model tried to call an unknown tool.";
                } else if (InvalidToolArgumentsError.isInstance(error)) {
                    return "The model called a tool with invalid arguments.";
                } else if (ToolExecutionError.isInstance(error)) {
                    return "An error occurred during tool execution.";
                } else {
                    return "An unknown error occurred.";
                }
            },
        });;
    } catch (error) {
        console.error("Chat API error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process chat request" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
