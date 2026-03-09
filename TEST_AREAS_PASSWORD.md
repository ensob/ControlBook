# Testing Guide: Areas Management & Student Password Login

## Overview
This guide documents the recent changes for managing specialties (Areas) and adding password authentication for students.

## Changes Made

### 1. **Areas Management UI** (Frontend)
**File**: `frontend/src/pages/ClassesPage.jsx`
- Renamed page to manage Áreas (specialties) instead of Classes
- Button now displays "➕ Nueva Área" instead of "Nueva Clase"
- Shows 5 specialty areas: Producción 🎬, Realización 🎥, DJ 🎵, Dirección 📋, Diseño 🎨
- Add/Edit/Delete functionality for areas
- Emoji selector for customization

### 2. **Student Password Field** (Frontend & Backend)
**Files**: 
- `frontend/src/pages/StudentPage.jsx` - Added password input field
- `backend/routes/students.js` - Updated POST/PUT endpoints to handle passwords

**Features**:
- Password required when creating new student
- Password optional when editing student
- Passwords are hashed using bcryptjs

### 3. **Student Login Endpoint** (Backend)
**File**: `backend/routes/auth.js`
**Endpoint**: `POST /api/auth/student-login`
- Students can login with email + password
- Returns JWT token with role "student"
- Token valid for 30 days

## Testing Steps

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 2: Test Areas Management

1. **Login as Tutor**
   - Navigate to login page
   - Use: admin@controlbook.es / 123456
   - Should see dashboard with "Gestionar Áreas" option

2. **View Default Areas**
   - Click "Gestionar Áreas"
   - Should see 5 default areas:
     - 🎬 Producción
     - 🎥 Realización
     - 🎵 DJ
     - 📋 Dirección
     - 🎨 Diseño

3. **Create New Area**
   - Click "➕ Nueva Área" button
   - Enter area name (e.g., "Fotografía")
   - Select emoji from 12 options
   - Click "🚀 Crear Área"
   - New area should appear in grid

4. **Edit Area**
   - Click "✏️ Editar" on any area
   - Modify name and/or emoji
   - Click "🚀 Actualizar Área"
   - Changes should reflect immediately

5. **Delete Area**
   - Click "🗑️ Eliminar" on any area
   - Confirm deletion when prompted
   - Area should be removed from grid

### Step 3: Test Student Password Field

1. **Add Student with Password**
   - Navigate to any Área
   - Click "Nuevo" button
   - Fill form:
     - Name: "Juan García"
     - Email: "juan@example.com"
     - Password: "miPassword123"
     - Team: Select area
     - Notes: Optional
   - Click "✅ Añadir Estudiante"
   - Student should appear in list with no visible password

2. **Edit Student Password**
   - Click "✏️ Editar" on a student
   - Leave password field empty to keep current password
   - Or enter new password to change it
   - Click "💾 Guardar cambios"

### Step 4: Test Student Login

**Via cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "miPassword123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "student": {
    "id": 1,
    "name": "Juan García",
    "email": "juan@example.com",
    "type": "student"
  }
}
```

### Step 5: Verify Data Persistence

1. **Restart Backend**
   - Stop backend server (Ctrl+C)
   - Start again: `npm run dev`
   - Check that areas and students with passwords still exist

2. **Check Database** (Optional)
   - Open `controlbook.db` with SQLite viewer
   - Verify `areas` table has created areas
   - Verify `students` table has password field with hashed values
   - Passwords should NOT be plain text

## Database Schema Verification

### areas Table
```sql
CREATE TABLE areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

### students Table (Updated)
```sql
ALTER TABLE students ADD COLUMN area_id INTEGER;
ALTER TABLE students ADD COLUMN password TEXT;
```

## API Endpoints

### Areas
- `GET /api/areas` - List all areas for logged-in user
- `POST /api/areas` - Create new area
- `PUT /api/areas/:id` - Update area
- `DELETE /api/areas/:id` - Delete area

### Students
- `GET /api/students?classId=X` - List students in class
- `POST /api/students` - Create student (requires password)
- `PUT /api/students/:id` - Update student (password optional)
- `DELETE /api/students/:id` - Soft delete student

### Authentication
- `POST /api/auth/login` - Tutor login
- `POST /api/auth/student-login` - **NEW** Student login
- `POST /api/auth/register` - Tutor registration

## Troubleshooting

### Areas not loading
- Check browser console for errors
- Verify token is valid (should see it in localStorage)
- Check backend logs for database errors

### Student password field missing
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Verify form includes password input

### Student login returns 401
- Check email is correct
- Verify student exists in database
- Ensure password is correct (case-sensitive)
- Check that student is marked as active (active = TRUE)

### CORS Errors
- Verify vite.config.js has correct proxy target
- Should be `http://localhost:5000`
- Restart both frontend and backend if changed

## Next Steps

1. Create student dashboard/portal for self-service access
2. Add password reset functionality
3. Implement student registration QR code
4. Add area-to-student assignment UI
5. Create audit log for area/student changes

## Notes

- Passwords are hashed with bcryptjs (10 rounds)
- All passwords in database are NOT readable/reversible
- JWT tokens expire after 30 days
- Students and tutors use different login endpoints
- Areas are per-tutor (user_id based)
