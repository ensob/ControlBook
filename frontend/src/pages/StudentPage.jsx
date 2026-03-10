import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useStudentStore } from '../context/store'
import { motion } from 'framer-motion'

export default function StudentPage() {
  const { classId } = useParams()
  const { token } = useAuthStore()
  const { students, fetchStudents, addStudent, updateStudent, deleteStudent } = useStudentStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    team: 'producción',
    notes: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (token && classId) fetchStudents(classId, token)
  }, [token, classId, fetchStudents])

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', team: 'producción', notes: '' })
    setEditingId(null)
  }

  const handleEdit = (student) => {
    setEditingId(student.id)
    setFormData({
      name: student.name,
      email: student.email,
      password: student.password || '',
      team: student.team,
      notes: student.notes
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.name) {
      if (editingId) {
        // Editar estudiante existente
        await updateStudent(editingId, formData, token)
      } else {
        // Crear nuevo estudiante
        await addStudent(formData, classId, token)
      }
      resetForm()
      setShowForm(false)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar estudiante?')) {
      deleteStudent(id, token)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <h1 className="text-4xl font-black text-gray-900">👥 Gestionar Estudiantes</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            ↩️ Volver
          </button>
          <button
            onClick={() => {
              if (editingId) {
                resetForm()
              } else {
                setShowForm(!showForm)
              }
            }}
            className="btn-primary"
          >
            {editingId ? '❌ Cancelar edición' : showForm ? '❌ Cancelar' : '➕ Nuevo'}
          </button>
        </div>
      </motion.div>

      {/* Add/Edit Student Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary-50 to-orange-50"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante'}
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
              />
              <input
                type="password"
                placeholder={editingId ? "Contraseña (opcional para editar)" : "Contraseña"}
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
              {editingId ? '💾 Guardar cambios' : '✅ Añadir Estudiante'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Students List */}
      <div className="grid grid-cols-1 gap-4">
        {students.map((student, idx) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`card hover:shadow-md transition-all ${editingId === student.id ? 'ring-2 ring-primary-500' : ''}`}
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

      {students.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <p className="text-5xl mb-4">👤</p>
          <p className="text-xl text-gray-600">No hay estudiantes aún</p>
        </motion.div>
      )}
    </div>
  )
}
