'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { SocialIcon } from 'react-social-icons'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeToNewsletter: boolean
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
  welcomeTitle: 'Create your account',
  welcomeSubtitle:
    'Join us today and start your journey with premium organic products',
}

const SIGNUP_PAGE_CONTENT = {
  backgroundImageSrc:
    'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg',
  backgroundImageAlt: 'Beekeeping background image',
  loginLinkText: 'Already have an account?',
  loginButtonText: 'Sign in',
  socialAuthDividerText: 'Or continue with',
  termsAndConditionsText:
    'I agree to the Terms and Conditions and Privacy Policy',
  newsletterSubscriptionText:
    'Subscribe to our newsletter for updates and promotions',
}

const PASSWORD_VALIDATION_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,
}

export default function SignupPage() {
  const router = useRouter()
  const [isSignupFormSubmitting, setIsSignupFormSubmitting] = useState(false)

  const signupForm = useForm<SignupFormData>({
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = signupForm

  const currentPasswordValue = watch('password')

  const validatePasswordRequirements = (password: string) => {
    const errors = []

    if (password.length < PASSWORD_VALIDATION_RULES.minLength) {
      errors.push(`At least ${PASSWORD_VALIDATION_RULES.minLength} characters`)
    }

    if (PASSWORD_VALIDATION_RULES.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('One uppercase letter')
    }

    if (PASSWORD_VALIDATION_RULES.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('One lowercase letter')
    }

    if (PASSWORD_VALIDATION_RULES.requireNumber && !/\d/.test(password)) {
      errors.push('One number')
    }

    if (
      PASSWORD_VALIDATION_RULES.requireSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.push('One special character')
    }

    return errors.length === 0
      ? true
      : `Password must contain: ${errors.join(', ')}`
  }

  const handleSignupFormSubmit = async (formData: SignupFormData) => {
    setIsSignupFormSubmitting(true)

    try {
      // TODO: Implement actual user registration logic
      console.log('Signup form submitted:', formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success(
        'Account created successfully! Please check your email for verification.',
      )

      // Redirect to login or dashboard
      router.push('/login')
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Account creation failed. Please try again.')
    } finally {
      setIsSignupFormSubmitting(false)
    }
  }

  const handleSocialAuthClick = async (providerDisplayName: string) => {
    try {
      // TODO: Implement social authentication
      console.log('Social auth clicked:', providerDisplayName)
      toast.info(`${providerDisplayName} authentication not implemented yet`)
    } catch (error) {
      console.error('Social auth error:', error)
      toast.error('Social authentication failed. Please try again.')
    }
  }

  const handleLoginLinkClick = () => {
    router.push('/login')
  }

  const getInputErrorClassName = (hasError: boolean) => {
    return hasError ? 'border-red-500 focus:border-red-500' : ''
  }

  const handleTermsAndConditionsClick = () => {
    // TODO: Navigate to terms page
    router.push('/terms-and-conditions')
  }

  const handlePrivacyPolicyClick = () => {
    // TODO: Navigate to privacy policy page
    router.push('/privacy-policy')
  }

  return (
    <div className='bg-primary flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-5xl'>
        <div className='flex flex-col gap-6'>
          <Card className='overflow-hidden border-none p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              <form
                onSubmit={handleSubmit(handleSignupFormSubmit)}
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

                  {/* Name Input Fields */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='grid gap-3'>
                      <Label htmlFor='firstName'>First Name *</Label>
                      <Input
                        id='firstName'
                        type='text'
                        placeholder='John'
                        className={getInputErrorClassName(
                          Boolean(errors.firstName),
                        )}
                        {...register('firstName', {
                          required: 'First name is required',
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters',
                          },
                        })}
                        aria-invalid={Boolean(errors.firstName)}
                        disabled={isSignupFormSubmitting}
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
                        className={getInputErrorClassName(
                          Boolean(errors.lastName),
                        )}
                        {...register('lastName', {
                          required: 'Last name is required',
                          minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters',
                          },
                        })}
                        aria-invalid={Boolean(errors.lastName)}
                        disabled={isSignupFormSubmitting}
                      />
                      {errors.lastName && (
                        <p className='text-sm text-red-600' role='alert'>
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Input Field */}
                  <div className='grid gap-3'>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='john.doe@example.com'
                      className={getInputErrorClassName(Boolean(errors.email))}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      aria-invalid={Boolean(errors.email)}
                      disabled={isSignupFormSubmitting}
                    />
                    {errors.email && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Input Field */}
                  <div className='grid gap-3'>
                    <Label htmlFor='password'>Password *</Label>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Create a strong password'
                      className={getInputErrorClassName(
                        Boolean(errors.password),
                      )}
                      {...register('password', {
                        required: 'Password is required',
                        validate: validatePasswordRequirements,
                      })}
                      aria-invalid={Boolean(errors.password)}
                      disabled={isSignupFormSubmitting}
                    />
                    {errors.password && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input Field */}
                  <div className='grid gap-3'>
                    <Label htmlFor='confirmPassword'>Confirm Password *</Label>
                    <Input
                      id='confirmPassword'
                      type='password'
                      placeholder='Confirm your password'
                      className={getInputErrorClassName(
                        Boolean(errors.confirmPassword),
                      )}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (confirmPasswordValue) =>
                          confirmPasswordValue === currentPasswordValue ||
                          'Passwords do not match',
                      })}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      disabled={isSignupFormSubmitting}
                    />
                    {errors.confirmPassword && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className='grid gap-3'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='agreeToTerms'
                        {...register('agreeToTerms', {
                          required:
                            'You must agree to the terms and conditions',
                        })}
                        disabled={isSignupFormSubmitting}
                      />
                      <Label
                        htmlFor='agreeToTerms'
                        className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        I agree to the{' '}
                        <button
                          type='button'
                          onClick={handleTermsAndConditionsClick}
                          className='text-blue-600 underline hover:text-blue-800'
                        >
                          Terms and Conditions
                        </button>{' '}
                        and{' '}
                        <button
                          type='button'
                          onClick={handlePrivacyPolicyClick}
                          className='text-blue-600 underline hover:text-blue-800'
                        >
                          Privacy Policy
                        </button>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className='text-sm text-red-600' role='alert'>
                        {errors.agreeToTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Newsletter Subscription Checkbox */}
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='subscribeToNewsletter'
                      {...register('subscribeToNewsletter')}
                      disabled={isSignupFormSubmitting}
                    />
                    <Label
                      htmlFor='subscribeToNewsletter'
                      className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {SIGNUP_PAGE_CONTENT.newsletterSubscriptionText}
                    </Label>
                  </div>

                  {/* Signup Submit Button */}
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isSignupFormSubmitting}
                  >
                    {isSignupFormSubmitting
                      ? 'Creating Account...'
                      : 'Create Account'}
                  </Button>

                  {/* Social Auth Divider */}
                  <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                    <span className='bg-card text-muted-foreground relative z-10 px-2'>
                      {SIGNUP_PAGE_CONTENT.socialAuthDividerText}
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
                        disabled={isSignupFormSubmitting}
                        aria-label={`Sign up with ${socialProvider.displayName}`}
                      >
                        <SocialIcon
                          network={socialProvider.network}
                          style={{ width: 38, height: 38 }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Login Link */}
                  <div className='text-center text-sm'>
                    {SIGNUP_PAGE_CONTENT.loginLinkText}{' '}
                    <button
                      type='button'
                      onClick={handleLoginLinkClick}
                      className='underline underline-offset-4 hover:text-blue-600'
                      disabled={isSignupFormSubmitting}
                    >
                      {SIGNUP_PAGE_CONTENT.loginButtonText}
                    </button>
                  </div>
                </div>
              </form>

              {/* Background Image Section */}
              <div className='relative hidden md:block'>
                <img
                  src={SIGNUP_PAGE_CONTENT.backgroundImageSrc}
                  alt={SIGNUP_PAGE_CONTENT.backgroundImageAlt}
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
