# 🛠️ ControlBook - Maintenance Plan

## 📋 Descripción General

ControlBook requiere mantenimiento mínimo gracias a su infraestructura moderna y automatizada.

---

## 📅 Calendario de Mantenimiento

### ⚡ DIARIO (Automático)
- **Monitoreo**: Railway y Vercel monitorean automáticamente
- **Backups**: PostgreSQL en Railway hace backups automáticos
- **Alertas**: Recibe notificaciones si algo falla

### 📆 SEMANAL (15 minutos)
```bash
# Revisar logs
railway logs

# Verificar performance
# (Dashboard de Vercel/Railway)

# Revisar issues en GitHub
```

### 📅 MENSUAL (1 hora)

#### 1. Actualizar Dependencias
```bash
# Frontend
cd frontend
npm update
npm audit fix

# Backend
cd backend
npm update
npm audit fix

# Commit cambios
git add .
git commit -m "chore: update dependencies"
git push
```

#### 2. Revisar Performance
- Lighthouse score (debe ser >90)
- API response times
- Database query times

#### 3. Seguridad
```bash
# Verificar vulnerabilidades
npm audit

# Actualizar .env passwords si es necesario
# (Cambiar JWT_SECRET cada 6 meses)
```

### 🗓️ TRIMESTRAL (2 horas)

#### 1. Backup Completo
```bash
# Exportar BD completa
pg_dump controlbook > backup-$(date +%Y%m%d).sql

# Guardar en lugar seguro (Google Drive, etc)
```

#### 2. Testing Completo
```bash
# Probar todas las funcionalidades
- Login/logout
- Crear clase
- Agregar estudiantes
- Registrar asistencia
- Ver reportes
- Exportar datos
```

#### 3. Documentación
- Actualizar README.md si hay cambios
- Documentar nuevas features
- Revisar DEPLOYMENT_GUIDE.md

### 🎯 ANUAL (4 horas)

#### 1. Auditoría de Seguridad
```bash
# Revisar:
- JWT secret rotation
- CORS configuration
- SQL injection vulnerabilities
- XSS prevention
```

#### 2. Upgrade de Dependencias Mayores
```bash
# Ej: React 18 → React 19
npm install react@latest

# Probar exhaustivamente
npm run dev
# ... testing completo
```

#### 3. Review de Infraestructura
- Railway: Verificar uso de recursos
- Vercel: Revisar edge locations
- BD: Analizar índices y performance

---

## 🚨 Troubleshooting Rápido

### La app está lenta
```bash
# Revisar logs en Railway
railway logs

# Probable causa: queries lentas
# Solución: Agregar índices en BD

CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);
```

### Backend caído
1. Ir a Railway dashboard
2. Ver logs
3. Reiniciar deploy si es necesario
4. Si persiste: contactar Railway support

### Frontend no carga
1. Ir a Vercel dashboard
2. Ver build logs
3. Si falla build: revisar código
4. Re-deploy manual si es necesario

### BD sin espacio
Railway liberará espacio automáticamente.
Si no:
```bash
# Limpiar logs antiguos
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '1 month';

# O upgrade a plan pago
```

---

## 🔐 Seguridad Checklist

- [ ] JWT_SECRET cambiado desde default
- [ ] HTTPS habilitado en producción
- [ ] CORS configurado correctamente
- [ ] Contraseñas hasheadas con bcryptjs
- [ ] No hay datos sensibles en logs
- [ ] BD respaldada regularmente
- [ ] 2FA no implementado pero planeado

---

## 📊 Monitoring Tools

### Railway
- Email alerts habilitadas
- Logs del servidor accesibles
- Auto-restart en caso de crash

### Vercel
- Performance monitoring
- Error tracking
- Analytics

### GitHub
- Dependabot alerts
- Code scanning
- Security advisories

---

## 🔄 Update Procedure

### Paso 1: Planificar
```
- Revisar changelog de dependencias
- Probar localmente cambios
- Crear rama de testing
```

### Paso 2: Actualizar
```bash
# Feature branch
git checkout -b update/dependencias

# Actualizar
npm update

# Commit
git commit -m "chore: update dependencies"

# Push
git push origin update/dependencias
```

### Paso 3: Test
```
- Prueba completa en local
- CI/CD tests deben pasar
- Manual testing en staging
```

### Paso 4: Deploy
```
- Merge a main
- Deploy automático en Railway/Vercel
- Monitoreo por 1 hora
```

---

## 📈 Escalabilidad Futura

Si necesitas escalar (>10k usuarios):

1. **Migrate BD** a AWS RDS o Google Cloud SQL
2. **Redis** para caching
3. **CDN** para assets estáticos
4. **Message Queue** (RabbitMQ) para tasks pesadas
5. **Monitoring avanzado** (DataDog, New Relic)

---

## 🆘 Contactos de Soporte

| Servicio | Contacto |
|----------|----------|
| Railway | support@railway.app |
| Vercel | support@vercel.com |
| GitHub | support@github.com |
| PostgreSQL | postgres@postgresql.org |

---

## 📝 Maintenance Log Template

```
## [YYYY-MM-DD] Maintenance Report

### Tareas Realizadas
- [ ] Revisar logs
- [ ] Update dependencias
- [ ] Testing

### Issues Encontrados
- (ninguno)

### Performance
- API Response: ~100ms ✅
- Database: ~50ms ✅
- Frontend: 95 Lighthouse ✅

### Siguientes Pasos
- N/A

### Tiempo Total
~15 minutos
```

---

## 🎯 SLA (Service Level Agreement)

- **Uptime Target**: 99.5%
- **Response Time**: <500ms
- **Support**: 24 horas
- **Updates**: Bajo demanda

---

**Última revisión**: 2026-03-09  
**Próxima revisión**: 2026-04-09
