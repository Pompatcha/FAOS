'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { SocialIcon } from 'react-social-icons'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface LoginFormData {
  email: string
  password: string
}

interface SocialAuthProvider {
  id: string
  network: string
  displayName: string
}

const SOCIAL_AUTH_PROVIDERS: SocialAuthProvider[] = [
  {
    id: 'google',
    network: 'google',
    displayName: 'Google',
  },
  {
    id: 'facebook',
    network: 'facebook',
    displayName: 'Facebook',
  },
]

const COMPANY_BRANDING = {
  logoSrc: '/logo.png',
  logoAlt: 'FAOS Logo',
  logoWidth: 120,
  logoHeight: 120,
  welcomeTitle: 'Welcome back! Please sign in to your account',
  welcomeSubtitle: 'Enter your credentials to access your account',
}

const LOGIN_PAGE_CONTENT = {
  backgroundImageSrc:
    'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg',
  backgroundImageAlt: 'Beekeeping background image',
  signupLinkText: "Don't have an account?",
  signupButtonText: 'Sign up',
  socialAuthDividerText: 'Or continue with',
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoginFormSubmitting, setIsLoginFormSubmitting] = useState(false)

  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = loginForm

  const handleLoginFormSubmit = async (formData: LoginFormData) => {
    setIsLoginFormSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Login successful! Redirecting...')

      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials and try again.')
    } finally {
      setIsLoginFormSubmitting(false)
    }
  }

  const handleSocialAuthClick = async (providerId: string) => {
    try {
      console.log('Social auth clicked:', providerId)
      toast.info(`${providerId} authentication not implemented yet`)
    } catch (error) {
      console.error('Social auth error:', error)
      toast.error('Social authentication failed. Please try again.')
    }
  }

  const handleSignupLinkClick = () => {
    router.push('/register')
  }

  const getInputErrorClassName = (hasError: boolean) => {
    return hasError ? 'border-red-500 focus:border-red-500' : ''
  }

  return (
    <div className='bg-primary flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-5xl'>
        <div className='flex flex-col gap-6'>
          <Card className='overflow-hidden border-none p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              <form
                onSubmit={handleSubmit(handleLoginFormSubmit)}
                className='p-6 md:p-8'
              >
                <div className='flex flex-col gap-6'>
                  {/* Header Section */}
                  <header className='flex flex-col items-center text-center'>
                    <Image
                      src={COMPANY_BRANDING.logoSrc}
                      width={COMPANY_BRANDING.logoWidth}
                      height={COMPANY_BRANDING.logoHeight}
                      alt={COMPANY_BRANDING.logoAlt}
                      priority
                      className='mb-5 object-contain'
                    />

                    <h1 className='text-2xl font-bold'>
                      {COMPANY_BRANDING.welcomeTitle}
                    </h1>
                    <p className='text-muted-foreground text-balance'>
                      {COMPANY_BRANDING.welcomeSubtitle}
                    </p>
                  </header>

                  {/* Email Input Field */}
                  <div className='grid gap-3'>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      className={getInputErrorClassName(Boolean(errors.email))}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      aria-invalid={Boolean(errors.email)}
                      disabled={isLoginFormSubmitting}
                    />
                    {errors.email && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Input Field */}
                  <div className='grid gap-3'>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='password'>Password *</Label>
                      <button
                        type='button'
                        className='text-sm text-blue-600 underline hover:text-blue-800'
                        onClick={() => {
                          // TODO: Navigate to forgot password page
                          router.push('/forgot-password')
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Enter your password'
                      className={getInputErrorClassName(
                        Boolean(errors.password),
                      )}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      aria-invalid={Boolean(errors.password)}
                      disabled={isLoginFormSubmitting}
                    />
                    {errors.password && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Login Submit Button */}
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isLoginFormSubmitting}
                  >
                    {isLoginFormSubmitting ? 'Signing in...' : 'Login'}
                  </Button>

                  {/* Social Auth Divider */}
                  <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                    <span className='bg-card text-muted-foreground relative z-10 px-2'>
                      {LOGIN_PAGE_CONTENT.socialAuthDividerText}
                    </span>
                  </div>

                  {/* Social Authentication Buttons */}
                  <div className='flex justify-center gap-5'>
                    {SOCIAL_AUTH_PROVIDERS.map((socialProvider) => (
                      <button
                        key={socialProvider.id}
                        type='button'
                        onClick={() =>
                          handleSocialAuthClick(socialProvider.displayName)
                        }
                        className='transition-opacity hover:opacity-80'
                        disabled={isLoginFormSubmitting}
                        aria-label={`Login with ${socialProvider.displayName}`}
                      >
                        <SocialIcon
                          network={socialProvider.network}
                          style={{ width: 38, height: 38 }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Signup Link */}
                  <div className='text-center text-sm'>
                    {LOGIN_PAGE_CONTENT.signupLinkText}{' '}
                    <button
                      type='button'
                      onClick={handleSignupLinkClick}
                      className='underline underline-offset-4 hover:text-blue-600'
                      disabled={isLoginFormSubmitting}
                    >
                      {LOGIN_PAGE_CONTENT.signupButtonText}
                    </button>
                  </div>
                </div>
              </form>

              {/* Background Image Section */}
              <div className='relative hidden md:block'>
                <img
                  src={LOGIN_PAGE_CONTENT.backgroundImageSrc}
                  alt={LOGIN_PAGE_CONTENT.backgroundImageAlt}
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
