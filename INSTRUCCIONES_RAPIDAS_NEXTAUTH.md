# ⚡ Instrucciones Rápidas - Solución NextAuth 404

## 🎯 Problema
Los endpoints de NextAuth (`/api/auth/*`) devuelven 404 en producción (www.servicephere.com)

## ✅ Solución Rápida (5 minutos)

### 1️⃣ Genera un NEXTAUTH_SECRET
En tu terminal local, ejecuta:
```bash
openssl rand -base64 32
```
Copia el resultado (será algo como: `abc123XYZ...`)

### 2️⃣ Configura Variables en Vercel
1. Ve a: https://vercel.com/dashboard
2. Abre tu proyecto `servicephere-mvp`
3. Ve a: **Settings** → **Environment Variables**
4. Agrega estas 3 variables:

```
NEXTAUTH_SECRET = [el secret que generaste arriba]
NEXTAUTH_URL = https://www.servicephere.com
DATABASE_URL = [tu connection string de PostgreSQL]
```

**IMPORTANTE**: Selecciona **Production**, **Preview** y **Development** para cada variable

### 3️⃣ Redeploy sin Cache
1. Ve a: **Deployments**
2. Último deployment → Click en **⋯** (tres puntos)
3. Click en **Redeploy**
4. **DESMARCA** la opción "Use existing Build Cache"
5. Click en **Redeploy**

### 4️⃣ Verifica que Funciona
Espera 2-3 minutos y prueba:
```
https://www.servicephere.com/api/test-route
https://www.servicephere.com/api/auth/diagnostics
https://www.servicephere.com/api/auth/session
```

Todos deberían devolver JSON (no 404)

## 📄 Documentación Completa
Lee `SOLUCION_NEXTAUTH_404.md` para más detalles

## ❓ ¿Sigue sin funcionar?
1. Revisa los logs de build en Vercel
2. Verifica que DATABASE_URL sea correcta
3. Asegúrate de que las migraciones de Prisma estén aplicadas
