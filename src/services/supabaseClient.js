// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

console.log("SUPABASE URL CARGADA:", import.meta.env.VITE_SUPABASE_URL)
console.log("SUPABASE ANON KEY CARGADA:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "SÍ" : "NO")

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("FALTAN VARIABLES DE ENTORNO. REVISA .env")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// LOG PARA VER SI EL USUARIO ESTÁ LOGUEADO
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log("SESION ACTUAL:", session ? "LOGUEADO" : "NO LOGUEADO")
  if (session) {
    console.log("USUARIO:", session.user.email)
    console.log("TOKEN JWT:", session.access_token ? "SÍ" : "NO")
  }
})