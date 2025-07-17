import { createClient } from '@supabase/supabase-js'

// ✅ Replace these with your actual values from Supabase dashboard
const supabaseUrl = 'https://umhtxjqvzqxttnypevxc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaHR4anF2enF4dHRueXBldnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NTkwOTgsImV4cCI6MjA2ODMzNTA5OH0.j3VW2Y8XNn_hOt03NOVosPlWp02ZvRBGITyMqzaoyDk'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
