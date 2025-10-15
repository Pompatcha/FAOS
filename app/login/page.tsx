'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SocialIcon } from 'react-social-icons'
import { toast } from 'sonner'

import { login, loginWithGoogle, loginWithFacebook } from '@/actions/auth'
import { IndexLayout } from '@/components/Layout/Index'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext.tsx'

interface LoginFormData {
  email: string
  password: string
}

const socialProviders = [
  { id: 'google', network: 'google', name: 'Google' },
  { id: 'facebook', network: 'facebook', name: 'Facebook' },
]

const LoginPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      const result = await login(data.email, data.password)

      if (result.success) {
        toast.success('Login successful! Redirecting...')
        router.push('/')
      } else {
        toast.error(result.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialAuth = async (providerName: string) => {
    setIsSubmitting(true)

    try {
      let result

      if (providerName === 'Google') {
        result = await loginWithGoogle()
      } else if (providerName === 'Facebook') {
        result = await loginWithFacebook()
      }

      if (result?.success) {
        toast.success(`Redirecting to ${providerName}...`)
        router.push(result?.data?.url ?? '')
      } else {
        toast.error(result?.message || `${providerName} login failed`)
      }
    } catch (error) {
      console.error(`${providerName} login error:`, error)
      toast.error(`${providerName} authentication failed`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <IndexLayout>
      <div className='mx-auto max-w-5xl'>
        <div className='flex flex-col gap-6'>
          <Card className='overflow-hidden border-none p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              <form onSubmit={handleSubmit(onSubmit)} className='p-6 md:p-8'>
                <div className='flex flex-col gap-6'>
                  <header className='flex flex-col items-center text-center'>
                    <Image
                      src='/logo.png'
                      width={120}
                      height={120}
                      alt='FAOS Logo'
                      priority
                      className='mb-5 object-contain'
                    />
                    <h1 className='text-2xl font-bold'>
                      Welcome back! Please sign in to your account
                    </h1>
                    <p className='text-muted-foreground text-balance'>
                      Enter your credentials to access your account
                    </p>
                  </header>

                  <div className='grid gap-3'>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      className={
                        errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className='grid gap-3'>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='password'>Password *</Label>
                      <button
                        type='button'
                        className='text-sm text-blue-600 underline hover:text-blue-800'
                        onClick={() => router.push('/')}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Enter your password'
                      className={
                        errors.password
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.password && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Login'}
                  </Button>

                  <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                    <span className='bg-card text-muted-foreground relative z-10 px-2'>
                      Or continue with
                    </span>
                  </div>

                  <div className='flex justify-center gap-5'>
                    {socialProviders.map((provider) => (
                      <button
                        key={provider.id}
                        type='button'
                        onClick={() => handleSocialAuth(provider.name)}
                        className='transition-opacity hover:opacity-80'
                        disabled={isSubmitting}
                        aria-label={`Login with ${provider.name}`}
                      >
                        <SocialIcon
                          network={provider.network}
                          style={{ width: 38, height: 38 }}
                        />
                      </button>
                    ))}
                  </div>

                  <div className='text-center text-sm'>
                    Don&apos;t have an account?{' '}
                    <button
                      type='button'
                      onClick={() => router.push('/register')}
                      className='underline underline-offset-4 hover:text-blue-600'
                      disabled={isSubmitting}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </form>

              <div className='relative hidden md:block'>
                <img
                  src='https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg'
                  alt='Beekeeping background image'
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </IndexLayout>
  )
}

export default LoginPage
