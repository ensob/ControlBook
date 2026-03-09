# ControlBook - Deployment Guide

## 🚀 Inicio Rápido (5 minutos)

### Opción 1: Despliegue GRATIS con Vercel + Railway (Recomendado)

#### Requisitos:
- Cuenta de GitHub (gratis)
- Cuenta de Vercel (gratis) 
- Cuenta de Railway (gratis)
- PostgreSQL en Railway (gratis)

#### Paso 1: Preparar el Repositorio

```bash
# 1. Crear repositorio en GitHub
git init
git add .
git commit -m "Initial commit: ControlBook v1.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/controlbook.git
git push -u origin main
```

#### Paso 2: Configurar Base de Datos en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz login con GitHub
3. Crea proyecto nuevo > PostgreSQL
4. Copia la `DATABASE_URL` de las variables de entorno

#### Paso 3: Desplegar Backend en Railway

1. En Railway, selecciona tu proyecto
2. "New" > "GitHub Repo" > Selecciona `controlbook`
3. Configura variables de entorno:
```
DATABASE_URL=postgresql://...
JWT_SECRET=controlbook_secret_key_super_segura_123
NODE_ENV=production
```

4. Railway automáticamente hace deploy en: `https://controlbook-backend.up.railway.app`

#### Paso 4: Desplegar Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. "Add New Project" > Importa repositorio de GitHub
3. Configura:
   - Framework: Vite
   - Root Directory: `./frontend`
4. Variables de entorno:
```
VITE_API_URL=https://controlbook-backend.up.railway.app
```
5. Deploy automático ✅

### Opción 2: Despliegue Manual en Servidor VPS ($5-10/mes)

#### Requisitos:
- VPS Linux (DigitalOcean, Linode, etc.)
- Node.js instalado
- PostgreSQL

#### Instalación:

```bash
# SSH a tu servidor
ssh root@TU_SERVIDOR_IP

# Instalar dependencias del sistema
apt-get update
apt-get install -y nodejs npm postgresql postgresql-contrib nginx

# Clonar repositorio
cd /var/www
git clone https://github.com/TU_USUARIO/controlbook.git
cd controlbook

# Backend setup
cd backend
npm install
npm start &

# Frontend setup
cd ../frontend
npm install
npm run build

# Configurar nginx para servir frontend
sudo nano /etc/nginx/sites-available/default
```

Config Nginx:
```nginx
server {
    listen 80 default_server;
    server_name _;

    # Frontend
    location / {
        root /var/www/controlbook/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Reiniciar nginx
sudo systemctl restart nginx

# SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com
```

## 📊 Ambiente de Desarrollo Local

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

Accede a: http://localhost:5173

## 🔐 Variables de Entorno

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/controlbook
JWT_SECRET=tu_clave_secreta_super_segura_123
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001
```

## 📱 Responsive Design

✅ Funciona en:
- iPhone 12/13/14/15
- iPad Air/Pro
- Samsung Galaxy
- Windows PC/Laptop
- macOS

Se adapta automáticamente a cualquier resolución.

## 🛡️ Seguridad

1. **JWT Tokens** - Autenticación segura
2. **HTTPS** - Obligatorio en producción
3. **CORS** - Configurado correctamente
4. **SQL Injection** - Prevención con consultas parametrizadas
5. **Password Hashing** - bcrawljs (bcryptjs)

## 🔄 Actualizaciones y Mantenimiento

### Plan de Mantenimiento:

**Diariamente:**
- Monitoreo automático de Railway/Vercel
- Alertas de errores

**Semanalmente:**
- Backup automático de BD en Railway
- Revisar logs de errores

**Mensualmente:**
- Actualizar dependencias: `npm update`
- Revisar performance

**Anualmente:**
- Auditoría de seguridad
- Renovación de certificados SSL

### Comandos útiles:

```bash
# Ver logs en producción
railway logs

# Backup manual de BD
pg_dump controlbook > backup.sql

# Restaurar desde backup
psql controlbook < backup.sql
```

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Resetear base de datos
npm run setup:db
```

### Frontend no conecta a backend
```bash
# Verificar CORS en backend/server.js
# Asegúrate que VITE_API_URL sea correcto
```

### Railway muestra error de memoria
- Plan gratuito tiene límite de 512MB
- Upgrade a plan pago ($5/mes) si necesitas más

## 🎯 Costos Mensuales

| Servicio | Costo | Notas |
|----------|-------|-------|
| Railway Postgres | GRATIS | Hasta 512MB |
| Railway Backend | GRATIS | Limitado |
| Vercel Frontend | GRATIS | Perfecto |
| Dominio personalizado | $10-15 | Opcional |
| **TOTAL** | **GRATIS** | A menos que quieras dominio |

## 📞 Soporte

- GitHub Issues: Para bugs y features
- Email: support@controlbook.es
- Docs: https://docs.controlbook.es

---

**¡Tu app ControlBook está lista para producción!** 🎉

