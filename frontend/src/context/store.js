import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) throw new Error('Error de autenticación')
      
      const data = await response.json()
      localStorage.setItem('token', data.token)
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true,
        isLoading: false 
      })
      return true
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user })
}))

export const useClassStore = create((set) => ({
  classes: [],
  currentClass: null,
  isLoading: false,

  fetchClasses: async (token) => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      set({ classes: data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  setCurrentClass: (classData) => set({ currentClass: classData }),
  addClass: async (classData, token) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(classData)
      })
      const newClass = await response.json()
      set((state) => ({ classes: [...state.classes, newClass] }))
      return newClass
    } catch (error) {
      console.error('Error adding class:', error)
    }
  }
}))

export const useStudentStore = create((set) => ({
  students: [],
  isLoading: false,

  fetchStudents: async (classId, token) => {
    set({ isLoading: true })
    try {
      const response = await fetch(`/api/students?classId=${classId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      set({ students: data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  addStudent: async (student, classId, token) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...student, classId })
      })
      const newStudent = await response.json()
      set((state) => ({ students: [...state.students, newStudent] }))
      return newStudent
    } catch (error) {
      console.error('Error adding student:', error)
    }
  },

  updateStudent: async (id, updates, token) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      const updated = await response.json()
      set((state) => ({
        students: state.students.map(s => s.id === id ? updated : s)
      }))
    } catch (error) {
      console.error('Error updating student:', error)
    }
  },

  deleteStudent: async (id, token) => {
    try {
      await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      set((state) => ({
        students: state.students.filter(s => s.id !== id)
      }))
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }
}))

export const useAttendanceStore = create((set) => ({
  attendance: [],
  isLoading: false,

  fetchAttendance: async (classId, date, token) => {
    set({ isLoading: true })
    try {
      const response = await fetch(
        `/api/attendance?classId=${classId}&date=${date}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      set({ attendance: data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  checkIn: async (studentId, data, token) => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, ...data })
      })
      const record = await response.json()
      set((state) => ({ attendance: [...state.attendance, record] }))
      return record
    } catch (error) {
      console.error('Error checking in:', error)
    }
  },

  updateAttendance: async (id, updates, token) => {
    try {
      const response = await fetch(`/api/attendance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      const updated = await response.json()
      set((state) => ({
        attendance: state.attendance.map(a => a.id === id ? updated : a)
      }))
    } catch (error) {
      console.error('Error updating attendance:', error)
    }
  }
}))
