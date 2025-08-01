'use client'

import { PortableTextBlock } from 'sanity';
import { slugify } from '@/utils/slugify';
import TableOfContents from "./TableOfContents";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { useState } from 'react';
import ImageModal from './ImageModal';
import CustomTable from './CustomTable';
import { PortableText } from 'next-sanity';

const { projectId, dataset } = { projectId: "479cjhmz", dataset: "production" };
const urlFor = (source: any) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

interface ArticleContentProps {
  content: PortableTextBlock[];
}

export function ArticleContent({ content }: ArticleContentProps) {
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  // 最初のH2見出しのインデックスを見つける
  const firstH2Index = content.findIndex(
    (block) => block._type === 'block' && block.style === 'h2'
  );

  // 目次を挿入したコンテンツを作成
  const contentWithToc = [...content];
  if (firstH2Index >= 0) {
    // 目次用の特別なブロックを作成
    const tocBlock = {
      _type: 'tableOfContents',
      _key: 'toc-block',
      blocks: content
    };
    
    // 最初のH2見出しの直前に目次を挿入
    contentWithToc.splice(firstH2Index, 0, tocBlock);
  }

  // PortableTextコンポーネントの設定
  const components = {
    block: {
      // 見出し要素にIDを付与する
      h1: ({ children }: { children: any }) => {
        const slug = slugify(children?.toString() || '')
        return (
          <h1 id={slug} className="text-4xl font-bold mt-12 mb-6 text-gray-900 border-b border-gray-200 pb-2">
            {children}
          </h1>
        )
      },
      h2: ({ children }: { children: any }) => {
        const slug = slugify(children?.toString() || '')
        return (
          <h2 id={slug} className="text-3xl font-bold mt-10 mb-5 text-gray-900">
            {children}
          </h2>
        )
      },
      h3: ({ children }: { children: any }) => {
        const slug = slugify(children?.toString() || '')
        return (
          <h3 id={slug} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            {children}
          </h3>
        )
      },
      h4: ({ children }: { children: any }) => {
        const slug = slugify(children?.toString() || '')
        return (
          <h4 id={slug} className="text-xl font-bold mt-6 mb-3 text-gray-900">
            {children}
          </h4>
        )
      },
      normal: ({ children }: { children: any }) => (
        <p className="mb-4 leading-relaxed">{children}</p>
      ),
      blockquote: ({ children }: { children: any }) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 italic text-gray-800">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: { children: any }) => (
        <ul style={{
          listStyleType: 'disc',
          listStylePosition: 'outside',
          paddingLeft: '2rem',
          marginBottom: '1rem'
        }}>
          {children}
        </ul>
      ),
      number: ({ children }: { children: any }) => (
        <ol style={{
          listStyleType: 'decimal',
          listStylePosition: 'outside',
          paddingLeft: '2rem',
          marginBottom: '1rem'
        }}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: any }) => (
        <li style={{
          display: 'list-item',
          marginBottom: '0.5rem',
          lineHeight: '1.6'
        }}>
          {children}
        </li>
      ),
      number: ({ children }: { children: any }) => (
        <li style={{
          display: 'list-item',
          marginBottom: '0.5rem',
          lineHeight: '1.6'
        }}>
          {children}
        </li>
      ),
    },
    types: {
      image: ({ value }: { value: any }) => {
        const imageUrl = value.asset ? urlFor(value.asset)?.width(800).height(450).url() : null;
        const fullImageUrl = value.asset ? urlFor(value.asset)?.width(1200).height(800).url() : null;
        
        if (!imageUrl || !fullImageUrl) return null;
        
        return (
          <div className="my-8">
            <div 
              className="cursor-pointer"
              onClick={() => setModalImage({
                src: fullImageUrl,
                alt: value.alt || '',
                caption: value.caption
              })}
            >
              <Image
                src={imageUrl}
                alt={value.alt || ''}
                className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                width={800}
                height={450}
              />
            </div>
            {value.caption && (
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                {value.caption}
              </p>
            )}
          </div>
        );
      },
      tableOfContents: ({ value }: { value: { blocks: PortableTextBlock[] } }) => (
        <TableOfContents blocks={value.blocks} />
      ),
      customTable: CustomTable,
    },
    marks: {
      strong: ({ children }: { children: any }) => (
        <strong className="font-bold text-gray-900">{children}</strong>
      ),
      em: ({ children }: { children: any }) => (
        <em className="italic">{children}</em>
      ),
      link: ({ children, value }: { children: any; value: any }) => (
        <a 
          href={value.href} 
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="max-w-none article-content">
      {/* PortableTextコンポーネントを直接使用 */}
      <PortableText 
        value={contentWithToc} 
        components={components}
      />

      {/* 画像モーダル */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        src={modalImage?.src || ''}
        alt={modalImage?.alt || ''}
        caption={modalImage?.caption}
      />
    </div>
  );
}