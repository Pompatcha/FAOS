'use client'

import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

const ResetPasswordPage: FC = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const supabase = createClient()

  const form = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const handleAuthStateChange = () => {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
        } else if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      })
    }

    handleAuthStateChange()
  }, [router, supabase.auth])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess('Password updated successfully! Redirecting to dashboard...')
        form.reset()
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Reset password error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md'>
        <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-xl'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              Reset Your Password
            </h1>
            <p className='text-gray-600'>
              Enter your new password below to complete the reset process
            </p>
          </div>

          {error && (
            <Alert className='mb-6 border-red-200 bg-red-50'>
              <AlertCircle className='h-4 w-4 text-red-600' />
              <AlertDescription className='text-red-700'>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className='mb-6 border-green-200 bg-green-50'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-700'>
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'
              >
                New Password
              </Label>
              <div className='relative'>
                <Lock className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your new password'
                  {...form.register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                    },
                  })}
                  className='pr-10 pl-10'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className='text-sm text-red-600'>
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='confirmPassword'
                className='text-sm font-medium text-gray-700'
              >
                Confirm New Password
              </Label>
              <div className='relative'>
                <Lock className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm your new password'
                  {...form.register('confirmPassword', {
                    required: 'Please confirm your password',
                  })}
                  className='pr-10 pl-10'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className='text-sm text-red-600'>
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              disabled={isLoading || !form.formState.isValid}
              className='w-full'
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <button
              type='button'
              onClick={() => router.push('/')}
              className='text-sm text-gray-600 hover:text-gray-800'
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
