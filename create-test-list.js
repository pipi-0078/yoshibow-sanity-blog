// テスト用のリストデータを作成
import { client } from './src/sanity/client.js';

async function createTestListPost() {
  try {
    const testPost = {
      _type: 'post',
      title: 'リスト機能テスト投稿',
      slug: {
        _type: 'slug',
        current: 'list-test-post'
      },
      publishedAt: new Date().toISOString(),
      author: {
        _type: 'reference',
        _ref: 'ffcc2252-ca4b-461c-afbf-e350dafb17fb' // 既存の著者ID
      },
      body: [
        {
          _type: 'block',
          _key: 'intro',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'これはリスト機能のテスト投稿です。以下に箇条書きリストと番号付きリストを表示します。'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'heading1',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '箇条書きリスト'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'bullet1',
          style: 'normal',
          listItem: 'bullet',
          level: 0,
          children: [
            {
              _type: 'span',
              text: 'リスト項目1：これは最初の箇条書き項目です'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'bullet2',
          style: 'normal',
          listItem: 'bullet',
          level: 0,
          children: [
            {
              _type: 'span',
              text: 'リスト項目2：これは二番目の箇条書き項目です'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'bullet3',
          style: 'normal',
          listItem: 'bullet',
          level: 0,
          children: [
            {
              _type: 'span',
              text: 'リスト項目3：これは三番目の箇条書き項目です'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'heading2',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '番号付きリスト'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'number1',
          style: 'normal',
          listItem: 'number',
          level: 0,
          children: [
            {
              _type: 'span',
              text: '最初のステップ：準備をします'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'number2',
          style: 'normal',
          listItem: 'number',
          level: 0,
          children: [
            {
              _type: 'span',
              text: '二番目のステップ：実行します'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'number3',
          style: 'normal',
          listItem: 'number',
          level: 0,
          children: [
            {
              _type: 'span',
              text: '三番目のステップ：確認します'
            }
          ]
        }
      ]
    };

    const result = await client.create(testPost);
    console.log('✅ テスト投稿が作成されました:', result.title);
    console.log('   スラッグ:', result.slug.current);
    console.log('   ID:', result._id);
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

createTestListPost();