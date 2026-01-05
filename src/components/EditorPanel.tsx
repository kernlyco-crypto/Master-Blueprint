'use client'

import { useMenuStore } from '@/lib/store'
import LZString from 'lz-string'

const EditorPanel = () => {
  const { brandInfo, categories, items, setBrandInfo, addCategory, updateCategory, removeCategory, addItem, updateItem, removeItem, reorderCategory, reorderItem } = useMenuStore()

  const handleShare = () => {
    const state = { brandInfo, categories, items, theme: useMenuStore.getState().theme }
    const json = JSON.stringify(state)
    const compressed = LZString.compressToEncodedURIComponent(json)
    const url = window.location.origin + '#data=' + compressed
    if (url.length > 2000) {
      alert('Link is long (contains uploaded images). Use Hash method.')
    }
    navigator.clipboard.writeText(url).then(() => {
      alert('Link Copied!')
    }).catch(() => {
      alert('Failed to copy, please copy manually: ' + url)
    })
  }

  const handleAddCategory = () => {
    const name = prompt('اسم القسم الجديد:')
    if (name) {
      addCategory({ name })
    }
  }

  const handleRemoveCategory = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      removeCategory(id)
    }
  }

  const handleAddItem = (categoryId: string) => {
    const name = prompt('اسم العنصر الجديد:')
    if (name) {
      addItem({ categoryId, name, price: 0, description: '', image: '', imageType: 'url' })
    }
  }

  const handleRemoveItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      removeItem(id)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col items-center space-y-2 mb-4">
        <button onClick={handleShare} className="bg-green-500 text-white px-4 py-2 rounded">Share / Publish</button>
        <p className="text-sm text-gray-600">Note: Large images make the link very long. Use small images for best results.</p>
      </div>
      <details className="border rounded p-2">
        <summary className="cursor-pointer font-semibold">هوية العلامة التجارية</summary>
        <div className="mt-2 space-y-2">
          <div>
            <label className="block text-sm font-medium">اسم المتجر</label>
            <input
              type="text"
              value={brandInfo.name}
              onChange={(e) => setBrandInfo({ name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="اسم المتجر"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">الشعار</label>
            <input
              type="text"
              value={brandInfo.slogan}
              onChange={(e) => setBrandInfo({ slogan: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="الشعار"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">رقم الواتساب</label>
            <input
              type="text"
              value={brandInfo.phone}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*$/.test(value)) {
                  setBrandInfo({ phone: value })
                }
              }}
              className="w-full p-2 border rounded"
              placeholder="رقم الواتساب"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">الشعار</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => {
                    setBrandInfo({ logoUrl: reader.result as string })
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full p-2 border rounded"
            />
            {brandInfo.logoUrl && <img src={brandInfo.logoUrl} alt="Logo" className="w-20 h-20 mt-2" />}
          </div>
        </div>
      </details>
      <details className="border rounded p-2">
        <summary className="cursor-pointer font-semibold">مدير القائمة</summary>
        <div className="mt-2">
          <button onClick={handleAddCategory} className="bg-blue-500 text-white px-4 py-2 rounded">إضافة قسم جديد</button>
          <div className="mt-4 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="border p-2 rounded">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <button onClick={() => reorderCategory(category.id, 'up')} className="px-2 py-1 bg-gray-500 text-white rounded mr-1">↑</button>
                  <button onClick={() => reorderCategory(category.id, 'down')} className="px-2 py-1 bg-gray-500 text-white rounded mr-1">↓</button>
                  <button onClick={() => handleRemoveCategory(category.id)} className="px-2 py-1 bg-red-500 text-white rounded">حذف</button>
                </div>
                <div className="mt-2">
                  <button onClick={() => handleAddItem(category.id)} className="bg-green-500 text-white px-4 py-2 rounded">إضافة عنصر</button>
                  <div className="mt-2 space-y-2">
                    {items.filter(item => item.categoryId === category.id).map((item) => (
                      <div key={item.id} className="border p-2 rounded flex items-center">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, { name: e.target.value })}
                            className="w-full p-1 border rounded mb-1"
                            placeholder="الاسم"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                            className="w-full p-1 border rounded mb-1"
                            placeholder="السعر"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            className="w-full p-1 border rounded mb-1"
                            placeholder="الوصف"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = () => {
                                  updateItem(item.id, { image: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="w-full p-1 border rounded"
                          />
                          {item.image && <img src={item.image} alt="Item" className="w-10 h-10 mt-1" />}
                        </div>
                        <div className="ml-2">
                          <button onClick={() => reorderItem(item.id, 'up')} className="block px-2 py-1 bg-gray-500 text-white rounded mb-1">↑</button>
                          <button onClick={() => reorderItem(item.id, 'down')} className="block px-2 py-1 bg-gray-500 text-white rounded mb-1">↓</button>
                          <button onClick={() => handleRemoveItem(item.id)} className="block px-2 py-1 bg-red-500 text-white rounded">حذف</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}

export default EditorPanel