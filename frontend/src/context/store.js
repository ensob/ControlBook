import { create } from 'zustand'
import { supabase } from '../supabase' // Importamos el cerebro que creamos

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    console.log("intentando login con Supabase...");
    set({ isLoading: true, error: null })
    try {
      // USAMOS SUPABASE EN LUGAR DE FETCH
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      set({ 
        user: data.user, 
        session: data.session,
        isAuthenticated: true,
        isLoading: false 
      })
      return true
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return false
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user, isAuthenticated: !!user })
}))

// TIENDA DE CLASES (EQUIPOS)
export const useClassStore = create((set) => ({
  classes: [],
  currentClass: null,
  isLoading: false,

  fetchClasses: async () => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('equipos') // Nombre de tu tabla en Supabase
        .select('*')
      
      if (error) throw error
      set({ classes: data, isLoading: false })
    } catch (error) {
      console.error('Error fetching classes:', error)
      set({ isLoading: false })
    }
  },

  setCurrentClass: (classData) => set({ currentClass: classData }),
}))

// TIENDA DE ASISTENCIA
export const useAttendanceStore = create((set) => ({
  attendance: [],
  isLoading: false,

  checkIn: async (fichajeData) => {
    try {
      const { data, error } = await supabase
        .from('fichajes')
        .insert([fichajeData])
        .select()
      
      if (error) throw error
      set((state) => ({ attendance: [...state.attendance, data[0]] }))
      return data[0]
    } catch (error) {
      console.error('Error in checkIn:', error)
      return null
    }
  },

  fetchAttendance: async (date) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('fichajes')
        .select('*')
        .eq('fecha', date)
      
      if (error) throw error
      set({ attendance: data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  }
}))

