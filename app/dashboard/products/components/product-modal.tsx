'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import {
  X,
  Upload,
  Loader2,
  GripVertical,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProductImage,
} from '../hooks/products'
import { ProductImageData } from '@/actions/products'
import { createClient } from '@/utils/supabase/client'
import { Product } from '@/types/product'

const categories = [
  { label: 'Honey', value: 'honey' },
  { label: 'Olive oil', value: 'olive-oil' },
  { label: 'Organics skin care', value: 'organice-skin-care' },
] as const

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
  filename?: string
  original_filename?: string
  uploadProgress?: number
  uploadError?: string
  isDeleted?: boolean
}

const defaultValues: FormData = {
  name: '',
  category: '',
  price: '',
  stock: '',
  status: 'active',
  description: '',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const MAX_IMAGES = 10

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [images, setImages] = useState<ImageUpload[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null)

  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteImageMutation = useDeleteProductImage()

  const isEditing = !!product
  const isLoading =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    deleteImageMutation.isPending ||
    isUploadingImages

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues,
    mode: 'onChange',
  })

  const productName = watch('name')

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
              filename: img.image_url.split('/').pop() || '',
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

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `${file.name}: Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File too large. Maximum size is 5MB.`
    }
    return null
  }

  const uploadImageToSupabase = async (
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{
    publicUrl: string
    filename: string
    originalFilename: string
  }> => {
    const supabase = createClient()

    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileName = `${randomString}-${timestamp}.${fileExt}`
    const filePath = `products/${fileName}`

    const progressInterval = setInterval(() => {
      if (onProgress) {
        onProgress(Math.min(90, Math.random() * 80 + 10))
      }
    }, 200)

    try {
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      clearInterval(progressInterval)

      if (error) {
        throw new Error(error.message)
      }

      if (onProgress) onProgress(100)

      const { data } = supabase.storage.from('images').getPublicUrl(filePath)

      return {
        publicUrl: data.publicUrl,
        filename: fileName,
        originalFilename: file.name,
      }
    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFileSelection(files)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelection = async (files: File[]) => {
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error))
    }

    if (validFiles.length === 0) return

    const newImages: ImageUpload[] = validFiles.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      alt_text: '',
      sort_order: images.length + index,
      isUploading: true,
      uploadProgress: 0,
      original_filename: file.name,
    }))

    setImages((prev) => [...prev, ...newImages])

    for (const imageUpload of newImages) {
      if (!imageUpload.file) continue

      try {
        const result = await uploadImageToSupabase(
          imageUpload.file,
          (progress) => {
            setImages((prev) =>
              prev.map((img) =>
                img.id === imageUpload.id
                  ? { ...img, uploadProgress: progress }
                  : img,
              ),
            )
          },
        )

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageUpload.id
              ? {
                  ...img,
                  isUploading: false,
                  uploadProgress: 100,
                  url: result.publicUrl,
                  filename: result.filename,
                }
              : img,
          ),
        )

        toast.success(`Uploaded ${result.originalFilename}`)
      } catch (error) {
        console.error('Upload failed:', error)
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageUpload.id
              ? {
                  ...img,
                  isUploading: false,
                  uploadError:
                    error instanceof Error ? error.message : 'Upload failed',
                }
              : img,
          ),
        )
        toast.error(`Failed to upload ${imageUpload.original_filename}`)
      }
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    await handleFileSelection(files)
    e.target.value = ''
  }

  const removeImage = (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId)
    if (imageToRemove?.url && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url)
    }

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

  const handleImageDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedImageId(imageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleImageDragOver = (e: React.DragEvent, targetImageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedImageId && draggedImageId !== targetImageId) {
      const draggedIndex = images.findIndex((img) => img.id === draggedImageId)
      const targetIndex = images.findIndex((img) => img.id === targetImageId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newImages = [...images]
        const [draggedImage] = newImages.splice(draggedIndex, 1)
        newImages.splice(targetIndex, 0, draggedImage)

        const reorderedImages = newImages.map((img, index) => ({
          ...img,
          sort_order: index,
        }))

        setImages(reorderedImages)
      }
    }
  }

  const handleImageDragEnd = () => {
    setDraggedImageId(null)
  }

  const retryUpload = async (imageId: string) => {
    const image = images.find((img) => img.id === imageId)
    if (!image?.file) return

    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              isUploading: true,
              uploadError: undefined,
              uploadProgress: 0,
            }
          : img,
      ),
    )

    try {
      const result = await uploadImageToSupabase(image.file, (progress) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, uploadProgress: progress } : img,
          ),
        )
      })

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                isUploading: false,
                uploadProgress: 100,
                url: result.publicUrl,
                filename: result.filename,
                uploadError: undefined,
              }
            : img,
        ),
      )

      toast.success(`Uploaded ${result.originalFilename}`)
    } catch (error) {
      console.error('Retry upload failed:', error)
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                isUploading: false,
                uploadError:
                  error instanceof Error ? error.message : 'Upload failed',
              }
            : img,
        ),
      )
      toast.error('Retry failed')
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsUploadingImages(true)

      const uploadingImages = images.filter((img) => img.isUploading)
      if (uploadingImages.length > 0) {
        toast.error('Please wait for all images to finish uploading')
        setIsUploadingImages(false)
        return
      }

      const failedImages = images.filter((img) => img.uploadError)
      if (failedImages.length > 0) {
        toast.error('Please fix failed image uploads before saving')
        setIsUploadingImages(false)
        return
      }

      const processedImages: ProductImageData[] = images
        .filter((img) => !img.isDeleted)
        .map((img) => ({
          image_url: img.url,
          alt_text: img.alt_text || `${data.name} image`,
          sort_order: img.sort_order,
        }))

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
          toast.success('Product updated successfully')
          onClose()
        }
      } else {
        const result = await createProductMutation.mutateAsync({
          product: submitData,
          images: processedImages,
        })
        if (result.data) {
          toast.success('Product created successfully')
          onClose()
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsUploadingImages(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      images.forEach((img) => {
        if (img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url)
        }
      })
      reset()
      setImages([])
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Edit product information and manage images'
              : 'Enter new product information and upload images'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-6 py-4'>
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
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
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
                <div
                  className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleImageUpload}
                    disabled={isLoading}
                    className='absolute inset-0 cursor-pointer opacity-0'
                    id='image-upload'
                  />
                  <div className='text-center'>
                    <Upload className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                    <p className='text-sm font-medium text-gray-700'>
                      Drop images here or click to upload
                    </p>
                    <p className='mt-1 text-xs text-gray-500'>
                      Maximum {MAX_IMAGES} images, up to 5MB each
                    </p>
                    <p className='text-xs text-gray-500'>
                      Supported: JPG, PNG, WebP, GIF
                    </p>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className='grid grid-cols-2 gap-4'>
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className='group relative overflow-hidden rounded-lg border'
                        draggable
                        onDragStart={(e) => handleImageDragStart(e, image.id)}
                        onDragOver={(e) => handleImageDragOver(e, image.id)}
                        onDragEnd={handleImageDragEnd}
                      >
                        <div className='relative aspect-square bg-gray-100'>
                          <img
                            src={image.url || '/placeholder.svg'}
                            alt={image.alt_text || `Product image ${index + 1}`}
                            className='object-cover'
                          />

                          {image.isUploading && (
                            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                              <div className='text-center text-white'>
                                <Loader2 className='mx-auto mb-2 h-6 w-6 animate-spin' />
                                <p className='text-sm'>
                                  {image.uploadProgress?.toFixed(0) || 0}%
                                </p>
                              </div>
                            </div>
                          )}

                          {image.uploadError && (
                            <div className='absolute inset-0 flex items-center justify-center bg-red-500/80'>
                              <div className='p-2 text-center text-white'>
                                <AlertCircle className='mx-auto mb-2 h-6 w-6' />
                                <p className='mb-2 text-xs'>Upload failed</p>
                                <Button
                                  size='sm'
                                  variant='secondary'
                                  onClick={() => retryUpload(image.id)}
                                  className='h-6 text-xs'
                                >
                                  Retry
                                </Button>
                              </div>
                            </div>
                          )}

                          {!image.isUploading &&
                            !image.uploadError &&
                            !image.isExisting && (
                              <div className='absolute top-2 right-2'>
                                <CheckCircle2 className='h-4 w-4 rounded-full bg-white text-green-500' />
                              </div>
                            )}

                          <div className='absolute top-2 left-2 flex gap-1'>
                            <div className='rounded bg-black/70 px-2 py-1 text-xs text-white'>
                              {index + 1}
                            </div>

                            <div className='cursor-move rounded bg-black/70 p-1 text-white'>
                              <GripVertical className='h-3 w-3' />
                            </div>
                          </div>

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

                          {image.original_filename && (
                            <div className='absolute right-0 bottom-0 left-0 truncate bg-black/70 p-2 text-xs text-white'>
                              {image.original_filename}
                            </div>
                          )}
                        </div>

                        <div className='p-2'>
                          <Input
                            placeholder={`Alt text for image ${index + 1}`}
                            value={image.alt_text}
                            onChange={(e) =>
                              updateImageAltText(image.id, e.target.value)
                            }
                            disabled={isLoading}
                            className='text-xs'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div className='rounded-lg border bg-gray-50 py-8 text-center'>
                    <ImageIcon className='mx-auto mb-3 h-12 w-12 text-gray-400' />
                    <p className='mb-1 text-sm text-gray-600'>
                      No images uploaded
                    </p>
                    <p className='text-xs text-gray-500'>
                      Add images to showcase your {productName || 'product'}
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

          <DialogFooter className='gap-2'>
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
                    ? 'Processing Images...'
                    : isEditing
                      ? 'Updating Product...'
                      : 'Creating Product...'}
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
