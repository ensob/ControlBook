import { useEffect, useState } from 'react'
import { useAuthStore, useClassStore } from '../context/store'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function DashboardPage() {
  const { token } = useAuthStore()
  const { classes, fetchClasses } = useClassStore()
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    todayAttendance: 0,
    absentToday: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    if (token) {
      fetchClasses(token)
      fetchStats()
    }
  }, [token, fetchClasses])

  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-black gradient-orange bg-clip-text text-transparent mb-2">
          🎓 ControlBook Dashboard
        </h1>
        <p className="text-gray-600 text-lg capitalize">{today}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: '📚',
            label: 'Áreas Activas',
            value: stats.totalClasses,
            color: 'bg-blue-50 border-blue-200'
          },
          {
            icon: '👥',
            label: 'Total Estudiantes',
            value: stats.totalStudents,
            color: 'bg-green-50 border-green-200'
          },
          {
            icon: '✅',
            label: 'Presentes Hoy',
            value: stats.todayAttendance,
            color: 'bg-primary-50 border-primary-200'
          },
          {
            icon: '❌',
            label: 'Ausentes Hoy',
            value: stats.absentToday,
            color: 'bg-red-50 border-red-200'
          }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`card border-2 ${stat.color}`}
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-primary-600">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Classes Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      >
        {classes.length > 0 ? (
          classes.map((cls, idx) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="card hover:shadow-lg cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.description}</p>
                </div>
                <div className="text-3xl">{cls.emoji || '📚'}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Estudiantes</p>
                  <p className="text-2xl font-bold text-primary-600">{cls.studentCount || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Horario</p>
                  <p className="text-sm font-semibold text-gray-900">{cls.time || 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <p className="text-3xl mb-4">📭</p>
            <p className="text-gray-600">No hay áreas aún. ¡Crea una para comenzar!</p>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card gradient-orange text-white text-center py-8"
      >
        <h2 className="text-2xl font-bold mb-4">⚡ Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/classes" className="bg-white text-primary-600 px-6 py-2 rounded-lg font-bold hover:bg-orange-100 transition-all">
            ➕ Gestionar Áreas
          </a>
          <a href="/reports" className="bg-white/20 px-6 py-2 rounded-lg font-bold hover:bg-white/30 transition-all">
            📊 Ver Reportes
          </a>
        </div>
      </motion.div>
    </div>
  )
}
