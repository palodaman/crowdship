import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ncspqzlhesozlnlwdufm.supabase.com'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jc3BxemxoZXNvemxubHdkdWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2NDk2MjYsImV4cCI6MjA0MzIyNTYyNn0.rDjUBAEAXGqpdgW51gpdu1C6jT8Joe93kzKqEei4xe8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})