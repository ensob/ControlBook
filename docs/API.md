## ControlBook API Documentation

### Base URL
```
http://localhost:3001/api
Production: https://controlbook-backend.up.railway.app/api
```

### Autenticación

Todos los endpoints (excepto `/auth/login` y `/auth/register`) requieren:

```
Authorization: Bearer <token>
```

---

## 📝 Endpoints

### AUTH (Autenticación)

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@controlbook.es",
  "password": "admin123"
}

RESPONSE 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@controlbook.es"
  }
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}

RESPONSE 200: (mismo que login)
```

---

### 📚 CLASSES (Clases)

#### Get All Classes
```http
GET /api/classes
Authorization: Bearer <token>

RESPONSE 200:
[
  {
    "id": 1,
    "name": "Danza Street",
    "description": "Clase de danza urbana",
    "time": "10:00 - 12:00",
    "location": "Aula 5",
    "emoji": "🎭",
    "studentCount": 25,
    "created_at": "2026-03-09T10:00:00Z"
  }
]
```

#### Create Class
```http
POST /api/classes
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Danza Street",
  "description": "Clase de danza urbana",
  "time": "10:00 - 12:00",
  "location": "Aula 5",
  "emoji": "🎭"
}

RESPONSE 201: (objeto class creado)
```

#### Update Class
```http
PUT /api/classes/:id
Authorization: Bearer <token>

Form similar a Create
```

#### Delete Class
```http
DELETE /api/classes/:id
Authorization: Bearer <token>

RESPONSE 200: { "message": "Class deleted successfully" }
```

---

### 👥 STUDENTS (Estudiantes)

#### Get Students by Class
```http
GET /api/students?classId=1
Authorization: Bearer <token>

RESPONSE 200:
[
  {
    "id": 1,
    "name": "María García",
    "email": "maria@example.com",
    "team": "producción",
    "notes": "Muy participativa",
    "active": true,
    "created_at": "2026-03-01T00:00:00Z"
  }
]
```

#### Create Student
```http
POST /api/students
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "María García",
  "email": "maria@example.com",
  "team": "producción",
  "notes": "Muy participativa",
  "classId": 1
}

RESPONSE 201: (objeto student creado)
```

#### Update Student
```http
PUT /api/students/:id
Authorization: Bearer <token>

{
  "name": "María García",
  "email": "maria@example.com",
  "team": "realización",
  "notes": "Cambió de equipo"
}
```

#### Delete Student (soft delete)
```http
DELETE /api/students/:id
Authorization: Bearer <token>

RESPONSE 200: { "message": "Student deleted successfully" }
```

---

### ✅ ATTENDANCE (Asistencia)

#### Get Attendance Records
```http
GET /api/attendance?classId=1&date=2026-03-09
Authorization: Bearer <token>

RESPONSE 200:
[
  {
    "id": 1,
    "student_id": 1,
    "class_id": 1,
    "date": "2026-03-09",
    "time": "10:05",
    "status": "present",
    "notes": "Llegó un poco tarde",
    "has_justification": false,
    "justification_file": null
  }
]
```

#### Create/Update Attendance
```http
POST /api/attendance
Content-Type: application/json
Authorization: Bearer <token>

{
  "studentId": 1,
  "classId": 1,
  "date": "2026-03-09",
  "time": "10:05",
  "status": "present",
  "notes": "Asistencia normal",
  "hasJustification": false,
  "justificationFile": null
}

Status values: "present" | "absent" | "justified"
```

#### Update Attendance Record
```http
PUT /api/attendance/:id
Authorization: Bearer <token>

{
  "status": "justified",
  "notes": "Justificante presentado",
  "hasJustification": true,
  "justificationFile": "documento.pdf"
}
```

---

### 📊 REPORTS (Reportes)

#### Get Class Report
```http
GET /api/reports?classId=1&from=2026-01-01&to=2026-03-09
Authorization: Bearer <token>

RESPONSE 200:
{
  "totalDays": 45,
  "averageAttendance": 87.5,
  "studentStats": [
    {
      "id": 1,
      "name": "María García",
      "team": "producción",
      "presentCount": 40,
      "absentCount": 3,
      "justifiedCount": 2,
      "attendancePercentage": 93.33
    }
  ]
}
```

---

### 📊 STATS (Estadísticas Generales)

#### Get Dashboard Stats
```http
GET /api/stats
Authorization: Bearer <token>

RESPONSE 200:
{
  "totalClasses": 3,
  "totalStudents": 75,
  "todayAttendance": 70,
  "absentToday": 5
}
```

---

## 🔍 Query Parameters

### Pagination (próxima versión)
```
GET /api/students?classId=1&page=1&limit=20
```

### Filters
```
GET /api/attendance?classId=1&status=absent&date=2026-03-09
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "error": "Token requerido"
}
```

### 403 Forbidden
```json
{
  "error": "Token inválido"
}
```

### 400 Bad Request
```json
{
  "error": "El email ya existe"
}
```

### 500 Server Error
```json
{
  "error": "Error creating class"
}
```

---

## 📝 Request Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
Accept: application/json
```

---

## 🧪 Testing con cURL

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@controlbook.es",
    "password": "admin123"
  }'

# Get Classes
curl -X GET http://localhost:3001/api/classes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create Attendance
curl -X POST http://localhost:3001/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "studentId": 1,
    "classId": 1,
    "date": "2026-03-09",
    "time": "10:05",
    "status": "present",
    "notes": ""
  }'
```

---

## 🔐 Rate Limiting
Actualmente sin límite (próxima mejora: 100 requests/min)

## 📦 Response Formats
- `application/json` - Formato por defecto
- `application/xml` - Próxima versión

---

**Versión API: 1.0.0**  
**Última actualización: 2026-03-09**
