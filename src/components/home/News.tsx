'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div 
                className="max-h-48 overflow-y-auto pr-2 space-y-3 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900/30"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d4d4d8 transparent'
                }}
            >
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <div className="text-sm text-neutral-700 dark:text-neutral-400 prose prose-sm max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-800 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100">
                            <ReactMarkdown>{item.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
