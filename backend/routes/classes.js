import express from 'express'
import { pool, db } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all classes for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM classes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    
    // Add student count to each class
    const classesWithCount = result.rows.map((cls) => {
      const countResult = db.prepare(
        'SELECT COUNT(*) as count FROM students WHERE class_id = ?'
      ).all(cls.id)
      
      return {
        id: cls.id,
        name: cls.name,
        description: cls.description,
        time: cls.time,
        location: cls.location,
        emoji: cls.emoji,
        studentCount: countResult[0]?.count || 0,
        created_at: cls.created_at
      }
    })
    
    res.json(classesWithCount)
  } catch (error) {
    console.error('Error fetching classes:', error)
    res.status(500).json({ error: 'Error fetching classes' })
  }
})

// Create new class
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, time, location, emoji } = req.body
    
    const stmt = db.prepare(
      'INSERT INTO classes (user_id, name, description, time, location, emoji) VALUES (?, ?, ?, ?, ?, ?)'
    )
    const result = stmt.run(req.user.id, name, description, time, location, emoji || '📚')
    
    // Obtener la clase creada
    const selectStmt = db.prepare('SELECT * FROM classes WHERE rowid = ?')
    const newClass = selectStmt.get(result.lastInsertRowid)
    
    // Agregar student count
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM students WHERE class_id = ?')
    const countResult = countStmt.all(newClass.id)
    
    res.json({
      ...newClass,
      studentCount: countResult[0]?.count || 0
    })
  } catch (error) {
    console.error('Error creating class:', error)
    res.status(500).json({ error: 'Error creating class' })
  }
})

// Update class
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, time, location, emoji } = req.body
    
    const stmt = db.prepare(
      'UPDATE classes SET name = ?, description = ?, time = ?, location = ?, emoji = ? WHERE id = ? AND user_id = ?'
    )
    stmt.run(name, description, time, location, emoji, req.params.id, req.user.id)
    
    // Obtener la clase actualizada
    const selectStmt = db.prepare('SELECT * FROM classes WHERE id = ? AND user_id = ?')
    const updated = selectStmt.get(req.params.id, req.user.id)
    
    if (!updated) {
      return res.status(404).json({ error: 'Clase no encontrada' })
    }
    
    res.json(updated)
  } catch (error) {
    console.error('Error updating class:', error)
    res.status(500).json({ error: 'Error updating class' })
  }
})

// Delete class
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM classes WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    )
    
    res.json({ message: 'Class deleted successfully' })
  } catch (error) {
    console.error('Error deleting class:', error)
    res.status(500).json({ error: 'Error deleting class' })
  }
})

export default router
