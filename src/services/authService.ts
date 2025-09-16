import { supabase } from './supabaseConfig'
import { User } from '@supabase/supabase-js'

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  error?: any
}

export interface SignUpData {
  email: string
  password: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName || '',
          },
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          error
        }
      }

      return {
        success: true,
        message: 'Account created successfully. Please check your email for verification.',
        user: authData.user || undefined
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'An unexpected error occurred during sign up',
        error
      }
    }
  }

  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          error
        }
      }

      return {
        success: true,
        message: 'Signed in successfully',
        user: authData.user || undefined
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'An unexpected error occurred during sign in',
        error
      }
    }
  }

  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          success: false,
          message: error.message,
          error
        }
      }

      return {
        success: true,
        message: 'Signed out successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'An unexpected error occurred during sign out',
        error
      }
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  }
}