'use client'

import React from 'react';
import { PortableText } from 'next-sanity';

// テスト用のリストデータ
const testListData = [
  {
    _type: 'block',
    _key: 'test-normal',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: '通常のテキストです。'
      }
    ]
  },
  {
    _type: 'block',
    _key: 'test-bullet-1',
    style: 'normal',
    listItem: 'bullet',
    level: 0,
    children: [
      {
        _type: 'span',
        text: '箇条書き項目1'
      }
    ]
  },
  {
    _type: 'block',
    _key: 'test-bullet-2',
    style: 'normal',
    listItem: 'bullet',
    level: 0,
    children: [
      {
        _type: 'span',
        text: '箇条書き項目2'
      }
    ]
  },
  {
    _type: 'block',
    _key: 'test-number-1',
    style: 'normal',
    listItem: 'number',
    level: 0,
    children: [
      {
        _type: 'span',
        text: '番号付き項目1'
      }
    ]
  },
  {
    _type: 'block',
    _key: 'test-number-2',
    style: 'normal',
    listItem: 'number',
    level: 0,
    children: [
      {
        _type: 'span',
        text: '番号付き項目2'
      }
    ]
  }
];

// デバッグ用コンポーネント定義
const debugComponents = {
  block: {
    normal: ({ children, value }: { children: any, value: any }) => {
      console.log('Block (normal):', value);
      
      // listItemがある場合の処理
      if (value.listItem) {
        console.log('List item detected:', value.listItem, 'level:', value.level);
        return null; // listとlistItemで処理するため、ここでは何も返さない
      }
      
      return <p className="mb-4 text-gray-800">{children}</p>;
    },
  },
  list: {
    bullet: ({ children }: { children: any }) => {
      console.log('List (bullet):', children);
      return (
        <ul style={{
          listStyleType: 'disc',
          listStylePosition: 'outside',
          paddingLeft: '2rem',
          marginBottom: '1rem',
          color: '#374151',
          backgroundColor: '#f3f4f6' // デバッグ用背景色
        }}>
          {children}
        </ul>
      );
    },
    number: ({ children }: { children: any }) => {
      console.log('List (number):', children);
      return (
        <ol style={{
          listStyleType: 'decimal',
          listStylePosition: 'outside',
          paddingLeft: '2rem',
          marginBottom: '1rem',
          color: '#374151',
          backgroundColor: '#fef3c7' // デバッグ用背景色
        }}>
          {children}
        </ol>
      );
    },
  },
  listItem: {
    bullet: ({ children }: { children: any }) => {
      console.log('ListItem (bullet):', children);
      return (
        <li style={{
          display: 'list-item',
          marginBottom: '0.5rem',
          lineHeight: '1.6',
          color: '#374151',
          border: '1px solid #e5e7eb' // デバッグ用ボーダー
        }}>
          {children}
        </li>
      );
    },
    number: ({ children }: { children: any }) => {
      console.log('ListItem (number):', children);
      return (
        <li style={{
          display: 'list-item',
          marginBottom: '0.5rem',
          lineHeight: '1.6',
          color: '#374151',
          border: '1px solid #fbbf24' // デバッグ用ボーダー
        }}>
          {children}
        </li>
      );
    },
  },
};

export default function ListDebugComponent() {
  return (
    <div className="p-6 bg-white border rounded-lg">
      <h2 className="text-xl font-bold mb-4">リスト機能デバッグコンポーネント</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">テストデータ:</h3>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(testListData, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">PortableText出力:</h3>
        <div className="border p-4 rounded">
          <PortableText 
            value={testListData} 
            components={debugComponents}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">直接HTML出力（参考）:</h3>
        <div className="border p-4 rounded">
          <p className="mb-4 text-gray-800">通常のテキストです。</p>
          <ul style={{
            listStyleType: 'disc',
            listStylePosition: 'outside',
            paddingLeft: '2rem',
            marginBottom: '1rem',
            color: '#374151'
          }}>
            <li style={{ marginBottom: '0.5rem', color: '#374151' }}>箇条書き項目1</li>
            <li style={{ marginBottom: '0.5rem', color: '#374151' }}>箇条書き項目2</li>
          </ul>
          <ol style={{
            listStyleType: 'decimal',
            listStylePosition: 'outside',
            paddingLeft: '2rem',
            marginBottom: '1rem',
            color: '#374151'
          }}>
            <li style={{ marginBottom: '0.5rem', color: '#374151' }}>番号付き項目1</li>
            <li style={{ marginBottom: '0.5rem', color: '#374151' }}>番号付き項目2</li>
          </ol>
        </div>
      </div>
    </div>
  );
}