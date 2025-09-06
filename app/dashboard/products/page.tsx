'use client'
import { useQuery } from '@tanstack/react-query'
import { Plus, Upload, X, Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

import type { Tables } from '@/types/supabase'
import type { FC } from 'react'

import { getCategories } from '@/actions/category'
import { getProducts } from '@/actions/product'
import { IndexLayout } from '@/components/Layout/Index'
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
import { formatDate } from '@/lib/date'

import { HeaderCard } from '../components/HeaderCard'

type ProductInput = Omit<Tables<'products'>, 'id' | 'created_at' | 'updated_at'>
type ProductOptionInput = Omit<
  Tables<'product_options'>,
  'id' | 'product_id' | 'created_at'
>
type ProductImageInput = Omit<
  Tables<'product_images'>,
  'id' | 'product_id' | 'created_at'
>

type ProductFormInput = ProductInput & {
  productOptions: ProductOptionInput[] | null
  productImages: ProductImageInput[] | null
}

const ProductPage: FC = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const productForm = useForm<ProductFormInput>({
    defaultValues: {
      name: '',
      description: '',
      short_description: '',
      category_id: null,
      sku: '',
      productOptions: [],
      productImages: [],
    },
  })

  const { control, handleSubmit, reset, setValue } = productForm

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

  const handleAddProductOption = () => {
    addProductOptionField({
      option_name: '',
      option_value: '',
      option_price: 0,
      option_stock: 0,
      sku: '',
    })
  }

  const handleAddProductImage = () => {
    addProductImageField({
      image_url: '',
      alt_text: '',
      is_primary: productImageFields.length === 0,
    })
  }

  const closeProductDialog = () => {
    setIsProductDialogOpen(false)
    reset()
  }

  const handlePrimaryImageChange = (
    selectedIndex: number,
    isSelectedPrimary: boolean,
  ) => {
    if (isSelectedPrimary) {
      productImageFields.forEach((_, index) => {
        if (index !== selectedIndex) {
          setValue(`productImages.${index}.is_primary`, false)
        }
      })
    }
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
          <Dialog
            onOpenChange={(value) => {
              if (!value) {
                closeProductDialog()
              }
            }}
            open={isProductDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsProductDialogOpen(true)
                }}
                className='w-fit cursor-pointer rounded-xl bg-white p-5 text-[#4a2c00] hover:bg-white/50'
              >
                <Plus /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] min-w-2xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='text-2xl'>Add New Product</DialogTitle>
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
                              <SelectTrigger className='mt-1 w-full'>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                              <SelectContent>
                                {categories?.map((category) => (
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
                    <div className='mb-4 flex items-center justify-between'>
                      <h3 className='text-lg font-semibold'>Product Options</h3>
                      <Button
                        type='button'
                        onClick={handleAddProductOption}
                        variant='outline'
                        size='sm'
                      >
                        <Plus className='size-4' />
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
                        <Upload className='size-4' />
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
                  <Button
                    type='button'
                    variant='outline'
                    onClick={closeProductDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='button'
                    className='bg-[#4a2c00] hover:bg-[#4a2c00]/80'
                  >
                    Create Product
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <div className='grid grid-cols-4 gap-5 text-[#4a2c00]'>
          <HeaderCard label='Total Products' value={0} />
        </div>
      </div>

      <div className='rounded-xl bg-white p-5'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => {
              return (
                <TableRow key={product.id}>
                  <TableCell className='font-medium'>{product.name}</TableCell>
                  <TableCell>
                    <code className='rounded bg-gray-100 px-2 py-1 text-sm'>
                      {product.sku || '-'}
                    </code>
                  </TableCell>
                  <TableCell>{formatDate(product.created_at)}</TableCell>
                  <TableCell>{formatDate(product.updated_at)}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setIsProductDialogOpen(true)
                        }}
                      >
                        <Edit className='size-4' /> Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </IndexLayout>
  )
}

export default ProductPage
