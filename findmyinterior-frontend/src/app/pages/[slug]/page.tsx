import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import api from '@/lib/api';

interface PageProps {
  params: { slug: string };
}

async function getSeoPage(slug: string) {
  try {
    const res = await api.get(`/seo-pages/${slug}`);
    return res.data?.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getSeoPage(params.slug);
  
  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
  };
}

export default async function SeoLandingPage({ params }: PageProps) {
  const page = await getSeoPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dynamic Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
          {page.meta_description && (
            <p className="text-xl text-gray-600">{page.meta_description}</p>
          )}
        </div>
      </div>

      {/* Dynamic Content (Shortcodes Parsed by Backend) */}
      <div className="container mx-auto px-4 max-w-4xl py-12 flex-grow">
        {page.content && (
          <div 
            className="prose prose-lg max-w-none prose-blue"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}

        {/* Dynamic Blocks rendering (e.g. from Editor.js) */}
        {page.blocks_json && page.blocks_json.blocks && (
          <div className="mt-12 space-y-8">
            {page.blocks_json.blocks.map((block: any, idx: number) => {
              // Example block rendering based on type
              if (block.type === 'header') {
                return React.createElement(`h${block.data.level || 2}`, { key: idx, className: 'font-bold text-gray-900' }, block.data.text);
              }
              if (block.type === 'paragraph') {
                return <p key={idx} className="text-gray-700" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              }
              if (block.type === 'image') {
                return <img key={idx} src={block.data.url} alt={block.data.caption} className="rounded-lg shadow-md w-full" />;
              }
              return null;
            })}
          </div>
        )}
      </div>
      
      {/* Schema injection */}
      {page.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema_json) }}
        />
      )}
    </div>
  );
}
