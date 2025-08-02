import { PortableText, PortableTextComponents } from 'next-sanity'

// Sanity標準のPortableTextコンポーネント設定
const components: PortableTextComponents = {
  // ブロック要素
  block: {
    h1: ({children}) => <h1 className="text-3xl font-bold mb-4 mt-8 text-gray-900">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-900">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-bold mb-2 mt-5 text-gray-900">{children}</h3>,
    h4: ({children}) => <h4 className="text-lg font-bold mb-2 mt-4 text-gray-900">{children}</h4>,
    normal: ({children}) => <p className="mb-4 leading-7 text-gray-800">{children}</p>,
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 italic text-gray-800">
        {children}
      </blockquote>
    ),
  },

  // リスト要素（最も重要）
  list: {
    bullet: ({children}) => (
      <ul className="list-disc pl-6 mb-4" style={{listStyleType: 'disc', listStylePosition: 'outside'}}>
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal pl-6 mb-4" style={{listStyleType: 'decimal', listStylePosition: 'outside'}}>
        {children}
      </ol>
    ),
  },

  // リストアイテム要素（最も重要）
  listItem: {
    bullet: ({children}) => <li className="mb-1 text-gray-800">{children}</li>,
    number: ({children}) => <li className="mb-1 text-gray-800">{children}</li>,
  },

  // マーク（装飾）
  marks: {
    strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    code: ({children}) => (
      <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    underline: ({children}) => <span className="underline">{children}</span>,
    'strike-through': ({children}) => <span className="line-through">{children}</span>,
    link: ({value, children}) => (
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
}

interface StandardPortableTextProps {
  value: any[]
  className?: string
}

export default function StandardPortableText({ value, className }: StandardPortableTextProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}