import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "479cjhmz",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  perspective: "published",
});

// プレビューモード用のクライアントを通常クライアントと同じ設定にして、クエリで下書きを取得
export const previewClient = createClient({
  projectId: "479cjhmz",
  dataset: "production", 
  apiVersion: "2023-05-03",
  useCdn: false,
  perspective: "raw", // raw perspectiveを使用して下書きも取得
  ignoreBrowserTokenWarning: true,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});