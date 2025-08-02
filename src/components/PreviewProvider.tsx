'use client'

import { createClient } from 'next-sanity'

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string
}) {
  return <>{children}</>
}