'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    defaultVisible?: number;
}

export default function News({ items, title = 'News', defaultVisible = 5 }: NewsProps) {
    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? items : items.slice(0, defaultVisible);
    const hasMore = items.length > defaultVisible;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30 px-5 py-1 divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
                <AnimatePresence initial={false}>
                    {visibleItems.map((item, index) => (
                        <motion.div
                            key={item.date + index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, delay: index >= defaultVisible ? (index - defaultVisible) * 0.05 : 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-start gap-4 py-3">
                                <span className="text-xs font-semibold text-accent/80 dark:text-accent-light/80 mt-0.5 w-18 flex-shrink-0 tabular-nums">{item.date}</span>
                                <div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 prose prose-sm max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-800 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 prose-p:my-0">
                                    <ReactMarkdown>{item.content}</ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {hasMore && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark dark:hover:text-accent-light transition-colors cursor-pointer"
                >
                    {expanded ? (
                        <>
                            Show less
                            <ChevronUpIcon className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            Show all {items.length} news
                            <ChevronDownIcon className="w-4 h-4" />
                        </>
                    )}
                </button>
            )}
        </motion.section>
    );
}
