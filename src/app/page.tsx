'use client'

import { useState, useEffect } from 'react'

import EditorPanel from '@/components/EditorPanel'
import MobileMenuPreview from '@/components/MobileMenuPreview'
import { useMenuStore } from '@/lib/store'
import LZString from 'lz-string'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const isViewMode = useMenuStore((state) => state.isViewMode)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#data=')) {
      const data = hash.slice(6)
      const decompressed = LZString.decompressFromEncodedURIComponent(data)
      const parsed = JSON.parse(decompressed)
      useMenuStore.setState({
        brandInfo: { logoType: 'url', ...parsed.brandInfo },
        categories: parsed.categories,
        items: parsed.items.map(item => ({ imageType: 'url', ...item })),
        theme: parsed.theme,
        isViewMode: true
      })
    }
  }, [])

  if (isViewMode) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
          <MobileMenuPreview />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Desktop */}
      <div className="hidden md:block w-1/2 border-r">
        <EditorPanel />
      </div>
      <div className="hidden md:block w-1/2">
        <MobileMenuPreview />
      </div>
      {/* Mobile */}
      <div className="md:hidden flex flex-col h-full">
        <div className="flex">
          <button
            className={`flex-1 p-2 ${activeTab === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('edit')}
          >
            Edit
          </button>
          <button
            className={`flex-1 p-2 ${activeTab === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {activeTab === 'edit' ? <EditorPanel /> : <MobileMenuPreview />}
        </div>
      </div>
    </div>
  )
}