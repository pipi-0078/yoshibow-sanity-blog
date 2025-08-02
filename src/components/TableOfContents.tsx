import { PortableTextBlock } from 'sanity'
import { slugify } from '@/utils/slugify'

// 目次の各項目の型定義
export interface TocItem {
  _key: string
  level: number // h1, h2, h3 などのレベル
  text: string
  slug: string
}

// 本文データから見出しを抽出する関数
const extractHeadings = (blocks: PortableTextBlock[]): TocItem[] => {
  if (!blocks) {
    return []
  }
  return blocks
    .filter((block) => block._type === 'block' && /^h[1-4]$/.test(block.style || ''))
    .map((block) => {
      const text = block.children
        .filter((child: any) => child._type === 'span')
        .map((span: any) => span.text)
        .join('')

      return {
        _key: block._key,
        level: Number(block.style?.replace('h', '')),
        text: text,
        slug: slugify(text), // テキストからID用のslugを生成
      }
    })
}

// 目次コンポーネント本体
type Props = {
  blocks: PortableTextBlock[]
}

const TableOfContents = ({ blocks }: Props) => {
  const headings = extractHeadings(blocks)

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="my-8 rounded-lg border bg-gray-50 p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900">📋 目次</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading._key}
            // levelに応じてインデントを調整 (例: h2 -> pl-0, h3 -> pl-4)
            style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
          >
            <a
              href={`#${heading.slug}`}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-sm"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents