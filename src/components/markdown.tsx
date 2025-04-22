import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'
import { MathJax, MathJaxContext } from 'better-react-mathjax';



const components: Partial<Components> = {

    code({ className, children }) {
        const match = /language-(\w+)/.exec(className || "");
        const code = String(children).replace(/\n$/, "");
        const lang = match?.[1] || "plaintext";
        const handleCopy = () => navigator.clipboard.writeText(code);

        if (match && match[1] !== "latex") {
            return (
                <div className="not-prose my-4 rounded-lg bg-[rgb(40,44,52)] border border-white/10 shadow-sm">
                    <div className="flex justify-between px-4 py-4 bg-[rgb(40,44,52)] rounded-t-lg">
                        <span className="text-xs uppercase font-mono text-muted-foreground">{lang}</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleCopy} className="px-3 py-1.5 text-sm text-white bg-zinc-800 rounded-md hover:bg-zinc-700">
                                        <Copy className="w-4 h-4 inline mr-1" /> Copy
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Copy code</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <SyntaxHighlighter
                        style={oneDark}
                        language={lang}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: "1rem", background: "transparent" }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            );
        }

        return <code className="rounded bg-muted px-1 py-0.5 text-sm">{children}</code>;
    },

    pre({ children }) {
        return (
            <pre className='inline pb-8 p-0'>{children}</pre>
        );
    },

    p: ({ children, ...props }) => {
        return (
            <p className='mb-1 leading-relaxed' {...props}>
                {children}
            </p>
        )
    },

    ol: ({ children, ...props }) => {
        return (
            <ol className="list-decimal list-outside ml-4" {...props}>
                {children}
            </ol>
        );
    },
    li: ({ children, ...props }) => {
        return (
            <li className="py-1" {...props}>
                {children}
            </li>
        );
    },
    ul: ({ children, ...props }) => {
        return (
            <ul className="list-decimal list-outside ml-4" {...props}>
                {children}
            </ul>
        );
    },
    strong: ({ children, ...props }) => {
        return (
            <span className="font-semibold" {...props}>
                {children}
            </span>
        );
    },
    a: ({ children, ...props }) => {
        return (
            // @ts-expect-error no href provided.
            <Link
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noreferrer"
                {...props}
            >
                {children}
            </Link>
        );
    },
    h1: ({ children, ...props }) => {
        return (
            <h1 className="text-3xl font-semibold" {...props}>
                {children}
            </h1>
        );
    },
    h2: ({ children, ...props }) => {
        return (
            <h2 className="text-2xl font-semibold" {...props}>
                {children}
            </h2>
        );
    },
    h3: ({ children, ...props }) => {
        return (
            <h3 className="text-xl font-semibold" {...props}>
                {children}
            </h3>
        );
    },
    h4: ({ children, ...props }) => {
        return (
            <h4 className="text-lg font-semibold" {...props}>
                {children}
            </h4>
        );
    },
    h5: ({ children, ...props }) => {
        return (
            <h5 className="text-base font-semibold" {...props}>
                {children}
            </h5>
        );
    },
    h6: ({ children, ...props }) => {
        return (
            <h6 className="text-sm font-semibold" {...props}>
                {children}
            </h6>
        );
    },

};

const remarkPlugins = [remarkGfm, remarkMath];


const mathJaxConfig = {
    loader: { load: ['[tex]/ams'] },
    tex: {
        inlineMath: [['$', '$']],
        displayMath: [['\[', '\]'], ['$$', '$$'], ['\(\\', '\)\\']],   // square brackets for display math. AI sometimes renders things without perfect LaTeX syntax.
        packages: { '[+]': ['ams'] },
    },
};



const NonMemoizedMarkdown = ({ children }: { children: string }) => {
    return (
        <MathJaxContext config={mathJaxConfig} version={3}>
            <MathJax dynamic>
                <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={[rehypeMathjax]} components={components}>
                    {children}
                </ReactMarkdown>
            </MathJax>
        </MathJaxContext>
    );
};

export const Markdown = memo(
    NonMemoizedMarkdown,
    (prevProps, nextProps) => prevProps.children === nextProps.children,
);