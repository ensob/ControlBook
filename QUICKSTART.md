# 🚀 ControlBook - Quick Start Guide

## ⚡ Iniciar en 2 minutos (Local)

### Opción 1: Script Automático (Recomendado)

```bash
# Terminal
cd controlbook
npm run setup
npm run dev
```

Accede a: **http://localhost:5173**

Credenciales:
- Email: `admin@controlbook.es`
- Password: `admin123`

---

## 📖 Inicio Manual Paso a Paso

### Paso 1: Clonar Repositorio
```bash
git clone https://github.com/TU_USUARIO/controlbook.git
cd controlbook
```

### Paso 2: Backend Setup
```bash
cd backend

# Instalar dependencias
npm install

# Crear .env
cp .env.example .env

# Configurar DATABASE_URL (si usas PostgreSQL local)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/controlbook

# Iniciar servidor
npm run dev
# ✅ Backend corriendo en http://localhost:3001
```

### Paso 3: Frontend Setup (nueva terminal)
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar Vite dev server
npm run dev
# ✅ Frontend corriendo en http://localhost:5173
```

### Paso 4: Primera Vez - Crear BD
```bash
# Backend debe auto-generar las tablas
# Si no, ejecuta esto en PostgreSQL:

psql -U postgres -d controlbook

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'teacher',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... (ver backend/config/database.js para todas las tablas)
```

---

## 🎯 Primeros Pasos en la App

### Dashboard
1. Ingresa con credenciales demo
2. Ve estadísticas de asistencia
3. Visualiza tus clases

### Crear una Clase
1. Ve a "Áreas" → "Nueva Área"
2. Completa formulario
3. ¡Selecciona emoji!

### Agregar Estudiantes
1. Selecciona clase
2. "Estudiantes" → "Nuevo"
3. Elige equipo (Producción/Realización/DJ)

### Control de Asistencia
1. Selecciona clase
2. "Asistencia" → Selecciona fecha
3. Marca presentes/ausentes con botones
4. Los datos se guardan automáticamente ✅

### Ver Reportes
1. "Reportes"
2. Selecciona clase y rango de fechas
3. Análisis por estudiante

---

## 🔧 Troubleshooting Común

### Error: "Cannot connect to database"
```bash
# Verificar PostgreSQL está corriendo
psql -U postgres

# Crear BD si no existe
createdb controlbook

# Verificar DATABASE_URL en .env
cat backend/.env
```

### Error: "Port 5173 already in use"
```bash
# Cambiar puerto en frontend/vite.config.js
# O matar el proceso:
lsof -ti:5173 | xargs kill -9
```

### Error: "CORS error"
- Verifica FRONTEND_URL en backend/.env
- Debe ser `http://localhost:5173`

### Frontend no ve el backend
```bash
# En frontend/.env.local
VITE_API_URL=http://localhost:3001
```

---

## 📦 Build para Producción

### Frontend
```bash
cd frontend
npm run build
# Genera carpeta 'dist' lista para servir
```

### Backend
```bash
# Backend no necesita build, solo:
npm install --production
npm start
```

---

## 🌐 Despliegue Rápido

### En Vercel (Frontend)
1. Push a GitHub
2. Conecta Vercel
3. Deploy automático ✅

### En Railway (Backend + BD)
1. Conecta Railway a GitHub
2. Selecciona rama main
3. Deploy automático ✅

Ver: [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)

---

## 📁 Archivos Importantes

```
frontend/
├── src/components/     ← Componentes UI
├── src/pages/         ← Páginas principales
├── src/context/       ← Estado global (Zustand)
└── vite.config.js    ← Configuración

backend/
├── routes/            ← APIs endpoints
├── config/database.js ← Conexión BD
├── middleware/auth.js ← Autenticación
└── server.js         ← Punto de entrada
```

---

## 🎨 Personalizaciones Rápidas

### Cambiar Colores
Edita: `frontend/tailwind.config.js`
```js
colors: {
  primary: {
    500: '#ff6b35', // tu color
  }
}
```

### Cambiar Logo/Emoji
Edita: `frontend/src/components/Layout.jsx`
```jsx
<div className="text-3xl font-black text-white">📖</div>
```

### Agregar Nuevos Campos
1. Modifica tabla en `backend/config/database.js`
2. Actualiza API routes
3. Actualiza componentes frontend

---

## 🆘 ¿Necesitas Ayuda?

- 📖 Lee [README.md](./README.md)
- 📚 Ve [API docs](./docs/API.md)
- 💬 Abre issue en GitHub
- 📧 Contacta: support@controlbook.es

---

## ✅ Checklist de Inicio

- [ ] Node.js instalado (`node -v`)
- [ ] PostgreSQL corriendo
- [ ] Backend terminal abierto
- [ ] Frontend terminal abierto
- [ ] Login exitoso en http://localhost:5173
- [ ] Primera clase creada
- [ ] Primer estudiante agregado

---

🎉 **¡Listo! ControlBook está corriendo** 🎉

Ahora puedes empezar a gestionar asistencia. Happy tracking! 🎓
