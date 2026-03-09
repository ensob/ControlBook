import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useStudentStore, useAttendanceStore } from '../context/store'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export default function AttendancePage() {
  const { classId } = useParams()
  const { token } = useAuthStore()
  const { students, fetchStudents } = useStudentStore()
  const { attendance, fetchAttendance, checkIn } = useAttendanceStore()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [checkedInStudents, setCheckedInStudents] = useState(new Set())
  const [absentStudents, setAbsentStudents] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    if (token && classId) {
      fetchStudents(classId, token)
      fetchAttendance(classId, selectedDate, token)
    }
  }, [token, classId, selectedDate])

  useEffect(() => {
    const checked = new Set()
    const absent = new Set()
    attendance.forEach(record => {
      if (record.status === 'present') checked.add(record.studentId)
      if (record.status === 'absent') absent.add(record.studentId)
    })
    setCheckedInStudents(checked)
    setAbsentStudents(absent)
  }, [attendance])

  const handleCheckIn = async (studentId, status) => {
    const data = {
      classId,
      studentId,
      date: selectedDate,
      time: format(new Date(), 'HH:mm'),
      status,
      notes: '',
      hasJustification: false,
      justificationFile: null
    }
    
    await checkIn(studentId, data, token)
    
    if (status === 'present') {
      setCheckedInStudents(prev => new Set(prev).add(studentId))
      setAbsentStudents(prev => {
        const newSet = new Set(prev)
        newSet.delete(studentId)
        return newSet
      })
    } else {
      setAbsentStudents(prev => new Set(prev).add(studentId))
      setCheckedInStudents(prev => {
        const newSet = new Set(prev)
        newSet.delete(studentId)
        return newSet
      })
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <h1 className="text-4xl font-black text-gray-900">✅ Control de Asistencia</h1>
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          ↩️ Volver
        </button>
      </motion.div>

      {/* Date Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card flex items-center gap-4 flex-wrap"
      >
        <label className="font-semibold text-gray-900">📅 Selecciona fecha:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field max-w-xs"
        />
        <div className="ml-auto text-sm text-gray-600">
          <span className="font-semibold">✅ Presentes: {checkedInStudents.size}</span>
          <span className="ml-4 font-semibold">❌ Ausentes: {absentStudents.size}</span>
        </div>
      </motion.div>

      {/* Students Attendance */}
      <div className="grid grid-cols-1 gap-4">
        {students.map((student, idx) => {
          const isPresent = checkedInStudents.has(student.id)
          const isAbsent = absentStudents.has(student.id)
          
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`card transition-all ${
                isPresent ? 'border-2 border-green-500 bg-green-50' :
                isAbsent ? 'border-2 border-red-500 bg-red-50' :
                'border border-gray-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    {student.team === 'producción' && '🎬 Producción'}
                    {student.team === 'realización' && '🎥 Realización'}
                    {student.team === 'dj' && '🎵 DJ'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCheckIn(student.id, 'present')}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      isPresent
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    ✅ Presente
                  </button>
                  <button
                    onClick={() => handleCheckIn(student.id, 'absent')}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      isAbsent
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    ❌ Ausente
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {students.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl text-gray-600">No hay estudiantes en esta clase</p>
        </motion.div>
      )}
    </div>
  )
}
