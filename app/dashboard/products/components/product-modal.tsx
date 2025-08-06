'use client'

import { useEffect, useState } from 'react'
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
import { X, Upload, Plus, Loader2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateProduct, useUpdateProduct } from '../hooks/products'
import { Product, ProductImageData } from '@/app/actions/products'
import { createClient } from '@/utils/supabase/client'

const categories = ['Honey', 'Olive oil', 'Organics skin care'] as const

type ProductStatus = 'active' | 'inactive' | 'out_of_stock'

interface FormData {
  name: string
  category: string
  price: string
  stock: string
  status: ProductStatus
  description: string
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
}

interface ImageUpload {
  id: string
  file?: File
  url: string
  alt_text: string
  sort_order: number
  isUploading?: boolean
  isExisting?: boolean
}

const defaultValues: FormData = {
  name: '',
  category: '',
  price: '',
  stock: '',
  status: 'active',
  description: '',
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [images, setImages] = useState<ImageUpload[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()

  const isEditing = !!product
  const isLoading =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    isUploadingImages

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    mode: 'onChange',
  })

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
        })

        if (product.images && product.images.length > 0) {
          const existingImages: ImageUpload[] = product.images.map(
            (img, index) => ({
              id: img.id,
              url: img.image_url,
              alt_text: img.alt_text || '',
              sort_order: img.sort_order || index,
              isExisting: true,
            }),
          )
          setImages(existingImages.sort((a, b) => a.sort_order - b.sort_order))
        } else {
          setImages([])
        }
      } else {
        reset(defaultValues)
        setImages([])
      }
    }
  }, [isOpen, product, reset])

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const supabase = createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newImages: ImageUpload[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        continue
      }

      const imageUpload: ImageUpload = {
        id: `temp-${Date.now()}-${i}`,
        file,
        url: URL.createObjectURL(file),
        alt_text: '',
        sort_order: images.length + newImages.length,
        isUploading: false,
      }

      newImages.push(imageUpload)
    }

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages])
    }

    e.target.value = ''
  }

  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const filteredImages = prev.filter((img) => img.id !== imageId)
      return filteredImages.map((img, index) => ({
        ...img,
        sort_order: index,
      }))
    })
  }

  const updateImageAltText = (imageId: string, altText: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, alt_text: altText } : img,
      ),
    )
  }

  const addPlaceholderImage = () => {
    const placeholderImage: ImageUpload = {
      id: `placeholder-${Date.now()}`,
      url: `/placeholder.svg?height=200&width=200&text=Product+Image+${images.length + 1}`,
      alt_text: `Product Image ${images.length + 1}`,
      sort_order: images.length,
      isUploading: false,
    }

    setImages((prev) => [...prev, placeholderImage])
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsUploadingImages(true)

      const processedImages: ProductImageData[] = []

      for (const image of images) {
        if (image.file && !image.isUploading && !image.isExisting) {
          try {
            const publicUrl = await uploadImageToSupabase(image.file)
            processedImages.push({
              image_url: publicUrl,
              alt_text: image.alt_text || `${data.name} image`,
              sort_order: image.sort_order,
            })
          } catch (error) {
            console.error('Failed to upload image:', error)
            toast.error(`Failed to upload image`)
            setIsUploadingImages(false)
            return
          }
        } else if (
          image.isExisting ||
          image.url.startsWith('/placeholder.svg')
        ) {
          processedImages.push({
            image_url: image.url,
            alt_text: image.alt_text || `${data.name} image`,
            sort_order: image.sort_order,
          })
        }
      }

      setIsUploadingImages(false)

      const submitData = {
        name: data.name,
        category: data.category,
        price: Number.parseFloat(data.price),
        stock: Number.parseInt(data.stock),
        status: data.status,
        description: data.description,
      }

      if (isEditing && product) {
        const result = await updateProductMutation.mutateAsync({
          id: product.id,
          product: submitData,
          images: processedImages,
        })
        if (result.data) {
          onClose()
        }
      } else {
        const result = await createProductMutation.mutateAsync({
          product: submitData,
          images: processedImages,
        })
        if (result.data) {
          onClose()
        }
      }
    } catch (error) {
      setIsUploadingImages(false)
      console.error('Form submission error:', error)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset()
      setImages([])
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Edit product information and images'
              : 'Enter new product information and upload images'}
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
                      disabled={isLoading}
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
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
                Price (฿)
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
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
                      disabled={isLoading}
                      className='hidden'
                      id='image-upload'
                    />
                    <Label
                      htmlFor='image-upload'
                      className={`flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 hover:bg-gray-50 ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
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
                    disabled={isLoading}
                    className='flex items-center gap-2 bg-transparent'
                  >
                    <Plus className='h-4 w-4' />
                    Add Placeholder
                  </Button>
                </div>

                <p className='text-muted-foreground text-sm'>
                  Upload images (max 5MB each, supported formats: JPG, PNG,
                  WebP)
                </p>

                {images.length > 0 && (
                  <div className='grid grid-cols-2 gap-3'>
                    {images.map((image, index) => (
                      <div key={image.id} className='group relative'>
                        <div className='bg-muted relative aspect-square overflow-hidden rounded-lg border'>
                          <Image
                            src={image.url || '/placeholder.svg'}
                            alt={image.alt_text || `Product ${index + 1}`}
                            fill
                            className='object-cover'
                          />
                          {image.isUploading && (
                            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                              <Loader2 className='h-6 w-6 animate-spin text-white' />
                            </div>
                          )}

                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100'
                            onClick={() => removeImage(image.id)}
                            disabled={isLoading}
                          >
                            <X className='h-3 w-3' />
                          </Button>

                          <div className='absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white'>
                            #{index + 1}
                          </div>

                          <div className='absolute top-2 left-2 opacity-0 transition-opacity group-hover:opacity-100'>
                            <GripVertical className='h-4 w-4 cursor-move text-white drop-shadow' />
                          </div>
                        </div>

                        <Input
                          placeholder='Alt text (optional)'
                          value={image.alt_text}
                          onChange={(e) =>
                            updateImageAltText(image.id, e.target.value)
                          }
                          disabled={isLoading}
                          className='mt-2 text-xs'
                        />
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
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
                    <Textarea
                      {...field}
                      id='description'
                      rows={3}
                      disabled={isLoading}
                      placeholder='Enter product description (optional)'
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {isUploadingImages
                    ? 'Uploading Images...'
                    : isEditing
                      ? 'Updating...'
                      : 'Creating...'}
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Add Product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
