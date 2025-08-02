import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return new Response('Slug parameter is required', { status: 400 })
  }

  try {
    // Draft Modeを先に有効にする
    draftMode().enable()
    
    // 記事ページに直接リダイレクト（NextResponseを使用）
    const url = new URL(`/${slug}`, request.url)
    return NextResponse.redirect(url)
    
  } catch (error) {
    console.error('Preview API error:', error)
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
}