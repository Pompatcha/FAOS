'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Phone, MapPin, Save } from 'lucide-react'
import { useEffect, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { Tables } from '@/types/supabase'

import { getUserById, updateUser } from '@/actions/user'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth, useRequireAuth } from '@/contexts/AuthContext.tsx'

type UserInput = Omit<Tables<'users'>, 'id' | 'created_at' | 'role'>

const ProfilePage: FC = () => {
  useRequireAuth()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getUserById(user?.id || ''),
    enabled: !!user?.id,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserInput>({
    defaultValues: {
      first_name: '',
      last_name: '',
      telephone: '',
      shipping_address: '',
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: UserInput) => {
      if (!user?.id) {
        throw new Error('User ID not found')
      }
      return updateUser(user?.id || '', data)
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
        toast.success('Profile updated successfully!')
      } else {
        toast.error(result.message || 'Failed to update profile')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred while updating profile')
    },
  })

  useEffect(() => {
    if (profile?.data) {
      reset({
        ...profile?.data,
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: UserInput) => {
    updateUserMutation.mutate(data)
  }

  return (
    <IndexLayout>
      <Loading isLoading={isLoading} />

      <Card className='border-border mx-auto shadow-sm sm:w-2xl'>
        <CardHeader className='border-b'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
              <User className='text-primary h-6 w-6' />
            </div>
            <div>
              <CardTitle className='text-xl'>Personal Information</CardTitle>
              <CardDescription>
                Update your profile details and contact information
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <div className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                <User className='h-4 w-4' />
                <span>Full Name</span>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='first_name' className='text-sm font-medium'>
                    First Name
                  </Label>
                  <Input
                    id='first_name'
                    type='text'
                    placeholder='John'
                    className='h-11'
                    {...register('first_name', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                  />
                  {errors.first_name && (
                    <p className='text-destructive text-sm'>
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='last_name' className='text-sm font-medium'>
                    Last Name
                  </Label>
                  <Input
                    id='last_name'
                    type='text'
                    placeholder='Doe'
                    className='h-11'
                    {...register('last_name', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                  />
                  {errors.last_name && (
                    <p className='text-destructive text-sm'>
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='border-t' />

            <div className='space-y-4'>
              <div className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                <Phone className='h-4 w-4' />
                <span>Contact Information</span>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='telephone' className='text-sm font-medium'>
                  Phone Number
                </Label>
                <Input
                  id='telephone'
                  type='tel'
                  placeholder='0812345678'
                  className='h-11'
                  {...register('telephone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Phone number must be 10 digits',
                    },
                  })}
                />
                {errors.telephone && (
                  <p className='text-destructive text-sm'>
                    {errors.telephone.message}
                  </p>
                )}
              </div>
            </div>

            <div className='border-t' />

            <div className='space-y-4'>
              <div className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                <MapPin className='h-4 w-4' />
                <span>Shipping Address</span>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='shipping_address'
                  className='text-sm font-medium'
                >
                  Address
                </Label>
                <Textarea
                  id='shipping_address'
                  rows={4}
                  placeholder='123 Main Street, City, Province, Postal Code'
                  className='resize-none'
                  {...register('shipping_address', {
                    required: 'Shipping address is required',
                    minLength: {
                      value: 10,
                      message: 'Address must be at least 10 characters',
                    },
                  })}
                />
                {errors.shipping_address && (
                  <p className='text-destructive text-sm'>
                    {errors.shipping_address.message}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center justify-between border-t pt-6'>
              <p className='text-muted-foreground text-sm'>
                {isDirty ? 'You have unsaved changes' : 'All changes saved'}
              </p>

              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => reset()}
                  disabled={
                    !isDirty || isSubmitting || updateUserMutation.isPending
                  }
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={
                    !isDirty || isSubmitting || updateUserMutation.isPending
                  }
                  className='min-w-[120px]'
                >
                  {isSubmitting || updateUserMutation.isPending ? (
                    <>
                      <span className='mr-2 animate-spin'>⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </IndexLayout>
  )
}

export default ProfilePage
