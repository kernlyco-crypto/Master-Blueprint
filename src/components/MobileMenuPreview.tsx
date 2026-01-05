'use client'

import { useMenuStore, generateWhatsAppUrl } from '@/lib/store'
import { MessageCircle } from 'lucide-react'

const MobileMenuPreview = () => {
  const { brandInfo, categories, items } = useMenuStore()

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 p-4">
      {/* Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-10"></div>
        {/* Screen */}
        <div className="bg-white rounded-[2rem] overflow-hidden w-72 h-[600px] relative">
          {/* Content */}
          <div className="h-full overflow-y-auto font-almarai text-right" dir="rtl">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-white p-6 text-center">
              {brandInfo.logoUrl ? (
                <img src={brandInfo.logoUrl} alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white" />
              ) : (
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl">
                  Logo
                </div>
              )}
              <h1 className="text-2xl font-bold mb-2">{brandInfo.name || 'اسم المتجر'}</h1>
              <p className="text-lg opacity-90">{brandInfo.slogan || 'الشعار'}</p>
            </div>

            {/* Category Nav */}
            {categories.length > 0 && (
              <div className="sticky top-0 bg-white shadow-sm p-4 z-10">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="p-4 space-y-4">
              {categories.map((category) => {
                const categoryItems = items.filter(item => item.categoryId === category.id)
                return categoryItems.length > 0 ? (
                  <div key={category.id}>
                    <h2 className="text-xl font-bold mb-3 text-gray-800">{category.name}</h2>
                    <div className="space-y-3">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center">
                          {/* Text on left */}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                            <p className="text-yellow-600 font-bold mt-2">{item.price} {brandInfo.currency}</p>
                            <button
                              onClick={() => {
                                const url = generateWhatsAppUrl(brandInfo.phone, item.name, `${item.price} ${brandInfo.currency}`, brandInfo.name)
                                if (url) window.open(url, '_blank')
                              }}
                              className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              اطلب عبر واتساب
                            </button>
                          </div>
                          {/* Image on right */}
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl ml-4 object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenuPreview