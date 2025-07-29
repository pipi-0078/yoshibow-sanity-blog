// タグ自動生成ユーティリティ (Next.js用)

// タグ候補辞書
const TAG_DICTIONARY = {
  // プログラミング言語
  'JavaScript': ['javascript', 'js', 'ジャバスクリプト'],
  'TypeScript': ['typescript', 'ts', 'タイプスクリプト'],
  'Python': ['python', 'パイソン'],
  'React': ['react', 'リアクト'],
  'Next.js': ['next.js', 'nextjs', 'ネクスト'],
  'Vue.js': ['vue.js', 'vue', 'ビュー'],
  'Node.js': ['node.js', 'nodejs', 'ノード'],
  'HTML': ['html', 'エイチティーエムエル'],
  'CSS': ['css', 'スタイルシート'],
  'Tailwind': ['tailwind', 'tailwindcss', 'テイルウィンド'],
  
  // フレームワーク・ライブラリ
  'Express': ['express', 'エクスプレス'],
  'Redux': ['redux', 'リダックス'],
  'GraphQL': ['graphql', 'グラフQL'],
  'REST': ['rest', 'api', 'レスト'],
  'Sanity': ['sanity', 'サニティ'],
  'Vercel': ['vercel', 'バーセル'],
  'Firebase': ['firebase', 'ファイアベース'],
  
  // 概念・技術
  'フロントエンド': ['フロントエンド', 'frontend', 'front-end'],
  'バックエンド': ['バックエンド', 'backend', 'back-end'],
  'API': ['api', 'エーピーアイ'],
  'データベース': ['データベース', 'database', 'db'],
  'セキュリティ': ['セキュリティ', 'security'],
  'パフォーマンス': ['パフォーマンス', 'performance', '最適化'],
  'レスポンシブ': ['レスポンシブ', 'responsive'],
  'UI/UX': ['ui', 'ux', 'ユーザビリティ', 'デザイン'],
  
  // 開発手法
  'Git': ['git', 'github', 'gitlab'],
  'Docker': ['docker', 'ドッカー'],
  'CI/CD': ['ci/cd', 'cicd', '継続的インテグレーション'],
  'テスト': ['テスト', 'test', 'testing'],
  'デバッグ': ['デバッグ', 'debug', 'debugging'],
  
  // ライフスタイル
  'ライフスタイル': ['ライフスタイル', '生活', '日常'],
  '健康': ['健康', 'ヘルス', '運動'],
  '旅行': ['旅行', '観光', 'トラベル'],
  '読書': ['読書', '本', 'book'],
  '料理': ['料理', 'クッキング', 'レシピ'],
  
  // 学習・成長
  '学習': ['学習', '勉強', 'study'],
  'チュートリアル': ['チュートリアル', 'tutorial', '入門'],
  'ベストプラクティス': ['ベストプラクティス', 'best practice'],
  'tips': ['tips', 'コツ', 'ヒント'],
  '初心者': ['初心者', 'beginner', '入門者'],
  '僧侶': ['僧侶', '坊さん', 'monk', '仏教'],
  '仏教': ['仏教', '仏法', 'buddhism', '法話'],
  '修行': ['修行', '瞑想', 'meditation', '精進']
};

// ポータブルテキストからプレーンテキストを抽出
function extractPlainText(content) {
  if (!Array.isArray(content)) return '';
  
  let text = '';
  content.forEach(block => {
    if (block._type === 'block') {
      block.children?.forEach(child => {
        if (child.text) {
          text += child.text + ' ';
        }
      });
    }
  });
  return text;
}

// タグの優先度を設定
function prioritizeTags(tags) {
  const priority = {
    // 高優先度：具体的な技術
    'React': 10,
    'Next.js': 10,
    'TypeScript': 10,
    'JavaScript': 9,
    'Sanity': 8,
    'Tailwind': 8,
    '僧侶': 10,
    '仏教': 9,
    
    // 中優先度：フレームワーク・ツール
    'Node.js': 7,
    'Express': 7,
    'GraphQL': 7,
    'Git': 6,
    'Docker': 6,
    
    // 低優先度：汎用的な概念
    'フロントエンド': 5,
    'バックエンド': 5,
    'API': 4,
    '学習': 3,
    'チュートリアル': 3
  };
  
  return tags.sort((a, b) => {
    const priorityA = priority[a] || 1;
    const priorityB = priority[b] || 1;
    return priorityB - priorityA;
  });
}

// 記事内容からタグを生成
export function generateTagsFromContent(content) {
  if (!Array.isArray(content)) return [];
  
  const plainText = extractPlainText(content).toLowerCase();
  const foundTags = new Set();
  
  // 辞書とマッチング
  Object.entries(TAG_DICTIONARY).forEach(([tag, keywords]) => {
    const isMatch = keywords.some(keyword => 
      plainText.includes(keyword.toLowerCase())
    );
    
    if (isMatch) {
      foundTags.add(tag);
    }
  });
  
  // 追加のキーワード検出（英数字の技術用語）
  const techPatterns = [
    /\b(scss|sass|less)\b/gi,
    /\b(webpack|vite|rollup)\b/gi,
    /\b(eslint|prettier|jest)\b/gi,
    /\b(mongodb|postgresql|mysql)\b/gi,
    /\b(aws|azure|gcp)\b/gi,
    /\b(nginx|apache)\b/gi,
    /\b(linux|ubuntu|centos)\b/gi,
    /\b(ios|android)\b/gi
  ];
  
  techPatterns.forEach(pattern => {
    const matches = plainText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        foundTags.add(match.toLowerCase());
      });
    }
  });
  
  // 日本語キーワード検出
  const japanesePatterns = [
    /プログラミング/g,
    /開発/g,
    /エンジニア/g,
    /システム/g,
    /アプリケーション/g,
    /ウェブサイト/g,
    /コーディング/g,
    /マークアップ/g,
    /修行/g,
    /瞑想/g,
    /法話/g
  ];
  
  japanesePatterns.forEach(pattern => {
    const matches = plainText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        foundTags.add(match);
      });
    }
  });
  
  // 結果を配列に変換し、優先度でソート
  const tagsArray = Array.from(foundTags);
  const prioritizedTags = prioritizeTags(tagsArray);
  
  // 5-8個に制限
  const finalTags = prioritizedTags.slice(0, Math.min(8, Math.max(5, prioritizedTags.length)));
  
  // 最低5個に満たない場合は汎用タグを追加
  if (finalTags.length < 5) {
    const genericTags = ['技術', 'プログラミング', '開発', 'Web', 'コーディング'];
    genericTags.forEach(tag => {
      if (finalTags.length < 5 && !finalTags.includes(tag)) {
        finalTags.push(tag);
      }
    });
  }
  
  return finalTags;
}

// タイトルからもタグを生成
export function generateTagsFromTitle(title) {
  const titleTags = generateTagsFromContent([{
    _type: 'block',
    children: [{ text: title }]
  }]);
  
  return titleTags;
}