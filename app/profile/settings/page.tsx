'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  Shield,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProfileData {
  full_name: string
  email: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { profile } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
  })

  const [originalData, setOriginalData] = useState<ProfileData>({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleEdit = () => {
    setOriginalData({ ...profileData })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setProfileData({ ...originalData })
    setIsEditing(false)
  }

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    console.log('Saving profile data:', profileData)
    setIsEditing(false)
    // Show success message
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    // Here you would typically make an API call to update the password
    console.log('Changing password')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setShowPasswordSection(false)
    // Show success message
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='container mx-auto max-w-4xl px-4'>
        {/* Header */}
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

        {/* Profile Information */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Personal Information
            </CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Profile Avatar */}
            <div className='flex items-center gap-4'>
              <div className='flex h-20 w-20 items-center justify-center rounded-full bg-[#e2b007] text-white'>
                <User className='h-10 w-10' />
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>
                  {profileData.full_name}
                </h3>
                <p className='text-sm text-gray-600'>
                  Member since January 2024
                </p>
                <Button variant='outline' size='sm' className='mt-2' disabled>
                  Change Photo
                </Button>
              </div>
            </div>

            <Separator />

            {/* Profile Fields */}
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <Label htmlFor='full_name'>Full Name</Label>
                  <Input
                    id='full_name'
                    value={profileData.full_name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='email'
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 pt-4'>
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  className='bg-[#dda700] text-white hover:bg-[#c4950a]'
                >
                  Edit Information
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className='bg-[#dda700] text-white hover:bg-[#c4950a]'
                  >
                    <Save className='mr-2 h-4 w-4' />
                    Save
                  </Button>
                  <Button variant='outline' onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Security
            </CardTitle>
            <CardDescription>
              Change your password and manage account security
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showPasswordSection ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='flex items-center gap-3'>
                    <Lock className='h-5 w-5 text-gray-600' />
                    <div>
                      <h4 className='font-medium'>Password</h4>
                      <p className='text-sm text-gray-600'>
                        Last changed: 30 days ago
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    onClick={() => setShowPasswordSection(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='currentPassword'>Current Password</Label>
                    <div className='relative'>
                      <Input
                        id='currentPassword'
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder='Enter current password'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-0 right-0 h-full px-3 py-2'
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <div className='relative'>
                      <Input
                        id='newPassword'
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder='Enter new password'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-0 right-0 h-full px-3 py-2'
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='confirmPassword'>
                      Confirm New Password
                    </Label>
                    <div className='relative'>
                      <Input
                        id='confirmPassword'
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder='Confirm new password'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-0 right-0 h-full px-3 py-2'
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <h4 className='mb-2 font-medium text-blue-900'>
                    Tips for a secure password:
                  </h4>
                  <ul className='space-y-1 text-sm text-blue-800'>
                    <li>• Use at least 8 characters</li>
                    <li>• Mix uppercase, lowercase, numbers, and symbols</li>
                    <li>• Avoid using personal information</li>
                  </ul>
                </div>

                <div className='flex gap-2 pt-4'>
                  <Button
                    onClick={handlePasswordChange}
                    className='bg-[#dda700] text-white hover:bg-[#c4950a]'
                    disabled={
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                  >
                    Change Password
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setShowPasswordSection(false)
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className='text-red-600'>Account Actions</CardTitle>
            <CardDescription>These actions cannot be undone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4'>
                <div>
                  <h4 className='font-medium text-red-900'>Delete Account</h4>
                  <p className='text-sm text-red-700'>
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant='destructive' disabled>
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
