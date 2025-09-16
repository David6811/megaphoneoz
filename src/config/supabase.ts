import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ftwnxeaovmvrjowvkbwp.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_EyM_-N5n9ksU3oXmd9FyYQ_SStSy1d1'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)