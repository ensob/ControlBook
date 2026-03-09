import express from 'express'
import { db } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all areas for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM areas WHERE user_id = ? ORDER BY name')
    const areas = stmt.all(req.user.id)
    res.json(areas)
  } catch (error) {
    console.error('Error fetching areas:', error)
    res.status(500).json({ error: 'Error fetching areas' })
  }
})

// Create area
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, emoji } = req.body
    
    const stmt = db.prepare(
      'INSERT INTO areas (user_id, name, emoji) VALUES (?, ?, ?)'
    )
    const result = stmt.run(req.user.id, name, emoji || '🎵')
    
    // Obtener el área creada
    const selectStmt = db.prepare('SELECT * FROM areas WHERE rowid = ?')
    const newArea = selectStmt.get(result.lastInsertRowid)
    
    res.json(newArea)
  } catch (error) {
    console.error('Error creating area:', error)
    res.status(500).json({ error: 'Error creating area' })
  }
})

// Update area
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, emoji } = req.body
    
    const stmt = db.prepare(
      'UPDATE areas SET name = ?, emoji = ? WHERE id = ? AND user_id = ?'
    )
    stmt.run(name, emoji, req.params.id, req.user.id)
    
    // Obtener el área actualizada
    const selectStmt = db.prepare('SELECT * FROM areas WHERE id = ? AND user_id = ?')
    const updated = selectStmt.get(req.params.id, req.user.id)
    
    if (!updated) {
      return res.status(404).json({ error: 'Área no encontrada' })
    }
    
    res.json(updated)
  } catch (error) {
    console.error('Error updating area:', error)
    res.status(500).json({ error: 'Error updating area' })
  }
})

// Delete area
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM areas WHERE id = ? AND user_id = ?')
    stmt.run(req.params.id, req.user.id)
    res.json({ message: 'Area deleted successfully' })
  } catch (error) {
    console.error('Error deleting area:', error)
    res.status(500).json({ error: 'Error deleting area' })
  }
})

export default router
