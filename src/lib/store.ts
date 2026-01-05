import { create } from 'zustand'

type BrandInfo = {
  name: string
  slogan: string
  logoUrl: string
  logoType: 'url' | 'upload'
  phone: string
  currency: string
}

type Category = {
  id: string
  name: string
}

type Item = {
  id: string
  categoryId: string
  name: string
  price: number
  description: string
  image: string
  imageType: 'url' | 'upload'
}

type Theme = {
  primaryColor: string
  fontStyle: string
}

type MenuState = {
  brandInfo: BrandInfo
  categories: Category[]
  items: Item[]
  theme: Theme
  isViewMode: boolean
}

type MenuActions = {
  setBrandInfo: (brandInfo: Partial<BrandInfo>) => void
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  removeCategory: (id: string) => void
  addItem: (item: Omit<Item, 'id'>) => void
  updateItem: (id: string, updates: Partial<Item>) => void
  removeItem: (id: string) => void
  reorderCategory: (id: string, direction: 'up' | 'down') => void
  reorderItem: (id: string, direction: 'up' | 'down') => void
  setTheme: (theme: Partial<Theme>) => void
  setViewMode: (isViewMode: boolean) => void
}

type MenuStore = MenuState & MenuActions

export const useMenuStore = create<MenuStore>((set, get) => ({
  brandInfo: {
    name: '',
    slogan: '',
    logoUrl: '',
    logoType: 'url',
    phone: '',
    currency: 'SAR',
  },
  categories: [],
  items: [],
  theme: {
    primaryColor: '#007bff',
    fontStyle: 'Arial',
  },
  isViewMode: false,
  setBrandInfo: (updates) => set((state) => ({
    brandInfo: { ...state.brandInfo, ...updates }
  })),
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { ...category, id: Date.now().toString() }]
  })),
  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
  })),
  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter(cat => cat.id !== id),
    items: state.items.filter(item => item.categoryId !== id)
  })),
  addItem: (item) => set((state) => ({
    items: [...state.items, { ...item, id: Date.now().toString() }]
  })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(it => it.id === id ? { ...it, ...updates } : it)
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(it => it.id !== id)
  })),
  reorderCategory: (id, direction) => set((state) => {
    const index = state.categories.findIndex(cat => cat.id === id)
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < state.categories.length - 1)) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const newCategories = [...state.categories]
      ;[newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]]
      return { categories: newCategories }
    }
    return state
  }),
  reorderItem: (id, direction) => set((state) => {
    const item = state.items.find(it => it.id === id)
    if (!item) return state
    const categoryItems = state.items.filter(it => it.categoryId === item.categoryId)
    const index = categoryItems.findIndex(it => it.id === id)
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < categoryItems.length - 1)) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const newItems = [...state.items]
      const currentIndex = newItems.findIndex(it => it.id === id)
      const targetIndex = newItems.findIndex(it => it.id === categoryItems[newIndex].id)
      ;[newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]]
      return { items: newItems }
    }
    return state
  }),
  setTheme: (updates) => set((state) => ({
    theme: { ...state.theme, ...updates }
  })),
  setViewMode: (isViewMode) => set({ isViewMode }),
}))

export const generateWhatsAppUrl = (phone: string, itemName: string, price: string, restaurantName: string): string | null => {
  if (!phone || phone.trim() === '') {
    alert('Please enter a WhatsApp number in the settings first')
    return null
  }

  // Format phone: remove any non-digit except + at start
  const formattedPhone = phone.replace(/[^\d+]/g, '')

  const message = `مرحباً ${restaurantName} 👋، أرغب بطلب: ${itemName} - بسعر ${price}. شكراً!`

  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}