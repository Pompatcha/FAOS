'use client'

import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { SocialIcon } from 'react-social-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  LogOut,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authService } from '@/app/actions/auth'
import { useAuth } from '@/contexts/AuthContext'

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

interface ExtendedProfile {
  avatar_url?: string | null
  full_name?: string | null
  role?: string | null
}

const AuthPanel: FC = () => {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string>('')
  const [authSuccess, setAuthSuccess] = useState<string>('')

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

  const clearMessages = () => {
    setAuthError('')
    setAuthSuccess('')
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      setAuthSuccess('ออกจากระบบสำเร็จ!')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      setAuthError('เกิดข้อผิดพลาดในการออกจากระบบ')
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='mx-auto flex h-fit w-full max-w-md flex-col gap-6 rounded-lg bg-white/20 p-6 backdrop-blur-sm'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-white'></div>
          <p className='text-white'>Loading...</p>
        </div>
      </div>
    )
  }

  if (user && profile) {
    const extendedProfile = profile as ExtendedProfile

    return (
      <div className='mx-auto flex h-fit w-full max-w-md flex-col gap-6 rounded-lg bg-white/20 p-6 backdrop-blur-sm'>
        <div className='text-center'>
          {extendedProfile?.avatar_url ? (
            <img
              src={extendedProfile.avatar_url}
              className='mx-auto mb-4 size-20 rounded-full bg-white/20'
            />
          ) : (
            <div className='mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-white/20'>
              <User className='h-8 w-8 text-white/60' />
            </div>
          )}

          <h2 className='mb-1 text-xl font-semibold text-white'>
            Welcome Back!
          </h2>
          <p className='text-sm text-white/70'>
            You are successfully logged in
          </p>
        </div>

        {authError && (
          <Alert className='border-red-500/50 bg-red-500/10 text-white'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {authSuccess && (
          <Alert className='border-green-500/50 bg-green-500/10 text-white'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{authSuccess}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-4 rounded-lg bg-white/10 p-4'>
          <h3 className='text-lg font-medium text-white'>
            Profile Information
          </h3>

          <div className='space-y-3'>
            <div>
              <Label className='text-sm font-medium text-white/70'>Email</Label>
              <p className='text-white'>{user.email}</p>
            </div>

            {extendedProfile.full_name && (
              <div>
                <Label className='text-sm font-medium text-white/70'>
                  Full Name
                </Label>
                <p className='text-white'>{extendedProfile.full_name}</p>
              </div>
            )}

            <div>
              <Label className='text-sm font-medium text-white/70'>
                Member Since
              </Label>
              <p className='text-white'>
                {new Date(user.created_at).toLocaleDateString('en', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {user.email_confirmed_at && (
              <div>
                <Label className='text-sm font-medium text-white/70'>
                  Email Status
                </Label>
                <p className='text-green-300'>✓ Verified</p>
              </div>
            )}
          </div>
        </div>

        <div className='space-y-3'>
          <Button
            onClick={() => router.push('/dashboard')}
            className='w-full border border-white/20 bg-white/20 text-white hover:bg-white/30'
          >
            Go to Dashboard
          </Button>

          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant='outline'
            className='w-full border-red-300/50 bg-red-500/20 text-white hover:bg-red-500/30 disabled:opacity-50'
          >
            <LogOut className='mr-2 h-4 w-4' />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>

        <div className='text-center text-xs text-white/50'>
          FAOS Co.,Ltd. • Secure Authentication
        </div>
      </div>
    )
  }

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true)
    clearMessages()

    try {
      const result = await authService.signIn({
        email: data.email,
        password: data.password,
      })

      if (result.success) {
        setAuthSuccess('เข้าสู่ระบบสำเร็จ!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setAuthError(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    } catch (error) {
      setAuthError('เกิดข้อผิดพลาดที่ไม่คาดคิด')
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUp = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      signUpForm.setError('confirmPassword', {
        type: 'manual',
        message: 'รหัสผ่านไม่ตรงกัน',
      })
      return
    }

    setIsLoading(true)
    clearMessages()

    try {
      const result = await authService.signUp({
        email: data.email,
        password: data.password,
        fullName: data.name,
      })

      if (result.success) {
        setAuthSuccess('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี')
        setTimeout(() => {
          setAuthMode('signin')
          signUpForm.reset()
        }, 3000)
      } else {
        setAuthError(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
      }
    } catch (error) {
      setAuthError('เกิดข้อผิดพลาดที่ไม่คาดคิด')
      console.error('Sign up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    clearMessages()

    try {
      let result
      if (provider === 'google') {
        result = await authService.signInWithGoogle()
      } else {
        result = await authService.signInWithFacebook()
      }

      if (!result.success && result.error) {
        setAuthError(result.error)
      }
    } catch (error) {
      setAuthError('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Social Media')
      console.error('Social login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const email = signInForm.getValues('email')
    if (!email) {
      setAuthError('กรุณากรอกอีเมลก่อนขอรีเซ็ตรหัสผ่าน')
      return
    }

    setIsLoading(true)
    clearMessages()

    try {
      const result = await authService.resetPassword(email)
      if (result.success) {
        setAuthSuccess('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว')
      } else {
        setAuthError(
          result.error || 'เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน',
        )
      }
    } catch (error) {
      setAuthError('เกิดข้อผิดพลาดที่ไม่คาดคิด')
      console.error('Reset password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
    signInForm.reset()
    signUpForm.reset()
    setShowPassword(false)
    setShowConfirmPassword(false)
    clearMessages()
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

      {authError && (
        <Alert className='border-red-500/50 bg-red-500/10 text-white'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      {authSuccess && (
        <Alert className='border-green-500/50 bg-green-500/10 text-white'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{authSuccess}</AlertDescription>
        </Alert>
      )}

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
                onClick={handleForgotPassword}
                disabled={isLoading}
                className='text-sm text-white/70 transition-colors hover:text-white disabled:opacity-50'
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
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className='w-full border-white/20 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50'
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
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
          className='w-full border-white/20 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50'
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
              disabled={isLoading}
              className='font-medium text-white hover:underline disabled:opacity-50'
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
              disabled={isLoading}
              className='font-medium text-white hover:underline disabled:opacity-50'
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
