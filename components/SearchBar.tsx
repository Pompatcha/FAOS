'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/lib/utils'
import { useProductStore } from '@/stores/product'

import { Button } from './ui/button'
import { Input } from './ui/input'

const SearchBar: FC<ComponentProps<'div'>> = ({ className }) => {
  const { searchText, setSearchText, clearSearchText } = useProductStore()
  const router = useRouter()

  const handleSearch = () => {
    router.push('/products')
  }

  return (
    <div className={cn('mx-auto flex min-w-[350px] gap-2.5', className)}>
      <Input
        className='!bg-white'
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
      <Button className='!bg-white' onClick={handleSearch} variant='outline'>
        <SearchIcon />
      </Button>
      {searchText && (
        <Button
          className='!bg-white'
          onClick={() => {
            clearSearchText()
          }}
          variant='outline'
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}

export { SearchBar }
