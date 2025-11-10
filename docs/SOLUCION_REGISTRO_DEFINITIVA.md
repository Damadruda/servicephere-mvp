# 🚀 SOLUCIÓN DEFINITIVA - Registro de Empresas ServicePhere

## ⚡ Implementación Rápida (15 minutos)

### Paso 1: Backup y Preparación (2 min)
```bash
# Hacer backup del código actual
git add .
git commit -m "backup: before registration fix"
git push origin main
```

### Paso 2: Reemplazar Archivos Críticos (3 min)

#### A. Reemplazar el singleton de Prisma
Copia el contenido del archivo `lib-prisma-singleton.ts` que creé y reemplaza tu archivo actual:
```bash
# Reemplazar lib/prisma.ts con el nuevo código
cp /home/claude/lib-prisma-singleton.ts lib/prisma-singleton.ts
```

#### B. Actualizar el archivo lib/prisma.ts
```typescript
// lib/prisma.ts
export { prisma, checkDatabaseConnection } from './prisma-singleton'
```

#### C. Reemplazar el endpoint de registro
```bash
# Reemplazar el endpoint actual
cp /home/claude/signup-route-fixed.ts app/api/signup/route.ts
```

### Paso 3: Configurar Variables de Entorno LOCAL (2 min)

Crea o actualiza tu archivo `.env.local`:
```env
# Base de datos - USA SOLO UNA
DATABASE_URL="postgresql://[tu-usuario]:[tu-password]@[tu-host]/[tu-database]?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"

# Entorno
NODE_ENV="development"
```

### Paso 4: Ejecutar Migraciones (3 min)
```bash
# Generar cliente de Prisma
npx prisma generate

# SI ESTÁS EN DESARROLLO LOCAL:
npx prisma migrate dev --name init

# SI ESTÁS ACTUALIZANDO PRODUCCIÓN:
npx prisma migrate deploy
```

### Paso 5: Verificar el Sistema (2 min)
```bash
# Copiar script de verificación
cp /home/claude/verify-system.ts scripts/verify-system.ts

# Ejecutar verificación
npx tsx scripts/verify-system.ts
```

### Paso 6: Configurar Vercel (3 min)

En el dashboard de Vercel (vercel.com):

1. Ve a tu proyecto → Settings → Environment Variables
2. Asegúrate de tener SOLO estas variables:

```
DATABASE_URL = [tu-connection-string-postgresql]
NEXTAUTH_URL = https://www.servicephere.com
NEXTAUTH_SECRET = [tu-secret-de-32-caracteres]
```

3. **ELIMINA** cualquier variable duplicada como DIRECT_URL

4. En Settings → Functions, agrega este comando de build:
```
npx prisma generate && npx prisma migrate deploy
```

### Paso 7: Desplegar
```bash
git add .
git commit -m "fix: registration system working with proper database connection"
git push origin main
```

## 🧪 Probar el Registro

### Test Manual Local:
1. Inicia el servidor: `npm run dev`
2. Ve a: http://localhost:3000/registro
3. Completa el formulario
4. Verifica en los logs de la consola

### Test con cURL:
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "Test User",
    "userType": "CLIENT",
    "companyName": "Test Company",
    "country": "México",
    "city": "CDMX"
  }'
```

## 🔍 Debugging

Si algo falla, revisa estos puntos:

### 1. Error: "Cannot connect to database"
```bash
# Verificar conexión
npx prisma db pull
```

### 2. Error: "User already exists"
```sql
-- Conectar a tu BD y ejecutar:
DELETE FROM "ClientProfile" WHERE "userId" IN (SELECT id FROM "User" WHERE email = 'test@example.com');
DELETE FROM "User" WHERE email = 'test@example.com';
```

### 3. Error: "P2003 Foreign key constraint"
```bash
# Resetear y recrear la BD (CUIDADO: borra todos los datos)
npx prisma migrate reset --force
```

## ✅ Checklist de Verificación

- [ ] Variables de entorno configuradas
- [ ] Prisma client generado
- [ ] Migraciones ejecutadas
- [ ] Conexión a BD verificada
- [ ] Endpoint /api/signup responde
- [ ] Registro crea usuario y perfil
- [ ] Login funciona después del registro

## 🆘 Soporte Inmediato

Si después de seguir estos pasos el registro sigue sin funcionar:

1. **Comparte los logs exactos del error**
2. **Ejecuta el script de verificación y comparte el output**
3. **Verifica en Vercel Functions logs el error específico**

## 💡 Mejoras Recomendadas (Para después)

1. Implementar verificación de email
2. Agregar rate limiting al endpoint
3. Mejorar validación de campos
4. Agregar tests automatizados
5. Implementar logs estructurados

---

**Tiempo total estimado: 15 minutos**
**Dificultad: Media**
**Resultado esperado: Sistema de registro 100% funcional**
