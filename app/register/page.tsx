'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SocialIcon } from 'react-social-icons'
import { toast } from 'sonner'

import { IndexLayout } from '@/components/Layout/Index'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeToNewsletter: boolean
}

const socialProviders = [
  { id: 'google', network: 'google', name: 'Google' },
  { id: 'facebook', network: 'facebook', name: 'Facebook' },
]

const RegisterPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      subscribeToNewsletter: false,
    },
  })

  const password = watch('password')

  const validatePassword = (password: string) => {
    const errors = []

    if (password.length < 8) errors.push('At least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
    if (!/\d/.test(password)) errors.push('One number')

    return errors.length === 0
      ? true
      : `Password must contain: ${errors.join(', ')}`
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true)

    try {
      console.log('Signup form submitted:', data)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success(
        'Account created successfully! Please check your email for verification.',
      )
      router.push('/login')
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Account creation failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialAuth = (providerName: string) => {
    console.log('Social auth clicked:', providerName)
    toast.info(`${providerName} authentication not implemented yet`)
  }

  return (
    <IndexLayout>
      <div className='bg-primary flex flex-col items-center justify-center'>
        <div className='w-full max-w-sm md:max-w-5xl'>
          <div className='flex flex-col gap-6'>
            <Card className='overflow-hidden border-none p-0'>
              <CardContent className='grid p-0 md:grid-cols-2'>
                <form onSubmit={handleSubmit(onSubmit)} className='p-6 md:p-8'>
                  <div className='flex flex-col gap-6'>
                    {/* Header */}
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
                        Create your account
                      </h1>
                      <p className='text-muted-foreground text-balance'>
                        Join us today and start your journey with premium
                        organic products
                      </p>
                    </header>

                    {/* Name Fields */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='grid gap-3'>
                        <Label htmlFor='firstName'>First Name *</Label>
                        <Input
                          id='firstName'
                          type='text'
                          placeholder='John'
                          className={
                            errors.firstName
                              ? 'border-red-500 focus:border-red-500'
                              : ''
                          }
                          {...register('firstName', {
                            required: 'First name is required',
                            minLength: {
                              value: 2,
                              message:
                                'First name must be at least 2 characters',
                            },
                          })}
                          disabled={isSubmitting}
                        />
                        {errors.firstName && (
                          <p className='text-sm text-red-600' role='alert'>
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className='grid gap-3'>
                        <Label htmlFor='lastName'>Last Name *</Label>
                        <Input
                          id='lastName'
                          type='text'
                          placeholder='Doe'
                          className={
                            errors.lastName
                              ? 'border-red-500 focus:border-red-500'
                              : ''
                          }
                          {...register('lastName', {
                            required: 'Last name is required',
                            minLength: {
                              value: 2,
                              message:
                                'Last name must be at least 2 characters',
                            },
                          })}
                          disabled={isSubmitting}
                        />
                        {errors.lastName && (
                          <p className='text-sm text-red-600' role='alert'>
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className='grid gap-3'>
                      <Label htmlFor='email'>Email *</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='john.doe@example.com'
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

                    {/* Password Field */}
                    <div className='grid gap-3'>
                      <Label htmlFor='password'>Password *</Label>
                      <Input
                        id='password'
                        type='password'
                        placeholder='Create a strong password'
                        className={
                          errors.password
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }
                        {...register('password', {
                          required: 'Password is required',
                          validate: validatePassword,
                        })}
                        disabled={isSubmitting}
                      />
                      {errors.password && (
                        <p className='text-sm text-red-600' role='alert'>
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className='grid gap-3'>
                      <Label htmlFor='confirmPassword'>
                        Confirm Password *
                      </Label>
                      <Input
                        id='confirmPassword'
                        type='password'
                        placeholder='Confirm your password'
                        className={
                          errors.confirmPassword
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) =>
                            value === password || 'Passwords do not match',
                        })}
                        disabled={isSubmitting}
                      />
                      {errors.confirmPassword && (
                        <p className='text-sm text-red-600' role='alert'>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type='submit'
                      className='w-full'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    {/* Social Auth Divider */}
                    <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                      <span className='bg-card text-muted-foreground relative z-10 px-2'>
                        Or continue with
                      </span>
                    </div>

                    {/* Social Login */}
                    <div className='flex justify-center gap-5'>
                      {socialProviders.map((provider) => (
                        <button
                          key={provider.id}
                          type='button'
                          onClick={() => handleSocialAuth(provider.name)}
                          className='transition-opacity hover:opacity-80'
                          disabled={isSubmitting}
                          aria-label={`Sign up with ${provider.name}`}
                        >
                          <SocialIcon
                            network={provider.network}
                            style={{ width: 38, height: 38 }}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Login Link */}
                    <div className='text-center text-sm'>
                      Already have an account?{' '}
                      <button
                        type='button'
                        onClick={() => router.push('/login')}
                        className='underline underline-offset-4 hover:text-blue-600'
                        disabled={isSubmitting}
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </form>

                {/* Background Image */}
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
      </div>
    </IndexLayout>
  )
}

export default RegisterPage
