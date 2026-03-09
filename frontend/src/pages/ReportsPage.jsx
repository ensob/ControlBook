import { useEffect, useState } from 'react'
import { useAuthStore, useClassStore } from '../context/store'
import { motion } from 'framer-motion'

export default function ReportsPage() {
  const { token } = useAuthStore()
  const { classes } = useClassStore()
  const [selectedClass, setSelectedClass] = useState(null)
  const [reportData, setReportData] = useState({
    totalDays: 0,
    averageAttendance: 0,
    studentStats: []
  })
  const [fromDate, setFromDate] = useState('2026-01-01')
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (selectedClass && token) {
      fetchReport(selectedClass.id)
    }
  }, [selectedClass, token, fromDate, toDate])

  const fetchReport = async (classId) => {
    try {
      const response = await fetch(
        `/api/reports?classId=${classId}&from=${fromDate}&to=${toDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error('Error fetching report:', error)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-gray-900 mb-6">📊 Reportes y Estadísticas</h1>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedClass?.id || ''}
            onChange={(e) => {
              const selected = classes.find(c => c.id === e.target.value)
              setSelectedClass(selected)
            }}
            className="input-field"
          >
            <option value="">Selecciona una clase</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.emoji} {cls.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="input-field"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="input-field"
          />
        </div>
      </motion.div>

      {selectedClass && (
        <>
          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: '📅', label: 'Días Registrados', value: reportData.totalDays },
              { icon: '📈', label: 'Asistencia Promedio', value: `${reportData.averageAttendance.toFixed(1)}%` },
              { icon: '👥', label: 'Total Estudiantes', value: reportData.studentStats.length }
            ].map((stat, idx) => (
              <div key={idx} className="card text-center">
                <p className="text-4xl mb-2">{stat.icon}</p>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-black gradient-orange bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Student Stats Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card overflow-x-auto"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">📋 Estadísticas por Estudiante</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-orange text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Equipo</th>
                    <th className="px-4 py-3 text-center">Presentes</th>
                    <th className="px-4 py-3 text-center">Ausentes</th>
                    <th className="px-4 py-3 text-center">Justificados</th>
                    <th className="px-4 py-3 text-center">Asistencia %</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.studentStats.map((student, idx) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold">{student.name}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className="px-2 py-1 rounded bg-primary-100 text-primary-700 font-semibold">
                          {student.team}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">
                        {student.presentCount}
                      </td>
                      <td className="px-4 py-3 text-center text-red-600 font-bold">
                        {student.absentCount}
                      </td>
                      <td className="px-4 py-3 text-center text-yellow-600 font-bold">
                        {student.justifiedCount}
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        <span className={student.attendancePercentage >= 80 ? 'text-green-600' : 'text-red-600'}>
                          {student.attendancePercentage.toFixed(1)}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {!selectedClass && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <p className="text-5xl mb-4">📊</p>
          <p className="text-xl text-gray-600">Selecciona una clase para ver los reportes</p>
        </motion.div>
      )}
    </div>
  )
}
