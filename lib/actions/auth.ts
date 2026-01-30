// Authentication Server Actions
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword, createSession, destroySession } from '@/lib/auth';

// ==================== VALIDATION SCHEMAS ====================

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ==================== ACTION TYPES ====================

export interface AuthActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// ==================== SIGN UP ====================

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };
  
  // Validate input
  const validationResult = signUpSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    return {
      success: false,
      fieldErrors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  
  const { name, email, password } = validationResult.data;
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });
    
    // Create session
    await createSession(user.id, user.email, user.name);
    
    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: 'An error occurred during sign up. Please try again.',
    };
  }
}

// ==================== SIGN IN ====================

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };
  
  // Validate input
  const validationResult = signInSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    return {
      success: false,
      fieldErrors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  
  const { email, password } = validationResult.data;
  
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
    
    // Create session
    await createSession(user.id, user.email, user.name);
    
    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: 'An error occurred during sign in. Please try again.',
    };
  }
}

// ==================== SIGN OUT ====================

export async function signOut(): Promise<void> {
  await destroySession();
  redirect('/login');
}

// Alias for signOut (used by settings page)
export const logout = signOut;
