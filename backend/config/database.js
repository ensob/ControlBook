import Database from 'better-sqlite3'
import path from 'path'
import bcryptjs from 'bcryptjs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../controlbook.db')

// Crear/abrir base de datos
export const db = new Database(dbPath, { verbose: null })
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export const pool = {
  query: (sql, values = []) => {
    // Retornar una promesa resuelta para compatibilidad con async/await
    return Promise.resolve().then(() => {
      try {
        // Convertir placeholders de PostgreSQL a SQLite
        let sqlite_sql = sql.trim()
        for (let i = 0; i < (values?.length || 0); i++) {
          sqlite_sql = sqlite_sql.replace(`$${i + 1}`, '?')
        }
        
        // Detectar si tiene RETURNING (solo para INSERT)
        const hasReturning = /RETURNING\s+\*/i.test(sqlite_sql)
        const isInsert = /^INSERT/i.test(sqlite_sql)
        const tableForReturn = sqlite_sql.match(/INSERT\s+INTO\s+(\w+)/i)?.[1]
        
        // Remover RETURNING antes de ejecutar
        sqlite_sql = sqlite_sql.replace(/\s+RETURNING\s+\*/i, '')
        
        const command = sqlite_sql.split(/\s+/)[0].toUpperCase()
        
        if (command === 'SELECT') {
          const stmt = db.prepare(sqlite_sql)
          const rows = stmt.all(...(values || []))
          return { rows: rows || [] }
        }
        
        if (isInsert) {
          const stmt = db.prepare(sqlite_sql)
          const result = stmt.run(...(values || []))
          
          // Si se esperaba RETURNING, obtener el registro insertado
          if (hasReturning && tableForReturn) {
            const selectStmt = db.prepare(`SELECT * FROM ${tableForReturn} WHERE rowid = ?`)
            const rows = selectStmt.all(result.lastInsertRowid)
            return { rows: rows || [] }
          }
          
          return { rows: [] }
        }
        
        if (command === 'UPDATE' || command === 'DELETE') {
          const stmt = db.prepare(sqlite_sql)
          stmt.run(...(values || []))
          return { rows: [] }
        }
        
        return { rows: [] }
      } catch (error) {
        console.error('❌ DB Query Error:', error.message)
        console.error('SQL:', sql)
        console.error('Values:', values)
        throw error
      }
    })
  }
}

// Initialize Database
export const initializeDatabase = async () => {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'teacher',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Classes table
    db.exec(`
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        time TEXT,
        location TEXT,
        emoji TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Areas table (nuevas especialidades)
    db.exec(`
      CREATE TABLE IF NOT EXISTS areas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Students table - actualizado con password y area_id
    db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        class_id INTEGER,
        area_id INTEGER,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        team TEXT,
        notes TEXT,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE SET NULL
      )
    `)

    // Attendance table
    db.exec(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        date DATE NOT NULL,
        time TEXT,
        status TEXT,
        notes TEXT,
        has_justification BOOLEAN DEFAULT 0,
        justification_file TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `)

    // Create demo user if doesn't exist
    const hashedPassword = await bcryptjs.hash('admin123', 10)
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password, role) 
      VALUES (?, ?, ?, ?)
    `)
    stmt.run('Admin ControlBook', 'admin@controlbook.es', hashedPassword, 'teacher')
    
    // Get admin user id
    const adminStmt = db.prepare('SELECT id FROM users WHERE email = ?')
    const admin = adminStmt.get('admin@controlbook.es')
    
    // Create default areas for admin
    if (admin) {
      const areas = [
        ['🎬 Producción', '🎬'],
        ['🎥 Realización', '🎥'],
        ['🎵 DJ', '🎵'],
        ['📋 Dirección', '📋'],
        ['🎨 Diseño', '🎨']
      ]
      
      const areaStmt = db.prepare('INSERT OR IGNORE INTO areas (user_id, name, emoji) VALUES (?, ?, ?)')
      for (const [name, emoji] of areas) {
        areaStmt.run(admin.id, name, emoji)
      }
    }

    console.log('✅ Base de datos inicializada correctamente')
    console.log('📝 Usuario demo - Email: admin@controlbook.es | Password: 123456')
    console.log('📍 Áreas predefinidas: Producción, Realización, DJ, Dirección, Diseño')
  } catch (error) {
    console.error('❌ Error inicializando BD:', error.message)
  }
}

// Initialize DB on startup
initializeDatabase()
