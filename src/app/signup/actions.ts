"use server";

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { getUserByEmail, createUser } from '@/lib/dal'
import { redirect } from 'next/navigation'

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"]
});

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
