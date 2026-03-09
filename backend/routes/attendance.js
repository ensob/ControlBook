import express from 'express'
import { pool } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get attendance records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { classId, date } = req.query
    
    const result = await pool.query(
      'SELECT * FROM attendance WHERE class_id = $1 AND date = $2 AND user_id = $3',
      [classId, date, req.user.id]
    )
    
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    res.status(500).json({ error: 'Error fetching attendance' })
  }
})

// Create attendance record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, classId, date, time, status, notes, hasJustification } = req.body
    
    // Check if record exists
    const existingResult = await pool.query(
      'SELECT * FROM attendance WHERE student_id = $1 AND class_id = $2 AND date = $3',
      [studentId, classId, date]
    )
    
    let result
    if (existingResult.rows.length > 0) {
      result = await pool.query(
        'UPDATE attendance SET status=$1, time=$2, notes=$3, has_justification=$4 WHERE student_id=$5 AND class_id=$6 AND date=$7 AND user_id=$8 RETURNING *',
        [status, time, notes, hasJustification, studentId, classId, date, req.user.id]
      )
    } else {
      result = await pool.query(
        'INSERT INTO attendance (user_id, class_id, student_id, date, time, status, notes, has_justification) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [req.user.id, classId, studentId, date, time, status, notes, hasJustification]
      )
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error creating attendance record:', error)
    res.status(500).json({ error: 'Error creating attendance record' })
  }
})

// Update attendance
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, notes, hasJustification, justificationFile } = req.body
    
    const result = await pool.query(
      'UPDATE attendance SET status=$1, notes=$2, has_justification=$3, justification_file=$4 WHERE id=$5 AND user_id=$6 RETURNING *',
      [status, notes, hasJustification, justificationFile, req.params.id, req.user.id]
    )
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating attendance:', error)
    res.status(500).json({ error: 'Error updating attendance' })
  }
})

export default router
