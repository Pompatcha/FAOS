'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus, Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import type { ProductFormInput } from '@/actions/product'

import { getCategories } from '@/actions/category'
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '@/actions/product'
import { ConfirmDialog } from '@/components/Dialog/ConfirmDialog'
import { HeaderCard } from '@/components/HeaderCard'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useRequireAdmin } from '@/contexts/AuthContext.tsx'
import { formatDate } from '@/lib/date'
import { numberFormatter, priceFormatter } from '@/lib/number'
import { truncateText } from '@/lib/text'

const defaultForm: ProductFormInput = {
  productData: {
    name: '',
    description: '',
    short_description: '',
    category_id: null,
    preorder_enabled: false,
    preorder_day: 30,
  },
  productOptions: [],
  productImages: [],
}

const ProductPage = () => {
  useRequireAdmin()
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  const form = useForm<ProductFormInput>({ defaultValues: defaultForm })
  const { control, handleSubmit, reset, setValue, watch } = form

  const {
    fields: options,
    append: addOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: 'productOptions',
  })

  const {
    fields: images,
    append: addImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'productImages',
  })

  const {
    data: products,
    refetch: refetchProducts,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', selectedId],
    queryFn: () => getProduct(selectedId),
    enabled: !!selectedId,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { mutate: createMutate, isPending: createPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast.success(data?.message)
      refetchProducts()
      closeDialog()
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error
          ? error?.message
          : 'Server error. Please contact the developer.',
      ),
  })

  const { mutate: updateMutate, isPending: updatePending } = useMutation({
    mutationFn: (data: ProductFormInput) => {
      if (!selectedId) throw new Error('No product ID selected')
      return updateProduct({ productId: selectedId, ...data })
    },
    onSuccess: (data) => {
      toast.success(data?.message)
      refetchProducts()
      closeDialog()
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error
          ? error?.message
          : 'Server error. Please contact the developer.',
      ),
  })

  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      toast.success(data?.message)
      refetchProducts()
      closeDialog()
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error
          ? error?.message
          : 'Server error. Please contact the developer.',
      ),
  })

  useEffect(() => {
    if (product) {
      reset({
        productData: {
          name: product.name,
          description: product.description,
          short_description: product.short_description,
          category_id: product.category?.id || null,
          preorder_enabled: product.preorder_enabled ?? false,
          preorder_day: product.preorder_day,
        },
        productOptions: product.options ?? [],
        productImages: product.images ?? [],
      })
    }
  }, [product, reset])

  const closeDialog = () => {
    setIsEditMode(false)
    setShowDialog(false)
    setSelectedId('')
    reset(defaultForm)
  }

  const handleAddOption = () => {
    addOption({
      option_name: '',
      option_value: '',
      option_price: 0,
      option_stock: 0,
    })
  }

  const handleAddImage = () => {
    addImage({
      image_url: '',
      alt_text: '',
      is_primary: images.length === 0,
    })
  }

  const handlePrimaryChange = (selectedIndex: number, isPrimary: boolean) => {
    if (isPrimary) {
      images.forEach((_, index) => {
        if (index !== selectedIndex) {
          setValue(`productImages.${index}.is_primary`, false)
        }
      })
    }
  }

  const handleEdit = (productId: string) => {
    setIsEditMode(true)
    setShowDialog(true)
    setSelectedId(productId)
  }

  const onSubmit = (data: ProductFormInput) => {
    if (isEditMode) {
      updateMutate(data)
    } else {
      createMutate(data)
    }
  }

  const isLoading =
    deletePending ||
    createPending ||
    productLoading ||
    productsLoading ||
    updatePending

  return (
    <IndexLayout>
      <Loading isLoading={isLoading} />

      <div className='flex justify-between'>
        <div className='flex flex-col gap-2.5 text-white'>
          <span className='text-4xl'>Products</span>
          <span>
            Manage your online store inventory with ease. <br />
            Add, edit, and track your products and stock levels efficiently.
          </span>
        </div>
        <div className='flex gap-5'>
          <Dialog
            open={showDialog}
            onOpenChange={(value) => !value && closeDialog()}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => setShowDialog(true)}
                className='w-fit cursor-pointer rounded-xl bg-white p-5 text-[#4a2c00] hover:bg-white/50'
              >
                <Plus /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] w-full overflow-y-auto sm:min-w-2xl'>
              <DialogHeader>
                <DialogTitle className='text-2xl'>
                  {isEditMode ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>

              <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='mb-4 text-lg font-semibold'>
                      Basic Information
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label>Enable Pre-Order</Label>
                        <Controller
                          name='productData.preorder_enabled'
                          control={control}
                          render={({ field }) => (
                            <Switch
                              className='mt-2.5'
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      {watch('productData.preorder_enabled') && (
                        <div>
                          <Label>Pre-Order Days</Label>
                          <Controller
                            name='productData.preorder_day'
                            control={control}
                            rules={{
                              required: 'Pre-order days is required',
                              min: {
                                value: 1,
                                message: 'Must be at least 1 day',
                              },
                            }}
                            render={({ field, fieldState }) => (
                              <div>
                                <Input
                                  {...field}
                                  value={field.value || ''}
                                  type='number'
                                  placeholder='Enter Pre-order days'
                                  className='mt-1'
                                />
                                {fieldState.error && (
                                  <p className='mt-1 text-sm text-red-500'>
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      )}

                      <div>
                        <Label>Product Name</Label>
                        <Controller
                          name='productData.name'
                          control={control}
                          rules={{ required: 'Product name is required' }}
                          render={({ field, fieldState }) => (
                            <div>
                              <Input
                                {...field}
                                placeholder='Enter product name'
                                className='mt-1'
                              />
                              {fieldState.error && (
                                <p className='mt-1 text-sm text-red-500'>
                                  {fieldState.error.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <div>
                        <Label>Category</Label>
                        <Controller
                          name='productData.category_id'
                          control={control}
                          rules={{ required: 'Category is required' }}
                          render={({ field, fieldState }) => (
                            <div>
                              <Select
                                value={field.value?.toString() || ''}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className='mt-1 w-full'>
                                  <SelectValue placeholder='Select category' />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories?.data?.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id.toString()}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {fieldState.error && (
                                <p className='mt-1 text-sm text-red-500'>
                                  {fieldState.error.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    <div className='mt-4'>
                      <Label>Short Description</Label>
                      <Controller
                        name='productData.short_description'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            value={field.value || ''}
                            placeholder='Brief product description'
                            className='mt-1'
                            rows={2}
                          />
                        )}
                      />
                    </div>

                    <div className='mt-4'>
                      <Label>Full Description</Label>
                      <Controller
                        name='productData.description'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            value={field.value || ''}
                            placeholder='Detailed product description'
                            className='mt-1'
                            rows={4}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <h3 className='text-lg font-semibold'>Product Options</h3>
                      <Button
                        type='button'
                        onClick={handleAddOption}
                        variant='outline'
                        size='sm'
                      >
                        <Plus className='size-4' />
                        Add Option
                      </Button>
                    </div>

                    <div className='space-y-4'>
                      {options.map((option, index) => (
                        <Card key={option.id} className='p-4'>
                          <div className='mb-4 flex items-start justify-between'>
                            <h4 className='font-medium'>Option {index + 1}</h4>
                            <Button
                              type='button'
                              onClick={() => removeOption(index)}
                              variant='ghost'
                              size='sm'
                              className='text-red-500 hover:text-red-700'
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </div>

                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <Label>Option Name</Label>
                              <Controller
                                name={`productOptions.${index}.option_name`}
                                control={control}
                                rules={{
                                  required: 'Option name is required',
                                  minLength: {
                                    value: 2,
                                    message: 'Must be at least 2 characters',
                                  },
                                }}
                                render={({ field, fieldState }) => (
                                  <div>
                                    <Input
                                      {...field}
                                      placeholder='e.g., Color, Size'
                                      className='mt-1'
                                    />
                                    {fieldState.error && (
                                      <p className='mt-1 text-sm text-red-500'>
                                        {fieldState.error.message}
                                      </p>
                                    )}
                                  </div>
                                )}
                              />
                            </div>

                            <div>
                              <Label>Option Value</Label>
                              <Controller
                                name={`productOptions.${index}.option_value`}
                                control={control}
                                rules={{
                                  required: 'Option value is required',
                                  minLength: {
                                    value: 1,
                                    message: 'Must be at least 1 character',
                                  },
                                }}
                                render={({ field, fieldState }) => (
                                  <div>
                                    <Input
                                      {...field}
                                      placeholder='e.g., Red, Large'
                                      className='mt-1'
                                    />
                                    {fieldState.error && (
                                      <p className='mt-1 text-sm text-red-500'>
                                        {fieldState.error.message}
                                      </p>
                                    )}
                                  </div>
                                )}
                              />
                            </div>

                            <div>
                              <Label>Price (THB)</Label>
                              <Controller
                                name={`productOptions.${index}.option_price`}
                                control={control}
                                rules={{
                                  required: 'Price is required',
                                  min: {
                                    value: 0.01,
                                    message: 'Must be at least 0.01 THB',
                                  },
                                }}
                                render={({ field, fieldState }) => (
                                  <div>
                                    <Input
                                      {...field}
                                      type='number'
                                      step='0.01'
                                      value={field.value || ''}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      placeholder='0.00'
                                      className='mt-1'
                                    />
                                    {fieldState.error && (
                                      <p className='mt-1 text-sm text-red-500'>
                                        {fieldState.error.message}
                                      </p>
                                    )}
                                  </div>
                                )}
                              />
                            </div>

                            <div>
                              <Label>Stock Quantity</Label>
                              <Controller
                                name={`productOptions.${index}.option_stock`}
                                control={control}
                                rules={{
                                  required: 'Stock quantity is required',
                                  min: {
                                    value: 0,
                                    message: 'Cannot be negative',
                                  },
                                  validate: (value) =>
                                    Number.isInteger(Number(value)) ||
                                    'Must be a whole number',
                                }}
                                render={({ field, fieldState }) => (
                                  <div>
                                    <Input
                                      {...field}
                                      type='number'
                                      value={field.value || ''}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      placeholder='0'
                                      className='mt-1'
                                    />
                                    {fieldState.error && (
                                      <p className='mt-1 text-sm text-red-500'>
                                        {fieldState.error.message}
                                      </p>
                                    )}
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <h3 className='text-lg font-semibold'>Product Images</h3>
                      <Button
                        type='button'
                        onClick={handleAddImage}
                        variant='outline'
                        size='sm'
                      >
                        <Upload className='size-4' />
                        Add Image
                      </Button>
                    </div>

                    <div className='space-y-4'>
                      {images.map((image, index) => (
                        <Card key={image.id} className='p-4'>
                          <div className='mb-4 flex items-start justify-between'>
                            <h4 className='font-medium'>Image {index + 1}</h4>
                            <Button
                              type='button'
                              onClick={() => removeImage(index)}
                              variant='ghost'
                              size='sm'
                              className='text-red-500 hover:text-red-700'
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </div>

                          <div className='grid grid-cols-2 gap-4'>
                            <div className='col-span-2'>
                              <Label>Image URL</Label>
                              <Controller
                                name={`productImages.${index}.image_url`}
                                control={control}
                                rules={{
                                  required: 'URL is required',
                                  pattern: {
                                    value: /^https?:\/\/.+$/i,
                                    message: 'Please enter a valid URL',
                                  },
                                }}
                                render={({ field, fieldState }) => (
                                  <div>
                                    <Input
                                      {...field}
                                      placeholder='https://example.com/image.jpg'
                                      className='mt-1'
                                    />
                                    {fieldState.error && (
                                      <p className='mt-1 text-sm text-red-500'>
                                        {fieldState.error.message}
                                      </p>
                                    )}
                                  </div>
                                )}
                              />
                            </div>

                            <div>
                              <Label>Alt Text</Label>
                              <Controller
                                name={`productImages.${index}.alt_text`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <div>
                                    <Input
                                      {...field}
                                      value={field.value || ''}
                                      placeholder='Image description'
                                      className='mt-1'
                                    />
                                    {fieldState.error && (
                                      <p className='mt-1 text-sm text-red-500'>
                                        {fieldState.error.message}
                                      </p>
                                    )}
                                  </div>
                                )}
                              />
                            </div>

                            <div className='mt-6 flex items-center space-x-2'>
                              <Controller
                                name={`productImages.${index}.is_primary`}
                                control={control}
                                render={({ field }) => (
                                  <Switch
                                    checked={!!field.value}
                                    onCheckedChange={(isPrimary) => {
                                      handlePrimaryChange(index, isPrimary)
                                      field.onChange(isPrimary)
                                    }}
                                  />
                                )}
                              />
                              <Label>Primary Image</Label>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className='flex justify-end gap-4'>
                  <Button variant='outline' type='button' onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={createPending || updatePending}
                    className='bg-primary'
                  >
                    {isEditMode ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <div className='grid gap-5 text-[#4a2c00] sm:grid-cols-3'>
          <HeaderCard
            label='Total Products'
            value={
              Array.isArray(products)
                ? products.length
                : products?.data?.length || 0
            }
          />
        </div>
      </div>

      <div className='rounded-xl bg-white p-5'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Pre-Order</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(products) &&
              products?.map((product, idx) => (
                <TableRow key={product.id}>
                  <TableCell className='font-medium'>{idx + 1}</TableCell>
                  <TableCell className='font-medium'>
                    <img
                      className='size-10 rounded-full'
                      alt={product?.name}
                      src={product?.images[0]?.image_url || '/placeholder.svg'}
                    />
                  </TableCell>
                  <TableCell className='font-medium'>
                    {truncateText(product?.name)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {product?.min_price && product?.max_price
                      ? product.min_price === product.max_price
                        ? priceFormatter.format(product.min_price)
                        : `${priceFormatter.format(product.min_price)} - ${priceFormatter.format(product.max_price)}`
                      : 'n/a'}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {product?.min_stock !== undefined &&
                    product?.max_stock !== undefined
                      ? product.min_stock === product.max_stock
                        ? `${numberFormatter.format(product.min_stock || 0)} Stock`
                        : `${numberFormatter.format(product.min_stock || 0)} - ${numberFormatter.format(product.max_stock || 0)} Stock`
                      : 'n/a'}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {product?.preorder_enabled
                      ? `${product?.preorder_day} days`
                      : '-'}
                  </TableCell>
                  <TableCell>{formatDate(product.created_at)}</TableCell>
                  <TableCell>{formatDate(product.updated_at)}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        onClick={() => handleEdit(product?.id)}
                      >
                        Edit
                      </Button>
                      <ConfirmDialog
                        variant='outline'
                        triggerText='Delete'
                        onConfirm={() => deleteMutate(product?.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

            {Array.isArray(products) && products?.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className='text-center'>
                  There are no products yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </IndexLayout>
  )
}

export default ProductPage
