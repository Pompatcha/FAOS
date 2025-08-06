'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from 'lucide-react'
import { ProductImageGallery } from './components/product-image-gallery'
import { ProductModal } from './components/product-modal'
import { Product } from '@/app/actions/products'
import {
  useProducts,
  useSearchProducts,
  useDeleteProduct,
} from './hooks/products'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    images: [],
    productName: '',
    initialIndex: 0,
  })

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const {
    data: allProducts,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts()

  const { data: searchResults, isLoading: isSearching } =
    useSearchProducts(debouncedSearchTerm)

  const products = debouncedSearchTerm.length > 0 ? searchResults : allProducts
  const isLoading =
    debouncedSearchTerm.length > 0 ? isSearching : isLoadingProducts

  const deleteProductMutation = useDeleteProduct()

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant='default'>Active</Badge>
      case 'out_of_stock':
        return <Badge variant='destructive'>Out of Stock</Badge>
      case 'inactive':
        return <Badge variant='secondary'>Inactive</Badge>
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  if (productsError) {
    return (
      <div className='space-y-6'>
        <div className='py-8 text-center'>
          <p className='text-destructive'>Failed to load products</p>
          <Button variant='outline' onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Product Management</h1>
          <p className='text-muted-foreground'>Manage your store products</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' />
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Loading products...
              </span>
            ) : (
              `Total ${products?.length || 0} products`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center space-x-2'>
            <div className='relative max-w-sm flex-1'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                placeholder='Search products...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8'
              />
              {isSearching && searchTerm && (
                <Loader2 className='absolute top-2.5 right-2 h-4 w-4 animate-spin' />
              )}
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className='py-8 text-center'>
                      <Loader2 className='mx-auto h-6 w-6 animate-spin' />
                    </TableCell>
                  </TableRow>
                ) : products && products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className='font-medium'>
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>฿{product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock <= 10
                              ? 'text-destructive font-semibold'
                              : ''
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end space-x-2'>
                          <Button variant='ghost' size='sm'>
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openEditModal(product)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {product.name}&quot;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  disabled={deleteProductMutation.isPending}
                                >
                                  {deleteProductMutation.isPending ? (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                  ) : null}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='py-8 text-center'>
                      {searchTerm
                        ? 'No products found'
                        : 'No products available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />

      <ProductImageGallery
        images={galleryState.images}
        productName={galleryState.productName}
        isOpen={galleryState.isOpen}
        onClose={() => setGalleryState((prev) => ({ ...prev, isOpen: false }))}
        initialIndex={galleryState.initialIndex}
      />
    </div>
  )
}
