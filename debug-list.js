// リスト機能のデバッグ用スクリプト
import { client } from './src/sanity/client.js';

async function debugListData() {
  try {
    // 全ての投稿を取得してbody内のリスト構造を確認
    const posts = await client.fetch(`
      *[_type == "post"] {
        title,
        slug,
        body[] {
          ...,
          _type == 'block' => {
            ...,
            listItem,
            level,
            style,
            children[] {
              ...,
              _type == 'span' => {
                text,
                marks
              }
            }
          }
        }
      }
    `);
    
    console.log('=== Sanity投稿データ ===');
    posts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      
      if (post.body) {
        const listBlocks = post.body.filter(block => 
          block._type === 'block' && block.listItem
        );
        
        if (listBlocks.length > 0) {
          console.log('  📝 リストブロック発見:');
          listBlocks.forEach((block, blockIndex) => {
            console.log(`    ${blockIndex + 1}. タイプ: ${block.listItem}, レベル: ${block.level || 0}`);
            console.log(`       テキスト: ${block.children?.map(child => child.text).join('') || 'なし'}`);
          });
        } else {
          console.log('  ❌ リストブロックなし');
        }
      }
    });
    
    // 特定のリスト構造をテスト
    console.log('\n=== リスト構造テスト ===');
    const testQuery = `
      *[_type == "post" && body[].listItem != null][0] {
        title,
        body[listItem != null] {
          _type,
          listItem,
          level,
          children[] {
            text
          }
        }
      }
    `;
    
    const testResult = await client.fetch(testQuery);
    console.log('リストを含む投稿:', JSON.stringify(testResult, null, 2));
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

debugListData();