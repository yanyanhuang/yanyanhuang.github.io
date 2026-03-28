'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { BeakerIcon, LinkIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Github } from 'lucide-react';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] border-l-3 border-l-[#7c9ab5] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
                    >
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            {pub.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                        {author.name}
                                    </span>
                                    {author.isCoAuthor && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>#</sup>
                                    )}
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2 font-bold">
                            {pub.journal || pub.conference}{pub.year && `, ${pub.year}`}
                        </p>
                        {pub.description && (
                            <>
                                <AnimatePresence>
                                    {expandedId === pub.id && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 overflow-hidden bg-neutral-100 dark:bg-neutral-700/50 rounded-md p-3 leading-relaxed"
                                        >
                                            {pub.description}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {pub.description && (
                                <button
                                    onClick={() => setExpandedId(expandedId === pub.id ? null : pub.id)}
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors cursor-pointer"
                                >
                                    {expandedId === pub.id ? (
                                        <><XMarkIcon className="h-3 w-3 mr-1" />Close</>
                                    ) : (
                                        <><InformationCircleIcon className="h-3 w-3 mr-1" />Details</>
                                    )}
                                </button>
                            )}
                            {pub.projectPage && (
                                <Link
                                    href={pub.projectPage}
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    <BeakerIcon className="h-3 w-3 mr-1" />
                                    Project
                                </Link>
                            )}
                            {pub.url && (
                                <a
                                    href={pub.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    <LinkIcon className="h-3 w-3 mr-1" />
                                    Paper
                                </a>
                            )}
                            {pub.code && (
                                <a
                                    href={pub.code}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    <Github className="h-3 w-3 mr-1" />
                                    Code
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
