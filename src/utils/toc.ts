// 目次生成用のユーティリティ関数

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// PortableTextからH2、H3見出しを抽出して目次を生成
export function generateToc(content: any[]): TocItem[] {
  const tocItems: TocItem[] = [];
  
  content.forEach((block, index) => {
    if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
      const text = block.children
        ?.map((child: any) => child.text)
        .join('') || '';
      
      if (text.trim()) {
        const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        tocItems.push({
          id,
          text: text.trim(),
          level: block.style === 'h2' ? 2 : 3
        });
      }
    }
  });
  
  return tocItems;
}

// 最初のH2見出しのインデックスを見つける
export function findFirstH2Index(content: any[]): number {
  return content.findIndex(block => 
    block._type === 'block' && block.style === 'h2'
  );
}

// テキストからスラッグ（ID）を生成
export function createSlug(text: string, index: number): string {
  return `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}