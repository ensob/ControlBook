import express from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { pool, db } from '../config/database.js'
import rateLimit from 'express-rate-limit'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos'
})

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
]

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
]

// Login
router.post('/login', authLimiter, loginValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { email, password } = req.body

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña inválida' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error en login' })
  }
})

// Register
router.post('/register', authLimiter, registerValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, email, password } = req.body

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya existe' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    )

    const user = result.rows[0]
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error en registro' })
  }
})

// Student Login
router.post('/student-login', authLimiter, loginValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Get student directly from database using better-sqlite3
    const selectStmt = db.prepare('SELECT * FROM students WHERE email = ? AND active = TRUE')
    const student = selectStmt.get(email)

    if (!student) {
      return res.status(401).json({ error: 'Estudiante no encontrado' })
    }

    // Verify password
    const validPassword = await bcryptjs.compare(password, student.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña inválida' })
    }

    // Generate token for student
    const token = jwt.sign(
      { id: student.id, email: student.email, name: student.name, type: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      token,
      student: { 
        id: student.id, 
        name: student.name, 
        email: student.email,
        type: 'student'
      }
    })
  } catch (error) {
    console.error('Error en login de estudiante:', error)
    res.status(500).json({ error: 'Error en login' })
  }
})

export default router
