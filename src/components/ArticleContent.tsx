import { PortableText } from "next-sanity";
import { generateToc, findFirstH2Index } from "@/utils/toc";
import { createPortableTextComponents } from "./PortableTextComponents";
import { TableOfContents } from "./TableOfContents";

interface ArticleContentProps {
  content: unknown[];
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  // 目次を生成
  const tocItems = generateToc(content);
  const firstH2Index = findFirstH2Index(content);
  
  // 目次を表示するかどうか（H2見出しが2つ以上ある場合のみ表示）
  const shouldShowToc = tocItems.filter(item => item.level === 2).length >= 2;
  
  // 最初のH2見出しの前に目次を挿入
  const contentWithToc = [...content];
  if (shouldShowToc && firstH2Index >= 0) {
    // 目次用の特別なブロックを作成
    const tocBlock = {
      _type: 'tableOfContents',
      _key: 'toc',
      items: tocItems
    };
    
    // 最初のH2見出しの前に目次を挿入
    contentWithToc.splice(firstH2Index, 0, tocBlock);
  }

  // PortableTextコンポーネントを生成（元のcontentを渡してID生成用に使用）
  const components = createPortableTextComponents(content);
  
  // 目次コンポーネントを追加
  const enhancedComponents = {
    ...components,
    types: {
      ...components.types,
      tableOfContents: ({ value }: { value: { items: unknown[] } }) => (
        <TableOfContents items={value.items} />
      ),
    },
  };

  return (
    <div className="max-w-none">
      <PortableText 
        value={contentWithToc} 
        components={enhancedComponents}
      />
    </div>
  );
}