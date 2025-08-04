'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { X, Upload, Plus } from 'lucide-react'

const categories = ['Honey', 'Olive oil', 'Organics skin care'] as const

type ProductStatus = 'active' | 'inactive' | 'out_of_stock'

interface Product {
  id?: string
  name: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  description?: string
  images?: string[]
}

interface FormData {
  name: string
  category: string
  price: string
  stock: string
  status: ProductStatus
  description: string
  images: string[]
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product?: Product | null
}

const defaultValues: FormData = {
  name: '',
  category: '',
  price: '',
  stock: '',
  status: 'active',
  description: '',
  images: [],
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    mode: 'onChange',
  })

  const watchedImages = watch('images')

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock.toString(),
          status: product.status,
          description: product.description || '',
          images: product.images || [],
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [product, isOpen, reset])

  const onSubmit = (data: FormData) => {
    const submitData: Product = {
      ...data,
      price: Number.parseFloat(data.price),
      stock: Number.parseInt(data.stock),
    }
    onSave(submitData)
    onClose()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const currentImages = watchedImages || []

    files.forEach((file: File) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          const imageUrl = event.target.result
          setValue('images', [...currentImages, imageUrl], {
            shouldValidate: true,
          })
        }
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const currentImages = watchedImages || []
    const updatedImages = currentImages.filter((_, i) => i !== index)
    setValue('images', updatedImages, { shouldValidate: true })
  }

  const addPlaceholderImage = () => {
    const currentImages = watchedImages || []
    const placeholderUrl = `/placeholder.svg?height=200&width=200&text=Product+Image+${currentImages.length + 1}`
    setValue('images', [...currentImages, placeholderUrl], {
      shouldValidate: true,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Edit product information'
              : 'Enter new product information'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Product Name
              </Label>
              <div className='col-span-3'>
                <Controller
                  name='name'
                  control={control}
                  rules={{
                    required: 'Product name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='name'
                      className={errors.name ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='category' className='text-right'>
                Category
              </Label>
              <div className='col-span-3'>
                <Controller
                  name='category'
                  control={control}
                  rules={{ required: 'Please select a category' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={errors.category ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>
                Price
              </Label>
              <div className='col-span-3'>
                <Controller
                  name='price'
                  control={control}
                  rules={{
                    required: 'Price is required',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Please enter a valid price',
                    },
                    min: {
                      value: 0.01,
                      message: 'Price must be greater than 0',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='price'
                      type='number'
                      step='0.01'
                      min='0'
                      className={errors.price ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.price && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='stock' className='text-right'>
                Stock Quantity
              </Label>
              <div className='col-span-3'>
                <Controller
                  name='stock'
                  control={control}
                  rules={{
                    required: 'Stock quantity is required',
                    min: { value: 0, message: 'Stock cannot be negative' },
                    pattern: {
                      value: /^\d+$/,
                      message: 'Stock must be a whole number',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='stock'
                      type='number'
                      min='0'
                      step='1'
                      className={errors.stock ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.stock && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <div className='col-span-3'>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                        <SelectItem value='out_of_stock'>
                          Out of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className='grid grid-cols-4 items-start gap-4'>
              <Label className='pt-2 text-right'>Product Images</Label>
              <div className='col-span-3 space-y-4'>
                <div className='flex gap-2'>
                  <div className='relative'>
                    <Input
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={handleImageUpload}
                      className='hidden'
                      id='image-upload'
                    />
                    <Label
                      htmlFor='image-upload'
                      className='flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 hover:bg-gray-50'
                    >
                      <Upload className='h-4 w-4' />
                      Upload Images
                    </Label>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addPlaceholderImage}
                    className='flex items-center gap-2 bg-transparent'
                  >
                    <Plus className='h-4 w-4' />
                    Add Placeholder
                  </Button>
                </div>

                {watchedImages && watchedImages.length > 0 && (
                  <div className='grid grid-cols-3 gap-3'>
                    {watchedImages.map((image, index) => (
                      <div key={index} className='group relative'>
                        <Image
                          src={image || '/placeholder.svg'}
                          alt={`Product ${index + 1}`}
                          width={200}
                          height={96}
                          className='h-24 w-full rounded-md border object-cover'
                        />
                        <Button
                          type='button'
                          variant='destructive'
                          size='sm'
                          className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100'
                          onClick={() => removeImage(index)}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                        <div className='absolute bottom-1 left-1 rounded bg-black/50 px-1 text-xs text-white'>
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(!watchedImages || watchedImages.length === 0) && (
                  <div className='rounded-md border-2 border-dashed border-gray-300 p-6 text-center'>
                    <Upload className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                    <p className='text-sm text-gray-500'>
                      No images uploaded yet
                    </p>
                    <p className='text-xs text-gray-400'>
                      Upload images or add placeholders
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <div className='col-span-3'>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} id='description' rows={3} />
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>
              {product ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
