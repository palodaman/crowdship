import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://ncspqzlhesozlnlwdufm.supabase.com'
const supabaseUrl = 'https://yxclwdhrzlymytvaqcqn.supabase.co'
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jc3BxemxoZXNvemxubHdkdWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2NDk2MjYsImV4cCI6MjA0MzIyNTYyNn0.rDjUBAEAXGqpdgW51gpdu1C6jT8Joe93kzKqEei4xe8'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Y2x3ZGhyemx5bXl0dmFxY3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2NTk0MjAsImV4cCI6MjA0MzIzNTQyMH0.JeYFFVFAI4Zza5BIb4wt2HKOBTnLrztQJ15AM_x8BCc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})