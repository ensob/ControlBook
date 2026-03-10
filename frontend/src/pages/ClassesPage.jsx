import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../context/store'
import { motion } from 'framer-motion'

export default function ClassesPage() {
  const { token } = useAuthStore()
  const [areas, setAreas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎬'
  })

  const emojis = ['🎬', '🎥', '🎵', '📋', '🎨', '🎭', '🎪', '🎸', '🎤', '📸', '🎞️', '🎹']

  const fetchAreas = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/areas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAreas(data)
      }
    } catch (error) {
      console.error('Error fetching areas:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchAreas()
  }, [fetchAreas])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      const method = editingId ? 'PUT' : 'POST'
      const endpoint = editingId ? `${import.meta.env.VITE_API_URL}/areas/${editingId}` : `${import.meta.env.VITE_API_URL}/areas`

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        resetForm()
        fetchAreas()
      }
    } catch (error) {
      console.error('Error saving area:', error)
    }
  }

  const handleEdit = (area) => {
    setFormData({ name: area.name, emoji: area.emoji })
    setEditingId(area.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta área?')) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/areas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        fetchAreas()
      }
    } catch (error) {
      console.error('Error deleting area:', error)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', emoji: '🎬' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-black text-gray-900">🎭 Gestionar Áreas</h1>
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
          {showForm ? '❌ Cancelar' : '➕ Nueva Área'}
        </button>
      </motion.div>

      {/* Add/Edit Area Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary-50 to-orange-50"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre de la área (ej: Producción)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <div className="grid grid-cols-4 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, emoji })}
                    className={`p-2 rounded text-2xl transition-all ${
                      formData.emoji === emoji
                        ? 'bg-orange-500 scale-110'
                        : 'bg-white hover:bg-orange-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full text-lg">
              🚀 {editingId ? 'Actualizar Área' : 'Crear Área'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Areas Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Cargando áreas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, idx) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="card hover:shadow-xl transition-all group"
            >
              <div className="text-6xl mb-3 inline-block">{area.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{area.name}</h3>
              <p className="text-gray-600 text-sm mb-4">Área de especialidad</p>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(area)}
                  className="flex-1 btn-primary text-sm"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(area.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {areas.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <p className="text-5xl mb-4">🎭</p>
          <p className="text-xl text-gray-600 mb-4">No hay áreas aún</p>
          <p className="text-gray-500">¡Crea tu primera área para empezar!</p>
        </motion.div>
      )}
    </div>
  )
}
