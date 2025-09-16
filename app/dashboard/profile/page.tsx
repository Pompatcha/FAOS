'use client'

import { useForm } from 'react-hook-form'

import type { FC } from 'react'

import { IndexLayout } from '@/components/Layout/Index'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRequireAuth } from '@/contexts/AuthContext.tsx'

interface ProfileFormData {
  first_name: string
  last_name: string
  telephone: string
  shipping_address: string
}

const ProfilePage: FC = () => {
  useRequireAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      telephone: '',
      shipping_address: '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    console.log(data)
  }

  return (
    <IndexLayout>
      <div className='flex justify-center'>
        <Card className='w-full bg-white sm:w-2xl'>
          <CardHeader>
            <CardTitle className='text-2xl'>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='first_name'>First Name</Label>
              <Input
                id='first_name'
                type='text'
                placeholder='Enter your first name'
                className='border-white/30 bg-white/20 focus:ring-white/50'
                {...register('first_name', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                })}
              />
              {errors.first_name && (
                <p className='text-sm text-red-500'>
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='last_name'>Last Name</Label>
              <Input
                id='last_name'
                type='text'
                placeholder='Enter your last name'
                className='border-white/30 bg-white/20 focus:ring-white/50'
                {...register('last_name', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                })}
              />
              {errors.last_name && (
                <p className='text-sm text-red-500'>
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='telephone'>Phone Number</Label>
              <Input
                id='telephone'
                type='tel'
                placeholder='0812345678'
                className='border-white/30 bg-white/20 focus:ring-white/50'
                {...register('telephone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Phone number must be 10 digits',
                  },
                })}
              />
              {errors.telephone && (
                <p className='text-sm text-red-500'>
                  {errors.telephone.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='shipping_address'>Shipping Address</Label>
              <Textarea
                id='shipping_address'
                rows={4}
                placeholder='Enter your shipping address'
                className='resize-none border-white/30 bg-white/20 focus:ring-white/50'
                {...register('shipping_address', {
                  required: 'Shipping address is required',
                  minLength: {
                    value: 10,
                    message: 'Address must be at least 10 characters',
                  },
                })}
              />
              {errors.shipping_address && (
                <p className='text-sm text-red-500'>
                  {errors.shipping_address.message}
                </p>
              )}
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                className='bg-primary'
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant='outline'
                className='border-white/30 bg-white/20 hover:bg-white/30 hover:text-white'
                type='button'
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndexLayout>
  )
}

export default ProfilePage
