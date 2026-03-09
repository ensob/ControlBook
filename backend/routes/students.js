import express from 'express'
import bcryptjs from 'bcryptjs'
import { pool, db } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all students for logged-in user
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const selectStmt = db.prepare(
      'SELECT * FROM students WHERE user_id = ? AND active = TRUE ORDER BY name'
    )
    const students = selectStmt.all(req.user.id)
    res.json(students)
  } catch (error) {
    console.error('Error fetching all students:', error)
    res.status(500).json({ error: 'Error fetching students' })
  }
})

// Get students by class
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { classId } = req.query
    
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' })
    }
    
    const selectStmt = db.prepare(
      'SELECT * FROM students WHERE class_id = ? AND user_id = ? AND active = TRUE ORDER BY name'
    )
    const students = selectStmt.all(classId, req.user.id)
    
    res.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    res.status(500).json({ error: 'Error fetching students' })
  }
})

// Create student
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, team, notes, classId } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)
    
    const stmt = db.prepare(
      'INSERT INTO students (user_id, class_id, name, email, password, team, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    const result = stmt.run(req.user.id, classId, name, email, hashedPassword, team || 'producción', notes)
    
    // Obtener el estudiante creado
    const selectStmt = db.prepare('SELECT * FROM students WHERE rowid = ?')
    const newStudent = selectStmt.get(result.lastInsertRowid)
    
    res.json(newStudent)
  } catch (error) {
    console.error('Error creating student:', error)
    if (error.message.includes('UNIQUE') || error.message.includes('unique')) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }
    res.status(500).json({ error: error.message || 'Error creating student' })
  }
})

// Update student
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, team, notes } = req.body
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }
    
    // If password is provided, hash it
    let updateStmt
    let updateParams
    
    if (password && password.trim()) {
      const hashedPassword = await bcryptjs.hash(password, 10)
      updateStmt = db.prepare(
        'UPDATE students SET name = ?, email = ?, password = ?, team = ?, notes = ? WHERE id = ? AND user_id = ?'
      )
      updateParams = [name, email, hashedPassword, team, notes, req.params.id, req.user.id]
    } else {
      updateStmt = db.prepare(
        'UPDATE students SET name = ?, email = ?, team = ?, notes = ? WHERE id = ? AND user_id = ?'
      )
      updateParams = [name, email, team, notes, req.params.id, req.user.id]
    }
    
    const result = updateStmt.run(...updateParams)
    
    // Verificar que el update fue exitoso
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado o sin permisos' })
    }
    
    // Obtener el registro actualizado
    const selectStmt = db.prepare('SELECT * FROM students WHERE id = ? AND user_id = ?')
    const updated = selectStmt.get(req.params.id, req.user.id)
    
    if (!updated) {
      return res.status(404).json({ error: 'Estudiante no encontrado después de actualizar' })
    }
    
    res.json(updated)
  } catch (error) {
    console.error('Error updating student:', error)
    if (error.message.includes('UNIQUE') || error.message.includes('unique')) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }
    res.status(500).json({ error: error.message || 'Error updating student' })
  }
})

// Delete student (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleteStmt = db.prepare(
      'UPDATE students SET active = FALSE WHERE id = ? AND user_id = ?'
    )
    const result = deleteStmt.run(req.params.id, req.user.id)
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' })
    }
    
    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    res.status(500).json({ error: 'Error deleting student' })
  }
})

export default router
