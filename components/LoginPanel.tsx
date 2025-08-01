'use client'

import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SocialIcon } from 'react-social-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type AuthMode = 'signin' | 'signup'

interface SignInFormData {
  email: string
  password: string
  rememberMe?: boolean
}

interface SignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

const AuthPanel: FC = () => {
  const supabase = createClient()
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const signInForm = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  })

  const signUpForm = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    mode: 'onChange',
  })

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Sign in data:', data)
    setIsLoading(false)
  }

  const onSignUp = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      signUpForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Sign up data:', data)
    setIsLoading(false)
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  const switchAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
    signInForm.reset()
    signUpForm.reset()
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleSubmit = () => {
    if (authMode === 'signin') {
      signInForm.handleSubmit(onSignIn)()
    } else {
      signUpForm.handleSubmit(onSignUp)()
    }
  }

  const isFormValid =
    authMode === 'signin'
      ? signInForm.formState.isValid
      : signUpForm.formState.isValid

  const getEmailError = () => {
    if (authMode === 'signin') {
      return signInForm.formState.errors.email?.message
    }
    return signUpForm.formState.errors.email?.message
  }

  const getPasswordError = () => {
    if (authMode === 'signin') {
      return signInForm.formState.errors.password?.message
    }
    return signUpForm.formState.errors.password?.message
  }

  return (
    <div className='mx-auto flex h-fit w-full max-w-md flex-col gap-6 rounded-lg bg-white/20 p-6 backdrop-blur-sm'>
      <div className='text-center'>
        <h2 className='mb-1 text-xl font-semibold text-white'>
          {authMode === 'signin'
            ? 'Login to FAOS Co.,Ltd.'
            : 'Join FAOS Co.,Ltd.'}
        </h2>
        <p className='text-sm text-white/70'>
          {authMode === 'signin'
            ? 'Welcome back! Please sign in to your account'
            : 'Create your account to get started'}
        </p>
      </div>

      <div className='space-y-4'>
        {authMode === 'signup' && (
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-sm font-medium text-white'>
              Full Name
            </Label>
            <div className='relative'>
              <User className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-white/60' />
              <Input
                id='name'
                type='text'
                placeholder='Enter your full name'
                {...signUpForm.register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className='border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20'
              />
            </div>
            {signUpForm.formState.errors.name && (
              <p className='text-xs text-red-300'>
                {signUpForm.formState.errors.name.message}
              </p>
            )}
          </div>
        )}

        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium text-white'>
            Email
          </Label>
          <div className='relative'>
            <Mail className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-white/60' />
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              {...(authMode === 'signin'
                ? signInForm.register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })
                : signUpForm.register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }))}
              className='border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20'
            />
          </div>
          {getEmailError() && (
            <p className='text-xs text-red-300'>{getEmailError()}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password' className='text-sm font-medium text-white'>
            Password
          </Label>
          <div className='relative'>
            <Lock className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-white/60' />
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              {...(authMode === 'signin'
                ? signInForm.register('password', {
                    required: 'Password is required',
                  })
                : signUpForm.register('password', {
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
                  }))}
              className='border-white/20 bg-white/10 pr-10 pl-10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute top-1/2 right-3 -translate-y-1/2 transform text-white/60 transition-colors hover:text-white'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
          {getPasswordError() && (
            <p className='text-xs text-red-300'>{getPasswordError()}</p>
          )}
        </div>

        {authMode === 'signup' && (
          <div className='space-y-2'>
            <Label
              htmlFor='confirmPassword'
              className='text-sm font-medium text-white'
            >
              Confirm Password
            </Label>
            <div className='relative'>
              <Lock className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-white/60' />
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm your password'
                {...signUpForm.register('confirmPassword', {
                  required: 'Please confirm your password',
                })}
                className='border-white/20 bg-white/10 pr-10 pl-10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute top-1/2 right-3 -translate-y-1/2 transform text-white/60 transition-colors hover:text-white'
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {signUpForm.formState.errors.confirmPassword && (
              <p className='text-xs text-red-300'>
                {signUpForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <div className='flex items-center justify-between'>
          {authMode === 'signin' ? (
            <>
              <label className='flex items-center space-x-2 text-sm text-white/70'>
                <input
                  type='checkbox'
                  {...signInForm.register('rememberMe')}
                  className='rounded border-white/20 bg-white/10 text-white focus:ring-white/20'
                />
                <span>Remember me</span>
              </label>
              <button
                type='button'
                className='text-sm text-white/70 transition-colors hover:text-white'
              >
                Forgot password?
              </button>
            </>
          ) : (
            <label className='flex items-start space-x-2 text-sm text-white/70'>
              <input
                type='checkbox'
                {...signUpForm.register('agreeTerms', {
                  required: 'You must agree to the terms and conditions',
                })}
                className='mt-0.5 rounded border-white/20 bg-white/10 text-white focus:ring-white/20'
              />
              <span>
                I agree to the{' '}
                <button type='button' className='text-white hover:underline'>
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type='button' className='text-white hover:underline'>
                  Privacy Policy
                </button>
              </span>
            </label>
          )}
        </div>

        {authMode === 'signup' && signUpForm.formState.errors.agreeTerms && (
          <p className='text-xs text-red-300'>
            {signUpForm.formState.errors.agreeTerms.message}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          className='w-full border border-white/20 bg-white/20 text-white hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading
            ? authMode === 'signin'
              ? 'Signing in...'
              : 'Creating account...'
            : authMode === 'signin'
              ? 'Sign In'
              : 'Create Account'}
        </Button>
      </div>

      <div className='relative'>
        <Separator className='bg-white/20' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='bg-transparent px-2 text-xs text-white/70'>
            OR CONTINUE WITH
          </span>
        </div>
      </div>

      <div className='space-y-3'>
        <Button
          type='button'
          variant='outline'
          onClick={() => handleSocialLogin('Google')}
          className='w-full border-white/20 bg-white/10 text-white hover:bg-white/20'
        >
          <SocialIcon
            network='google'
            style={{ width: 20, height: 20 }}
            className='mr-2'
          />
          {authMode === 'signin' ? 'Sign in' : 'Sign up'} with Google
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={() => handleSocialLogin('Facebook')}
          className='w-full border-white/20 bg-white/10 text-white hover:bg-white/20'
        >
          <SocialIcon
            network='facebook'
            style={{ width: 20, height: 20 }}
            className='mr-2'
          />
          {authMode === 'signin' ? 'Sign in' : 'Sign up'} with Facebook
        </Button>
      </div>

      <div className='text-center text-sm text-white/70'>
        {authMode === 'signin' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type='button'
              onClick={switchAuthMode}
              className='font-medium text-white hover:underline'
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type='button'
              onClick={switchAuthMode}
              className='font-medium text-white hover:underline'
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export { AuthPanel }
