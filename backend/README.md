# Backend - ControlBook

Node.js + Express + PostgreSQL

## Inicio Rápido

```bash
npm install
cp .env.example .env
npm run dev
```

Servidor en: http://localhost:3001

## Scripts

- `npm run dev` - Desarrollo con nodemon
- `npm start` - Producción
- `npm test` - (próximamente)

## Estructura

```
config/       # Configuración (BD, etc)
routes/       # API endpoints
middleware/   # Auth, validación
models/       # (Deprecated en favor de SQL directo)
server.js     # Punto de entrada
```

## Variables de Entorno

```bash
cp .env.example .env

# Edita estos valores:
DATABASE_URL=postgresql://...
JWT_SECRET=tu_clave_secreta
```

## API Endpoints

Ver [../docs/API.md](../docs/API.md)

## Tecnologías

- Node.js
- Express
- PostgreSQL
- JWT
- bcryptjs

## Más Info

Ver [../../README.md](../../README.md)
