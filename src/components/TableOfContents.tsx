import { TocItem } from '@/utils/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📋</span>
        目次
      </h2>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
              <a
                href={`#${item.id}`}
                className={`
                  block text-sm hover:text-blue-600 transition-colors
                  ${item.level === 2 
                    ? 'font-medium text-gray-900' 
                    : 'text-gray-700'
                  }
                `}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}