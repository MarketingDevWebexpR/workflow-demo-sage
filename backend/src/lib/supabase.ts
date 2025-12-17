import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = process.env.SUPABASE_URL || 'https://xbbxfajvxpypwaganupi.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseKey) {
  console.warn('Warning: SUPABASE_ANON_KEY is not set. Database operations will fail.')
}

/**
 * Client Supabase type-safe pour interagir avec la base de donnees
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

/**
 * Verifie la connexion a Supabase
 * @returns true si la connexion est etablie, false sinon
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('workflows').select('id').limit(1)
    if (error) {
      console.error('Supabase connection error:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('Supabase connection failed:', err)
    return false
  }
}
