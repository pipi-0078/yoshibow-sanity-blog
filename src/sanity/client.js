import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "a4407dxdp8z0m8sfhp4z5ztp",
  dataset: "default",
  apiVersion: "2024-05-01",
  useCdn: false,
  perspective: "published",
});

// プレビューモード用のクライアント
export const previewClient = createClient({
  projectId: "a4407dxdp8z0m8sfhp4z5ztp",
  dataset: "default", 
  apiVersion: "2024-05-01",
  useCdn: false,
  perspective: "drafts", // previewDrafts から drafts に変更
  ignoreBrowserTokenWarning: true,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});