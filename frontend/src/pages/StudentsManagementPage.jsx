import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../context/store'
import { motion } from 'framer-motion'

export default function StudentsManagementPage() {
  const { token } = useAuthStore()
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTeam, setFilterTeam] = useState('todos')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    team: 'producción',
    notes: ''
  })

  const teams = [
    { value: 'todos', label: '👥 Todos', icon: '👥' },
    { value: 'producción', label: '🎬 Producción', icon: '🎬' },
    { value: 'realización', label: '🎥 Realización', icon: '🎥' },
    { value: 'dj', label: '🎵 DJ', icon: '🎵' }
  ]

  const fetchStudents = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) return

    try {
      const method = editingId ? 'PUT' : 'POST'
      const endpoint = editingId ? `${import.meta.env.VITE_API_URL}/students/${editingId}` : `${import.meta.env.VITE_API_URL}/students`

      // Crear payload sin classId para ruta global
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        team: formData.team,
        notes: formData.notes
      }
      
      // Solo agregar classId si no es POST global (solo para compatibilidad)
      if (method === 'POST') {
        payload.classId = null // Permite alumnos sin clase asignada
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        resetForm()
        fetchStudents()
      }
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      team: student.team,
      notes: student.notes
    })
    setEditingId(student.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este alumno?')) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      team: 'producción',
      notes: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTeam = filterTeam === 'todos' || student.team === filterTeam
    return matchSearch && matchTeam
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <h1 className="text-4xl font-black text-gray-900">👨‍🎓 Gestionar Alumnos</h1>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false)
            } else {
              resetForm()
              setShowForm(true)
            }
          }}
          className="btn-primary text-lg"
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Alumno'}
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm font-semibold text-blue-600 mb-1">Total de Alumnos</p>
          <p className="text-3xl font-black text-blue-700">{students.length}</p>
        </div>
        {teams.slice(1).map((team) => (
          <div key={team.value} className="card bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm font-semibold text-orange-600 mb-1">{team.icon} {team.label.split(' ')[1]}</p>
            <p className="text-3xl font-black text-orange-700">
              {students.filter((s) => s.team === team.value).length}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary-50 to-orange-50"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? '✏️ Editar Alumno' : '➕ Nuevo Alumno'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder={editingId ? 'Contraseña (opcional)' : 'Contraseña'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required={!editingId}
              />
              <select
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="input-field"
              >
                <option value="producción">🎬 Producción</option>
                <option value="realización">🎥 Realización</option>
                <option value="dj">🎵 DJ</option>
              </select>
            </div>
            <textarea
              placeholder="Notas (opcional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field h-20"
            />
            <button type="submit" className="btn-primary w-full">
              {editingId ? '💾 Guardar cambios' : '✅ Añadir Alumno'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 input-field"
        />
        <div className="flex gap-2 flex-wrap">
          {teams.map((team) => (
            <button
              key={team.value}
              onClick={() => setFilterTeam(team.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterTeam === team.value
                  ? 'btn-primary'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-500'
              }`}
            >
              {team.icon} {team.label.split(' ')[1] || 'Todos'}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table / Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Cargando alumnos...</p>
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="space-y-4">
          {filteredStudents.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`card hover:shadow-md transition-all ${
                editingId === student.id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block px-2 py-1 rounded bg-primary-100 text-primary-700 text-xs font-semibold">
                      {student.team === 'producción' && '🎬 Producción'}
                      {student.team === 'realización' && '🎥 Realización'}
                      {student.team === 'dj' && '🎵 DJ'}
                    </span>
                  </div>
                  {student.notes && (
                    <p className="text-xs text-gray-600 mt-2">📝 {student.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="btn-secondary text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <p className="text-5xl mb-4">👨‍🎓</p>
          <p className="text-xl text-gray-600">
            {searchTerm || filterTeam !== 'todos' ? 'No hay alumnos con esos criterios' : 'No hay alumnos aún'}
          </p>
          {!searchTerm && filterTeam === 'todos' && (
            <p className="text-gray-500">¡Crea tu primer alumno para empezar!</p>
          )}
        </motion.div>
      )}

      {/* Summary */}
      {filteredStudents.length > 0 && (
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50">
          <p className="text-center">
            <span className="font-bold text-green-700">
              📊 Mostrando {filteredStudents.length} de {students.length} alumnos
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
