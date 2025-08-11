'use client'

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  ArrowLeft,
  Save,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'
import { Footer } from '@/components/Layout/Footer'
import {
  CustomerProfileData,
  getCustomerProfile,
  updateCustomerProfile,
} from '@/actions/customers'
import { formatDate } from '@/lib/date'
import { Loading } from '@/components/Layout/Loading'

const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(255, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const countries = ['Thailand', 'United States', 'Japan']

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: async () => {
      return getCustomerProfile(user!.id)
    },
    enabled: !!user,
  })

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
    watch: watchProfile,
    setValue: setValueProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      notes: '',
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: CustomerProfileData) =>
      updateCustomerProfile(user!.id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['customer-profile'] })
        alert('Profile updated successfully!')
      } else {
        alert(result.error || 'Failed to update profile')
      }
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    },
  })

  useEffect(() => {
    if (profile) {
      resetProfile({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        notes: profile.notes || '',
      })
    }
  }, [profile, resetProfile])

  const onProfileSubmit: SubmitHandler<ProfileFormData> = (data) => {
    updateProfileMutation.mutate(data)
  }

  if (profileLoading) {
    return <Loading />
  }

  return (
    <div className='flex min-h-screen flex-col items-center bg-[#fff9df]'>
      <Header />
      <Menu />

      <div className='w-full p-5'>
        <div className='min-h-screen py-6'>
          <div className='container mx-auto max-w-4xl px-4'>
            <div className='mb-6'>
              <div className='mb-4 flex items-center gap-3'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => router.back()}
                  className='p-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    Profile Settings
                  </h1>
                  <p className='text-gray-600'>
                    Manage your personal information and account settings
                  </p>
                </div>
              </div>
            </div>

            <Card className='mb-6'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Personal Information
                </CardTitle>
                <CardDescription>Manage your personal details</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-20 w-20 items-center justify-center rounded-full bg-[#e2b007] text-white'>
                    {profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt='Profile'
                        className='h-full w-full rounded-full object-cover'
                      />
                    ) : (
                      <User className='h-10 w-10' />
                    )}
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-900'>
                      {watchProfile('full_name') || 'No Name'}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Member since{' '}
                      {profile?.created_at
                        ? formatDate(profile.created_at)
                        : 'Unknown'}
                    </p>
                    <Button
                      variant='outline'
                      size='sm'
                      className='mt-2'
                      disabled
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>

                <Separator />

                <form
                  onSubmit={handleSubmitProfile(onProfileSubmit)}
                  className='space-y-4'
                >
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='full_name'>Full Name</Label>
                      <Input
                        id='full_name'
                        {...registerProfile('full_name')}
                        disabled={updateProfileMutation.isPending}
                      />
                      {profileErrors.full_name && (
                        <p className='text-sm text-red-500'>
                          {profileErrors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='relative'>
                        <Mail className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                        <Input
                          id='email'
                          type='email'
                          {...registerProfile('email')}
                          disabled={updateProfileMutation.isPending}
                          className='pl-10'
                        />
                      </div>
                      {profileErrors.email && (
                        <p className='text-sm text-red-500'>
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <div className='relative'>
                      <Phone className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                      <Input
                        id='phone'
                        type='tel'
                        {...registerProfile('phone')}
                        disabled={updateProfileMutation.isPending}
                        className='pl-10'
                        placeholder='Optional'
                      />
                    </div>
                    {profileErrors.phone && (
                      <p className='text-sm text-red-500'>
                        {profileErrors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='address'>Address</Label>
                    <div className='relative'>
                      <MapPin className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                      <Textarea
                        id='address'
                        {...registerProfile('address')}
                        disabled={updateProfileMutation.isPending}
                        className='min-h-[80px] pl-10'
                        placeholder='Optional'
                      />
                    </div>
                    {profileErrors.address && (
                      <p className='text-sm text-red-500'>
                        {profileErrors.address.message}
                      </p>
                    )}
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='city'>City</Label>
                      <Input
                        id='city'
                        {...registerProfile('city')}
                        disabled={updateProfileMutation.isPending}
                        placeholder='Optional'
                      />
                      {profileErrors.city && (
                        <p className='text-sm text-red-500'>
                          {profileErrors.city.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='country'>Country</Label>
                      <Select
                        onValueChange={(value) =>
                          setValueProfile('country', value)
                        }
                        defaultValue={watchProfile('country')}
                        disabled={updateProfileMutation.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select country (optional)' />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {profileErrors.country && (
                        <p className='text-sm text-red-500'>
                          {profileErrors.country.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='notes'>Notes</Label>
                    <div className='relative'>
                      <FileText className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                      <Textarea
                        id='notes'
                        {...registerProfile('notes')}
                        disabled={updateProfileMutation.isPending}
                        className='min-h-[100px] pl-10'
                        placeholder='Optional notes or additional information'
                      />
                    </div>
                    {profileErrors.notes && (
                      <p className='text-sm text-red-500'>
                        {profileErrors.notes.message}
                      </p>
                    )}
                  </div>

                  <div className='flex gap-2 pt-4'>
                    <Button
                      type='submit'
                      disabled={updateProfileMutation.isPending}
                      className='bg-[#dda700] text-white hover:bg-[#c4950a]'
                    >
                      <Save className='mr-2 h-4 w-4' />
                      {updateProfileMutation.isPending
                        ? 'Saving...'
                        : 'Save Profile'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer className='mt-5 text-black' />
      </div>
    </div>
  )
}
