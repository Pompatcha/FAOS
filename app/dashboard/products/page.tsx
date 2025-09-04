'use client'

import { FC, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { SumCard } from '../components/SumCard'
import { IndexLayout } from '@/components/Layout/Index'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Upload, X, Edit, Eye, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/lib/price'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/products'

const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Smartphones' },
  { id: 2, name: 'Tablets' },
  { id: 3, name: 'Laptops' },
  { id: 4, name: 'Accessories' },
]

interface ProductFormData {
  name: string
  description: string
  short_description: string
  category_id: string
  brand: string
  sku: string
  is_active: boolean
  weight: string
  dimensions: {
    width: string
    height: string
    depth: string
  }
  prices: {
    base_price: string
    sale_price: string
    cost_price: string
    is_on_sale: boolean
    sale_start_date: string
    sale_end_date: string
  }
  productOptions: Array<{
    option_name: string
    option_value: string
    additional_price: string
    stock_quantity: string
    sku: string
    is_available: boolean
  }>
  productImages: Array<{
    image_url: string
    alt_text: string
    display_order: string
    is_primary: boolean
  }>
}

const ProductPage: FC = () => {
  const [isCreateProductDialogOpen, setIsCreateProductDialogOpen] =
    useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const { data: products = [], isLoading, error } = useProducts()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  const productForm = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      short_description: '',
      category_id: '',
      brand: '',
      sku: '',
      is_active: true,
      weight: '',
      dimensions: {
        width: '',
        height: '',
        depth: '',
      },
      prices: {
        base_price: '',
        sale_price: '',
        cost_price: '',
        is_on_sale: false,
        sale_start_date: '',
        sale_end_date: '',
      },
      productOptions: [],
      productImages: [],
    },
  })

  const { control, handleSubmit, reset, watch, setValue } = productForm

  const {
    fields: productOptionFields,
    append: addProductOptionField,
    remove: removeProductOptionField,
  } = useFieldArray({
    control,
    name: 'productOptions',
  })

  const {
    fields: productImageFields,
    append: addProductImageField,
    remove: removeProductImageField,
  } = useFieldArray({
    control,
    name: 'productImages',
  })

  const isProductOnSale = watch('prices.is_on_sale')

  // Helper function to transform form data
  const transformFormData = (formData: ProductFormData) => {
    const productData = {
      name: formData.name,
      description: formData.description || undefined,
      short_description: formData.short_description || undefined,
      category_id: formData.category_id
        ? parseInt(formData.category_id)
        : undefined,
      brand: formData.brand || undefined,
      sku: formData.sku || undefined,
      is_active: formData.is_active,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      dimensions: {
        width: formData.dimensions.width
          ? parseFloat(formData.dimensions.width)
          : undefined,
        height: formData.dimensions.height
          ? parseFloat(formData.dimensions.height)
          : undefined,
        depth: formData.dimensions.depth
          ? parseFloat(formData.dimensions.depth)
          : undefined,
      },
    }

    const priceData = {
      base_price: parseFloat(formData.prices.base_price),
      sale_price: formData.prices.sale_price
        ? parseFloat(formData.prices.sale_price)
        : undefined,
      cost_price: formData.prices.cost_price
        ? parseFloat(formData.prices.cost_price)
        : undefined,
      is_on_sale: formData.prices.is_on_sale,
      sale_start_date: formData.prices.sale_start_date || undefined,
      sale_end_date: formData.prices.sale_end_date || undefined,
    }

    const optionData = formData.productOptions.map((option) => ({
      option_name: option.option_name,
      option_value: option.option_value,
      additional_price: parseFloat(option.additional_price) || 0,
      stock_quantity: parseInt(option.stock_quantity) || 0,
      sku: option.sku || undefined,
      is_available: option.is_available,
    }))

    const imageData = formData.productImages.map((image) => ({
      image_url: image.image_url,
      alt_text: image.alt_text || undefined,
      display_order: parseInt(image.display_order) || 0,
      is_primary: image.is_primary,
    }))

    return { productData, priceData, optionData, imageData }
  }

  const handleCreateProduct = async (formData: ProductFormData) => {
    const { productData, priceData, optionData, imageData } =
      transformFormData(formData)

    try {
      await createProductMutation.mutateAsync({
        productData,
        priceData,
        imageData,
        optionData,
      })
      setIsCreateProductDialogOpen(false)
      reset()
    } catch (error) {
      // Error is handled in the mutation
    }
  }

  const handleUpdateProduct = async (formData: ProductFormData) => {
    if (!editingProduct) return

    const { productData, priceData, optionData, imageData } =
      transformFormData(formData)

    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id.toString(),
        productData,
        priceData,
        imageData,
        optionData,
      })
      setEditingProduct(null)
      reset()
    } catch (error) {
      // Error is handled in the mutation
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id)
    } catch (error) {
      // Error is handled in the mutation
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)

    // Populate form with existing data
    const formData: ProductFormData = {
      name: product.name || '',
      description: product.description || '',
      short_description: product.short_description || '',
      category_id: product.category_id?.toString() || '',
      brand: product.brand || '',
      sku: product.sku || '',
      is_active: product.is_active ?? true,
      weight: product.weight?.toString() || '',
      dimensions: {
        width: product.dimensions?.width?.toString() || '',
        height: product.dimensions?.height?.toString() || '',
        depth: product.dimensions?.depth?.toString() || '',
      },
      prices: {
        base_price: product.prices?.[0]?.base_price?.toString() || '',
        sale_price: product.prices?.[0]?.sale_price?.toString() || '',
        cost_price: product.prices?.[0]?.cost_price?.toString() || '',
        is_on_sale: product.prices?.[0]?.is_on_sale || false,
        sale_start_date: product.prices?.[0]?.sale_start_date || '',
        sale_end_date: product.prices?.[0]?.sale_end_date || '',
      },
      productOptions:
        product.options?.map((option) => ({
          option_name: option.option_name || '',
          option_value: option.option_value || '',
          additional_price: option.additional_price?.toString() || '0',
          stock_quantity: option.stock_quantity?.toString() || '0',
          sku: option.sku || '',
          is_available: option.is_available ?? true,
        })) || [],
      productImages:
        product.images?.map((image) => ({
          image_url: image.image_url || '',
          alt_text: image.alt_text || '',
          display_order: image.display_order?.toString() || '0',
          is_primary: image.is_primary || false,
        })) || [],
    }

    reset(formData)
    setIsCreateProductDialogOpen(true)
  }

  const handleAddProductOption = () => {
    addProductOptionField({
      option_name: '',
      option_value: '',
      additional_price: '0',
      stock_quantity: '0',
      sku: '',
      is_available: true,
    })
  }

  const handleAddProductImage = () => {
    addProductImageField({
      image_url: '',
      alt_text: '',
      display_order: (productImageFields.length + 1).toString(),
      is_primary: productImageFields.length === 0,
    })
  }

  const handlePrimaryImageChange = (
    selectedImageIndex: number,
    isSelectedPrimary: boolean,
  ) => {
    if (isSelectedPrimary) {
      productImageFields.forEach((_, imageIndex) => {
        if (imageIndex !== selectedImageIndex) {
          setValue(`productImages.${imageIndex}.is_primary`, false)
        }
      })
    }
  }

  const getStockBadgeVariant = (stockQuantity: number) => {
    return stockQuantity > 10 ? 'default' : 'destructive'
  }

  const getProductStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary'
  }

  const getProductStatusDisplayText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive'
  }

  const calculateTotalStock = (product) => {
    if (!product.options || product.options.length === 0) return 0
    return product.options.reduce(
      (total: number, option) => total + (option.stock_quantity || 0),
      0,
    )
  }

  const getProductPrice = (product) => {
    const price = product.prices?.[0]
    if (!price) return { base_price: 0, sale_price: null, is_on_sale: false }
    return {
      base_price: price.base_price || 0,
      sale_price: price.sale_price,
      is_on_sale: price.is_on_sale || false,
    }
  }

  const closeDialog = () => {
    setIsCreateProductDialogOpen(false)
    setEditingProduct(null)
    reset()
  }

  if (error) {
    return (
      <IndexLayout>
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='text-center text-red-600'>
            <p>Error loading products: {error.message}</p>
            <Button onClick={() => window.location.reload()} className='mt-4'>
              Retry
            </Button>
          </div>
        </div>
      </IndexLayout>
    )
  }

  return (
    <IndexLayout>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2.5 text-white'>
          <span className='text-4xl'>Products</span>
          <span>
            Manage your online store inventory with ease. <br />
            Add, edit, and track your products and stock levels efficiently.
          </span>
        </div>
        <div className='flex gap-5'>
          <Dialog open={isCreateProductDialogOpen} onOpenChange={closeDialog}>
            <DialogTrigger asChild>
              <Button className='w-fit cursor-pointer rounded-xl bg-white p-5 text-[#4a2c00] hover:bg-white/50'>
                <Plus /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] min-w-4xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='text-2xl'>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>

              <div className='space-y-6'>
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='mb-4 text-lg font-semibold'>
                      Basic Information
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='name'>Product Name *</Label>
                        <Controller
                          name='name'
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
                        <Label htmlFor='brand'>Brand</Label>
                        <Controller
                          name='brand'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder='Enter brand name'
                              className='mt-1'
                            />
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor='sku'>SKU *</Label>
                        <Controller
                          name='sku'
                          control={control}
                          rules={{ required: 'SKU is required' }}
                          render={({ field, fieldState }) => (
                            <div>
                              <Input
                                {...field}
                                placeholder='Enter SKU'
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
                        <Label htmlFor='category'>Category</Label>
                        <Controller
                          name='category_id'
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className='mt-1'>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                              <SelectContent>
                                {PRODUCT_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor='weight'>Weight (kg)</Label>
                        <Controller
                          name='weight'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type='number'
                              step='0.01'
                              placeholder='0.00'
                              className='mt-1'
                            />
                          )}
                        />
                      </div>

                      <div className='flex items-center space-x-2'>
                        <Controller
                          name='is_active'
                          control={control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label>Active Product</Label>
                      </div>
                    </div>

                    <div className='mt-4'>
                      <Label htmlFor='short_description'>
                        Short Description
                      </Label>
                      <Controller
                        name='short_description'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            placeholder='Brief product description'
                            className='mt-1'
                            rows={2}
                          />
                        )}
                      />
                    </div>

                    <div className='mt-4'>
                      <Label htmlFor='description'>Full Description</Label>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
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
                    <h3 className='mb-4 text-lg font-semibold'>
                      Dimensions (cm)
                    </h3>
                    <div className='grid grid-cols-3 gap-4'>
                      <div>
                        <Label>Width</Label>
                        <Controller
                          name='dimensions.width'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type='number'
                              step='0.1'
                              placeholder='0.0'
                              className='mt-1'
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label>Height</Label>
                        <Controller
                          name='dimensions.height'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type='number'
                              step='0.1'
                              placeholder='0.0'
                              className='mt-1'
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label>Depth</Label>
                        <Controller
                          name='dimensions.depth'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type='number'
                              step='0.1'
                              placeholder='0.0'
                              className='mt-1'
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <h3 className='mb-4 text-lg font-semibold'>Pricing</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label>Base Price (THB) *</Label>
                        <Controller
                          name='prices.base_price'
                          control={control}
                          rules={{ required: 'Base price is required' }}
                          render={({ field, fieldState }) => (
                            <div>
                              <Input
                                {...field}
                                type='number'
                                step='0.01'
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
                        <Label>Cost Price (THB)</Label>
                        <Controller
                          name='prices.cost_price'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type='number'
                              step='0.01'
                              placeholder='0.00'
                              className='mt-1'
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className='mt-4 flex items-center space-x-2'>
                      <Controller
                        name='prices.is_on_sale'
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label>On Sale</Label>
                    </div>

                    {isProductOnSale && (
                      <div className='mt-4 grid grid-cols-3 gap-4'>
                        <div>
                          <Label>Sale Price (THB)</Label>
                          <Controller
                            name='prices.sale_price'
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type='number'
                                step='0.01'
                                placeholder='0.00'
                                className='mt-1'
                              />
                            )}
                          />
                        </div>
                        <div>
                          <Label>Sale Start Date</Label>
                          <Controller
                            name='prices.sale_start_date'
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type='datetime-local'
                                className='mt-1'
                              />
                            )}
                          />
                        </div>
                        <div>
                          <Label>Sale End Date</Label>
                          <Controller
                            name='prices.sale_end_date'
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type='datetime-local'
                                className='mt-1'
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <h3 className='text-lg font-semibold'>Product Options</h3>
                      <Button
                        type='button'
                        onClick={handleAddProductOption}
                        variant='outline'
                        size='sm'
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        Add Option
                      </Button>
                    </div>

                    <div className='space-y-4'>
                      {productOptionFields.map(
                        (productOptionField, productOptionIndex) => (
                          <Card key={productOptionField.id} className='p-4'>
                            <div className='mb-4 flex items-start justify-between'>
                              <h4 className='font-medium'>
                                Option {productOptionIndex + 1}
                              </h4>
                              <Button
                                type='button'
                                onClick={() =>
                                  removeProductOptionField(productOptionIndex)
                                }
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
                                  name={`productOptions.${productOptionIndex}.option_name`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder='e.g., Color, Size'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <Label>Option Value</Label>
                                <Controller
                                  name={`productOptions.${productOptionIndex}.option_value`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder='e.g., Red, Large'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <Label>Additional Price (THB)</Label>
                                <Controller
                                  name={`productOptions.${productOptionIndex}.additional_price`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type='number'
                                      step='0.01'
                                      placeholder='0.00'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <Label>Stock Quantity</Label>
                                <Controller
                                  name={`productOptions.${productOptionIndex}.stock_quantity`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type='number'
                                      placeholder='0'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <Label>Option SKU</Label>
                                <Controller
                                  name={`productOptions.${productOptionIndex}.sku`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder='Optional SKU'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div className='mt-6 flex items-center space-x-2'>
                                <Controller
                                  name={`productOptions.${productOptionIndex}.is_available`}
                                  control={control}
                                  render={({ field }) => (
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  )}
                                />
                                <Label>Available</Label>
                              </div>
                            </div>
                          </Card>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <h3 className='text-lg font-semibold'>Product Images</h3>
                      <Button
                        type='button'
                        onClick={handleAddProductImage}
                        variant='outline'
                        size='sm'
                      >
                        <Upload className='mr-2 h-4 w-4' />
                        Add Image
                      </Button>
                    </div>

                    <div className='space-y-4'>
                      {productImageFields.map(
                        (productImageField, productImageIndex) => (
                          <Card key={productImageField.id} className='p-4'>
                            <div className='mb-4 flex items-start justify-between'>
                              <h4 className='font-medium'>
                                Image {productImageIndex + 1}
                              </h4>
                              <Button
                                type='button'
                                onClick={() =>
                                  removeProductImageField(productImageIndex)
                                }
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
                                  name={`productImages.${productImageIndex}.image_url`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder='https://example.com/image.jpg'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <Label>Alt Text</Label>
                                <Controller
                                  name={`productImages.${productImageIndex}.alt_text`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder='Image description'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <Label>Display Order</Label>
                                <Controller
                                  name={`productImages.${productImageIndex}.display_order`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type='number'
                                      placeholder='1'
                                      className='mt-1'
                                    />
                                  )}
                                />
                              </div>
                              <div className='mt-6 flex items-center space-x-2'>
                                <Controller
                                  name={`productImages.${productImageIndex}.is_primary`}
                                  control={control}
                                  render={({ field }) => (
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={(isSelectedPrimary) => {
                                        handlePrimaryImageChange(
                                          productImageIndex,
                                          isSelectedPrimary,
                                        )
                                        field.onChange(isSelectedPrimary)
                                      }}
                                    />
                                  )}
                                />
                                <Label>Primary Image</Label>
                              </div>
                            </div>
                          </Card>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className='flex justify-end gap-4'>
                  <Button type='button' variant='outline' onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    type='button'
                    className='bg-[#4a2c00] hover:bg-[#4a2c00]/80'
                    onClick={handleSubmit(
                      editingProduct
                        ? handleUpdateProduct
                        : handleCreateProduct,
                    )}
                    disabled={
                      createProductMutation.isPending ||
                      updateProductMutation.isPending
                    }
                  >
                    {(createProductMutation.isPending ||
                      updateProductMutation.isPending) && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <div className='grid grid-cols-4 gap-5 text-[#4a2c00]'>
          <SumCard
            label={'Total Products'}
            value={products.length}
            href={'/dashboard/products'}
          />
        </div>
      </div>

      <div className='rounded-xl bg-white p-5'>
        {isLoading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading products...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const { base_price, sale_price, is_on_sale } =
                  getProductPrice(product)
                const totalStock = calculateTotalStock(product)

                return (
                  <TableRow key={product.id}>
                    <TableCell className='font-medium'>
                      {product.name}
                    </TableCell>
                    <TableCell>{product.brand || '-'}</TableCell>
                    <TableCell>
                      <code className='rounded bg-gray-100 px-2 py-1 text-sm'>
                        {product.sku || '-'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col'>
                        {is_on_sale && sale_price ? (
                          <>
                            <span className='text-sm text-gray-500 line-through'>
                              {formatPrice(base_price)}
                            </span>
                            <span className='font-semibold text-red-600'>
                              {formatPrice(sale_price)}
                            </span>
                          </>
                        ) : (
                          <span>{formatPrice(base_price)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(totalStock)}>
                        {totalStock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getProductStatusBadgeVariant(
                          product.is_active,
                        )}
                      >
                        {getProductStatusDisplayText(product.is_active)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(product.created_at)}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button variant='outline' size='sm'>
                          <Eye className='h-4 w-4' /> View
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className='h-4 w-4' /> Edit
                        </Button>
                        {/* <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='outline'
                              size='sm'
                              className='text-red-600'
                              disabled={deleteProductMutation.isPending}
                            >
                              <Trash2 className='h-4 w-4' /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the product "{product.name}"
                                and all related data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteProduct(product.id.toString())
                                }
                                className='bg-red-600 hover:bg-red-700'
                              >
                                {deleteProductMutation.isPending && (
                                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                )}
                                Delete Product
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog> */}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </IndexLayout>
  )
}

export default ProductPage
