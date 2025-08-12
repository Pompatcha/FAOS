'use server'

import { createClient } from '@/utils/supabase/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const customerProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
})

export type CustomerProfileData = z.infer<typeof customerProfileSchema>

const getCustomerProfile = async (userId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching customer profile:', error)
    throw new Error('Failed to fetch customer profile')
  }

  return data
}

const updateCustomerProfile = async (
  userId: string,
  formData: CustomerProfileData,
) => {
  const supabase = createClient()

  const validatedFields = customerProfileSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { data, error } = await supabase
    .from('customers')
    .update(validatedFields.data)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating customer profile:', error)
    return {
      error: 'Failed to update customer profile',
      details: error.message,
    }
  }

  revalidatePath('/profile')
  return { data, success: true }
}

export { updateCustomerProfile, getCustomerProfile }
