import { createClient } from '@supabase/supabase-js'

// Usamos el operador lógico || para asegurar que siempre haya un string aunque sea vacío
// y evitar el error de "undefined" en tiempo de compilación
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || ''
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Configuración de Supabase incompleta. Revisa las variables de entorno.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
