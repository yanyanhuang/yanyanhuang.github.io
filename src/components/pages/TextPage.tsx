'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-5xl mx-auto"}
        >
            <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-lg font-semibold text-primary mt-5 mb-2">{children}</h4>,
                        h5: ({ children }) => <h5 className="text-base font-semibold text-primary mt-4 mb-2">{children}</h5>,
                        h6: ({ children }) => <h6 className="text-sm font-semibold text-primary mt-3 mb-2">{children}</h6>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-outside mb-4 space-y-2 ml-6 pl-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-2 ml-6 pl-1">{children}</ol>,
                        li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium hover:underline transition-colors"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                        img: ({ src, alt }) => {
                            if (!src) return null;
                            return (
                                <span className="block my-6">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={src} 
                                        alt={alt || ''} 
                                        className="mx-auto max-w-full h-auto rounded-lg shadow-md"
                                        style={{ maxWidth: '70%' }}
                                    />
                                    {alt && (
                                        <span className="block text-center text-sm text-neutral-500 dark:text-neutral-600 mt-2 italic">
                                            {alt}
                                        </span>
                                    )}
                                </span>
                            );
                        },
                        table: ({ children }) => (
                            <div className="my-6 overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                                    {children}
                                </table>
                            </div>
                        ),
                        thead: ({ children }) => (
                            <thead className="bg-neutral-100 dark:bg-neutral-900">
                                {children}
                            </thead>
                        ),
                        tbody: ({ children }) => (
                            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                                {children}
                            </tbody>
                        ),
                        tr: ({ children }) => (
                            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                                {children}
                            </tr>
                        ),
                        th: ({ children }) => (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                {children}
                            </th>
                        ),
                        td: ({ children }) => (
                            <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-600">
                                {children}
                            </td>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
