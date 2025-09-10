"use server";

import { SignupSchema } from '@/lib/validators';
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { getUserByEmail, createUser } from '@server/queries'
import { redirect } from 'next/navigation'

export async function createAccount(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const validatedFields = SignupSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    if (!validatedFields.success) {
      const errors = validatedFields.error.issues
      return errors[0]?.message || 'Invalid input.'
    }

    const { name, email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return 'An account with this email already exists.'
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = await createUser(name, email, hashedPassword)

    // Create session (auto-login)
    await createSession(userId)
  } catch (error) {
    console.error('Account creation error:', error)
    return 'Something went wrong. Please try again.'
  }
  
  redirect('/dashboard')
}
