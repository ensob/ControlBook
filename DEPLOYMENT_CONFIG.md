# 🚀 Configuración de Deployments

## Estructura de Ramas

El repositorio ahora utiliza la siguiente estructura de ramas:

- **`main`** - Desarrollo principal (rama by default)
- **`production`** - Rama de producción sincronizada con Vercel y Supabase

## Deployments Activos

### Vercel (Frontend)
- **Rama**: `production`
- **URL esperada**: Tu dominio de Vercel
- **Configuración**: Actualiza en Vercel Dashboard → Settings → Git

### Supabase (Base de Datos)
- **Rama**: `production`
- **Configuración**: Linkedto repository en Supabase

## Cómo Actualizar Deployments

### Opción 1: Actualizar Configuración en Vercel

1. Dirígete a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `control-book`
3. Ve a **Settings** → **Git**
4. Cambia la rama de producción a `production`
5. Guarda los cambios

### Opción 2: Actualizar Configuración en Supabase

1. Dirígete a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Real-time** o **Settings** → **GitHub**
4. Asegúrate de que apunta a la rama `production`

## Flujo de Deploy

```
Local Development (main)
         ↓
    git commit
         ↓
    git push origin main
         ↓
    Create Pull Request
         ↓
    Merge to production
         ↓
    git push origin production
         ↓
    Vercel & Supabase Deploy Automáticamente
```

## Rama Production Actual

**Última actualización**: 2026-03-10

Cambios incluidos:
- ✅ Runtime security hardening
- ✅ API URL configuration fixes
- ✅ Login flow corrections
- ✅ React hooks optimization
- ✅ Input validation y rate limiting

## Sincronización

Para mantener las ramas sincronizadas:

```bash
# En local development
git checkout main
git pull origin main

# Cuando estés listo para deploy
git checkout production
git pull origin main
git push origin production
```

## Verificación

Para verificar que los deployments están sincronizados:

1. Verifica el commit en Vercel build logs
2. Verifica el commit en Supabase
3. Ejecuta tests en ambas plataformas

## Troubleshooting

Si los deployments no se actualizan:
1. Verifica que ambos apunten a la rama `production`
2. Dispara un redeploy manual en Vercel
3. Verifica el estado en GitHub Actions si está configurado
