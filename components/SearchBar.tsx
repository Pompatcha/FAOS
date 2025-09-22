'use client'

import { useRouter } from 'next/navigation'

import { useProductStore } from '@/stores/product'

import { Button } from './ui/button'
import { Input } from './ui/input'

const SearchBar = () => {
  const { searchText, setSearchText, clearSearchText } = useProductStore()
  const router = useRouter()

  const handleSearch = () => {
    router.push('/products')
  }

  return (
    <div className='mx-auto flex w-full gap-2.5 sm:w-1/2'>
      <Input
        className='bg-white'
        placeholder='Search for product...'
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      <Button onClick={handleSearch} variant='outline'>
        Search
      </Button>
      {searchText && (
        <Button
          onClick={() => {
            clearSearchText()
          }}
          variant='outline'
        >
          Clear
        </Button>
      )}
    </div>
  )
}

export { SearchBar }
