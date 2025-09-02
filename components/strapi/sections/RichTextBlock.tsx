'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RichTextBlockProps {
  section: {
    id: string;
    __typename: string;
    content: string;
  };
}

export function RichTextBlock({ section }: RichTextBlockProps) {
  if (!section.content) {
    return null;
  }

  // Get Strapi base URL for images
  const getStrapiImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:1337';
    return `${strapiBaseUrl}${url}`;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-secondary max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headings
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold text-secondary-900 mb-8 mt-12 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold text-secondary-900 mb-6 mt-10 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold text-secondary-900 mb-4 mt-8 first:mt-0">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-semibold text-secondary-900 mb-4 mt-6 first:mt-0">
                    {children}
                  </h4>
                ),
                h5: ({ children }) => (
                  <h5 className="text-lg font-semibold text-secondary-900 mb-3 mt-4 first:mt-0">
                    {children}
                  </h5>
                ),
                h6: ({ children }) => (
                  <h6 className="text-base font-semibold text-secondary-900 mb-3 mt-4 first:mt-0">
                    {children}
                  </h6>
                ),
                
                // Paragraphs
                p: ({ children }) => {
                  // If paragraph contains only an image, don't wrap in p tag
                  const childArray = React.Children.toArray(children);
                  if (childArray.length === 1 && 
                      React.isValidElement(childArray[0]) && 
                      (childArray[0] as any).type === 'img') {
                    return <>{children}</>;
                  }
                  
                  return (
                    <p className="mb-6 text-secondary-700 leading-relaxed">
                      {children}
                    </p>
                  );
                },
                
                // Lists
                ul: ({ children }) => (
                  <ul className="mb-6 ml-6 space-y-2 list-disc">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-6 ml-6 space-y-2 list-decimal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-secondary-700 leading-relaxed">
                    {children}
                  </li>
                ),
                
                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary-500 pl-6 py-4 my-8 bg-secondary-50 italic text-lg text-secondary-700">
                    {children}
                  </blockquote>
                ),
                
                // Code
                pre: ({ children }) => (
                  <pre className="bg-secondary-900 text-secondary-100 p-6 rounded-lg my-6 overflow-x-auto">
                    {children}
                  </pre>
                ),
                code: ({ children, ...props }: any) => {
                  const isInline = !props.className || !props.className.includes('language-');
                  if (isInline) {
                    return (
                      <code className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="text-sm">
                      {children}
                    </code>
                  );
                },
                
                // Images
                img: ({ src, alt }) => {
                  const imageUrl = getStrapiImageUrl(src || '');
                  return (
                    <figure className="my-8">
                      <img
                        src={imageUrl}
                        alt={alt || ''}
                        className="w-full h-auto rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x400/f3f4f6/9ca3af?text=Image+Not+Found';
                        }}
                      />
                      {alt && (
                        <figcaption className="text-sm text-secondary-600 text-center mt-3 italic">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                },
                
                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-primary-600 hover:text-primary-700 underline transition-colors duration-200"
                    target={href?.startsWith('http') ? '_blank' : '_self'}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
                
                // Strong/Bold
                strong: ({ children }) => (
                  <strong className="font-bold text-secondary-900">
                    {children}
                  </strong>
                ),
                
                // Emphasis/Italic
                em: ({ children }) => (
                  <em className="italic">
                    {children}
                  </em>
                ),
                
                // Tables (if using remark-gfm)
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8">
                    <table className="min-w-full border border-secondary-200">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-secondary-50">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white">
                    {children}
                  </tbody>
                ),
                th: ({ children }) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider border border-secondary-200">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 text-sm text-secondary-900 border border-secondary-200">
                    {children}
                  </td>
                ),
              }}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}
