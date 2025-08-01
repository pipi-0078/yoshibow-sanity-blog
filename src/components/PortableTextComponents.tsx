import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import { createSlug } from "@/utils/toc";
import CustomTable from "./CustomTable";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// 見出しにIDを追加するためのヘルパー関数
function createPortableTextComponents(content: any[] = []): PortableTextComponents {
  return {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value)?.width(800).height(450).url();
      
      if (!imageUrl) {
        return null;
      }

      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || "記事内の画像"}
            width={800}
            height={450}
            className="rounded-lg shadow-lg w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-600 mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => {
      return (
        <div className="my-6">
          {value.filename && (
            <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg border-b border-gray-700">
              📄 {value.filename}
            </div>
          )}
          <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${
            value.filename ? 'rounded-b-lg' : 'rounded-lg'
          }`}>
            <code className={`language-${value.language || 'text'}`}>
              {value.code}
            </code>
          </pre>
        </div>
      );
    },
    customTable: ({ value }) => {
      return <CustomTable value={value} />;
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children, value }) => {
      const text = value?.children?.map((child: any) => child.text).join('') || '';
      const blockIndex = content.findIndex(block => 
        block._type === 'block' && 
        block.style === 'h2' && 
        block.children?.map((child: any) => child.text).join('') === text
      );
      const id = createSlug(text, blockIndex);
      return (
        <h2 id={id} className="text-2xl font-bold mt-6 mb-3 scroll-mt-4">
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const text = value?.children?.map((child: any) => child.text).join('') || '';
      const blockIndex = content.findIndex(block => 
        block._type === 'block' && 
        block.style === 'h3' && 
        block.children?.map((child: any) => child.text).join('') === text
      );
      const id = createSlug(text, blockIndex);
      return (
        <h3 id={id} className="text-xl font-bold mt-5 mb-2 scroll-mt-4">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-700 bg-blue-50 rounded-r-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-7">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{
        listStyleType: 'disc',
        listStylePosition: 'outside',
        paddingLeft: '2rem',
        marginBottom: '1rem'
      }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
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
    bullet: ({ children }) => (
      <li style={{
        display: 'list-item',
        marginBottom: '0.5rem',
        lineHeight: '1.6'
      }}>
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li style={{
        display: 'list-item',
        marginBottom: '0.5rem',
        lineHeight: '1.6'
      }}>
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    underline: ({ children }) => (
      <span className="underline">{children}</span>
    ),
    "strike-through": ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline transition-colors"
      >
        {children}
      </a>
    ),
  },
  };
}

// デフォルトエクスポート用（後方互換性のため）
export const portableTextComponents = createPortableTextComponents();

// 目次機能付きコンポーネント
export { createPortableTextComponents };