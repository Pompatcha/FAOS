import { Button } from './ui/button'
import { Input } from './ui/input'

const SearchBar = () => {
  return (
    <div className='mx-auto flex w-1/2 gap-2.5'>
      <Input className='bg-white' placeholder='Search for product...' />
      <Button variant='outline'>Search</Button>
    </div>
  )
}

export { SearchBar }
