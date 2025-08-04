'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Thailand',
]

interface CustomerFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: 'active' | 'inactive' | 'blocked'
  notes: string
}

interface Customer {
  id?: string | number
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: 'active' | 'inactive' | 'blocked'
  notes?: string
}

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CustomerFormData) => void
  customer?: Customer | null
}

const defaultValues: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  status: 'active',
  notes: '',
}

export function CustomerModal({
  isOpen,
  onClose,
  onSave,
  customer,
}: CustomerModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CustomerFormData>({
    defaultValues,
    mode: 'onChange',
  })

  const watchedCountry = watch('country')
  const watchedStatus = watch('status')

  useEffect(() => {
    if (customer) {
      reset({
        ...customer,
      })
    } else {
      reset(defaultValues)
    }
  }, [customer, isOpen, reset])

  const onSubmit = (data: CustomerFormData) => {
    onSave(data)
    onClose()
  }

  const handleClose = () => {
    reset(defaultValues)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
          <DialogDescription>
            {customer
              ? 'Edit customer information'
              : 'Enter new customer information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Full Name
              </Label>
              <div className='col-span-3'>
                <Input
                  id='name'
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <div className='col-span-3'>
                <Input
                  id='email'
                  type='email'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='phone' className='text-right'>
                Phone
              </Label>
              <div className='col-span-3'>
                <Input
                  id='phone'
                  {...register('phone', {
                    required: 'Phone number is required',
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits',
                    },
                  })}
                />
                {errors.phone && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='address' className='text-right'>
                Address
              </Label>
              <Textarea
                id='address'
                {...register('address')}
                className='col-span-3'
                rows={2}
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='city' className='text-right'>
                City
              </Label>
              <div className='col-span-3'>
                <Input
                  id='city'
                  {...register('city', {
                    required: 'City is required',
                  })}
                />
                {errors.city && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='country' className='text-right'>
                Country
              </Label>
              <Select
                value={watchedCountry}
                onValueChange={(value) => setValue('country', value)}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select country' />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                value={watchedStatus}
                onValueChange={(value) =>
                  setValue('status', value as 'active' | 'inactive' | 'blocked')
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                  <SelectItem value='blocked'>Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='notes' className='text-right'>
                Notes
              </Label>
              <Textarea
                id='notes'
                {...register('notes')}
                className='col-span-3'
                rows={3}
                placeholder='Additional notes about the customer...'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={!isValid}>
              {customer ? 'Save Changes' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
