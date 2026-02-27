import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CSSProperties } from 'react';

const prismTheme: { [key: string]: CSSProperties } | undefined = dracula;

export const MarkDownRendererCompo = ({ content }: { content: string }) => {
    return (
        <div className="text-neutral-700">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ ...props }) => (
                        <h1
                            className="text-xl font-bold mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h2: ({ ...props }) => (
                        <h2
                            className="text-lg font-bold mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h3: ({ ...props }) => (
                        <h3
                            className="text-md font-bold mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h4: ({ ...props }) => (
                        <h4
                            className="text-sm font-bold mt-4 mb-2"
                            {...props}
                        />
                    ),
                    p: ({ ...props }) => (
                        <p className="mb-2 leading-relaxed" {...props} />
                    ),
                    a: ({ ...props }) => (
                        <a
                            className="text-[#00d492] hover:underline"
                            {...props}
                        />
                    ),
                    ul: ({ ...props }) => (
                        <ul
                            className="list-disc list-inside ml-4 mb-2"
                            {...props}
                        />
                    ),
                    ol: ({ ...props }) => (
                        <ol
                            className="list-decimal list-inside ml-4 mb-2"
                            {...props}
                        />
                    ),
                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                    strong: ({ ...props }) => (
                        <strong className="font-semibold" {...props} />
                    ),
                    em: ({ ...props }) => <em className=" italic" {...props} />,
                    blockquote: ({ ...props }) => (
                        <blockquote
                            className="border-l-4 border-neutral-300 pl-4 italic text-neutral-400 my-4"
                            {...props}
                        />
                    ),
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                        const { ref, ...rest } = props as any;
                        return match ? (
                            <SyntaxHighlighter
                                language={match[1]}
                                PreTag="div"
                                {...rest}
                                style={prismTheme}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code
                                className="bg-neutral-100 p-1 rounded font-mono text-sm"
                                {...rest}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre: ({ ...props }) => (
                        <pre
                            className="bg-neutral-800 text-white p-3 rounded-md overflow-x-auto font-mono text-sm my-4"
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
