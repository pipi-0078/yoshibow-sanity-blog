'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal'

interface ClickableImageProps {
  src: string
  alt: string
  className?: string
  width: number
  height: number
  priority?: boolean
}

export default function ClickableImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority 
}: ClickableImageProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div 
        className={`relative cursor-pointer group ${className || ''}`}
        onClick={() => setModalOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          className="transition-transform duration-200 group-hover:scale-[1.02]"
          width={width}
          height={height}
          priority={priority}
        />
        {/* 拡大アイコン */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 rounded-full p-3">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        src={src}
        alt={alt}
      />
    </>
  )
}