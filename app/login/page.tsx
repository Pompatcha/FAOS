import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { SocialIcon } from 'react-social-icons'

export default function LoginPage() {
  return (
    <div className='bg-primary flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl'>
        <div className='flex flex-col gap-6'>
          <Card className='overflow-hidden border-none p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              <form className='p-6 md:p-8'>
                <div className='flex flex-col gap-6'>
                  <div className='flex flex-col items-center text-center'>
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
                      Create your account to get started
                    </p>
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      required
                    />
                  </div>
                  <div className='grid gap-3'>
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                    </div>
                    <Input id='password' type='password' required />
                  </div>
                  <Button type='submit' className='w-full'>
                    Login
                  </Button>
                  <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                    <span className='bg-card text-muted-foreground relative z-10 px-2'>
                      Or continue with
                    </span>
                  </div>
                  <div className='flex justify-center gap-5'>
                    <SocialIcon
                      network='google'
                      style={{ width: 38, height: 38 }}
                    />
                    <SocialIcon
                      network='facebook'
                      style={{ width: 38, height: 38 }}
                    />
                  </div>
                  <div className='text-center text-sm'>
                    Don&apos;t have an account?{' '}
                    <a href='#' className='underline underline-offset-4'>
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
              <div className='relative hidden md:block'>
                <img
                  src='https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg'
                  alt='Image'
                  className='h-full w-full object-cover'
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
