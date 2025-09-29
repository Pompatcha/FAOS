'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { Tables } from '@/types/supabase'

import { getUserById, updateUser } from '@/actions/user'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    formState: { errors, isSubmitting },
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
      <div className='flex justify-center'>
        <Card className='w-full bg-white'>
          <CardHeader>
            <CardTitle className='text-2xl'>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='grid gap-5 lg:grid-cols-2'
            >
              <div className='space-y-2'>
                <Label htmlFor='first_name'>First Name</Label>
                <Input
                  id='first_name'
                  type='text'
                  placeholder='Enter your first name'
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
                  type='submit'
                  disabled={isSubmitting || updateUserMutation.isPending}
                >
                  {isSubmitting || updateUserMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </IndexLayout>
  )
}

export default ProfilePage
