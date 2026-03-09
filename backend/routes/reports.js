import express from 'express'
import { pool } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get reports for a class
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { classId, from, to } = req.query
    
    // Get unique attendance dates
    const datesResult = await pool.query(
      'SELECT DISTINCT date FROM attendance WHERE class_id = $1 AND user_id = $2 AND date BETWEEN $3 AND $4 ORDER BY date',
      [classId, req.user.id, from, to]
    )
    
    const totalDays = datesResult.rows.length
    
    // Get all students in class
    const studentsResult = await pool.query(
      'SELECT * FROM students WHERE class_id = $1 AND user_id = $2 AND active = TRUE',
      [classId, req.user.id]
    )
    
    // Calculate stats for each student
    const studentStats = await Promise.all(
      studentsResult.rows.map(async (student) => {
        const attendanceResult = await pool.query(
          'SELECT COUNT(*) as count, status FROM attendance WHERE student_id = $1 AND class_id = $2 AND date BETWEEN $3 AND $4 GROUP BY status',
          [student.id, classId, from, to]
        )
        
        let presentCount = 0
        let absentCount = 0
        let justifiedCount = 0
        
        attendanceResult.rows.forEach(row => {
          if (row.status === 'present') presentCount = parseInt(row.count)
          else if (row.status === 'absent') absentCount = parseInt(row.count)
          else if (row.status === 'justified') justifiedCount = parseInt(row.count)
        })
        
        const attendancePercentage = totalDays > 0 
          ? ((presentCount + justifiedCount) / totalDays) * 100 
          : 0
        
        return {
          id: student.id,
          name: student.name,
          team: student.team,
          presentCount,
          absentCount,
          justifiedCount,
          attendancePercentage
        }
      })
    )
    
    // Calculate average attendance
    const avgAttendance = studentStats.length > 0
      ? studentStats.reduce((sum, s) => sum + s.attendancePercentage, 0) / studentStats.length
      : 0
    
    res.json({
      totalDays,
      averageAttendance: avgAttendance,
      studentStats
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    res.status(500).json({ error: 'Error fetching reports' })
  }
})

export default router
