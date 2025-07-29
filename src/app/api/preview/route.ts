import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return new Response('Slug parameter is required', { status: 400 })
  }

  try {
    // Draft Modeを先に有効にする
    draftMode().enable()
    
    // 記事ページに直接リダイレクト（存在チェックは記事ページ側で行う）
    redirect(`/${slug}`)
    
  } catch (error) {
    console.error('Preview API error:', error)
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
}