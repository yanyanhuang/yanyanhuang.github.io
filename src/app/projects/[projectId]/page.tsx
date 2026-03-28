import { notFound } from 'next/navigation';
import { getMarkdownContent, getTomlContent } from '@/lib/content';
import TextPage from '@/components/pages/TextPage';
import { TextPageConfig } from '@/types/page';
import { Metadata } from 'next';

// Generate static params for all projects
export function generateStaticParams() {
    // For now, we only have flex project
    return [
        { projectId: 'flex' }
    ];
}

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }): Promise<Metadata> {
    const { projectId } = await params;
    const pageConfig = getTomlContent<TextPageConfig>(`projects/${projectId}.toml`);

    if (!pageConfig) {
        return {};
    }

    return {
        title: pageConfig.title,
        description: pageConfig.description,
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const pageConfig = getTomlContent<TextPageConfig>(`projects/${projectId}.toml`);

    if (!pageConfig) {
        notFound();
    }

    const content = getMarkdownContent(pageConfig.source);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <TextPage config={pageConfig} content={content} />
        </div>
    );
}

