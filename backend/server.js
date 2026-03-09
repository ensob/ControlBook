import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { pool } from './config/database.js'
import { authenticateToken } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import classRoutes from './routes/classes.js'
import areasRoutes from './routes/areas.js'
import studentRoutes from './routes/students.js'
import attendanceRoutes from './routes/attendance.js'
import reportsRoutes from './routes/reports.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ControlBook API está en línea ✅' })
})

// Routes
app.use('/auth', authRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/areas', areasRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/reports', reportsRoutes)

// Stats endpoint
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const classesResult = await pool.query('SELECT COUNT(*) as count FROM classes WHERE user_id = $1', [req.user.id])
    const studentsResult = await pool.query('SELECT COUNT(*) as count FROM students WHERE user_id = $1', [req.user.id])
    
    const today = new Date().toISOString().split('T')[0]
    const presentResult = await pool.query(
      'SELECT COUNT(*) as count FROM attendance WHERE user_id = $1 AND date = $2 AND status = $3',
      [req.user.id, today, 'present']
    )
    const absentResult = await pool.query(
      'SELECT COUNT(*) as count FROM attendance WHERE user_id = $1 AND date = $2 AND status = $3',
      [req.user.id, today, 'absent']
    )

    res.json({
      totalClasses: parseInt(classesResult.rows[0].count),
      totalStudents: parseInt(studentsResult.rows[0].count),
      todayAttendance: parseInt(presentResult.rows[0].count),
      absentToday: parseInt(absentResult.rows[0].count)
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Error fetching stats' })
  }
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo salió mal' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ControlBook API corriendo en puerto ${PORT}`)
})
