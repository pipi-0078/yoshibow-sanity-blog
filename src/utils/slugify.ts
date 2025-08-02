export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // スペースをハイフンに
    .replace(/[^\w-]+/g, '') // 英数字とハイフン以外を削除
    .replace(/--+/g, '-') // 連続するハイフンを一つに
}