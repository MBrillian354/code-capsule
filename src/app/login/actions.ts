"use server";

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { getUserByEmail } from '@/lib/dal'
import { redirect } from 'next/navigation'

const LoginSchema = z.object({
  email: z.email('Please enter a valid email.'),
  password: z.string().min(1, 'Password field must not be empty.'),
})

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const validatedFields = LoginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return 'Invalid credentials.'
    }

    const { email, password } = validatedFields.data
    const user = await getUserByEmail(email)
    
    if (!user) {
      return 'Invalid credentials.'
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordsMatch) {
      return 'Invalid credentials.'
    }

    await createSession(user.id)
  } catch (error) {
    console.error('Authentication error:', error)
    return 'Something went wrong.'
  }
  
  redirect('/dashboard')
}

export async function logout() {
  const { deleteSession } = await import('@/lib/session')
  await deleteSession()
  redirect('/login')
}
