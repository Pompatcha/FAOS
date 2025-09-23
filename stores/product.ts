import { create } from 'zustand'

interface StoreState {
  searchText: string
  setSearchText: (text: string) => void
  clearSearchText: () => void
}

const useProductStore = create<StoreState>((set) => ({
  searchText: '',

  setSearchText: (text) => set({ searchText: text }),
  clearSearchText: () => set({ searchText: '' }),
}))

export { useProductStore }
