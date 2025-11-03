# Instrucciones de Setup - ServiceSphere MVP

## 1. Configuración de Variables de Entorno en Vercel

### Paso 1: Acceder a la configuración del proyecto
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `servicephere-mvp`
3. Ve a **Settings** → **Environment Variables**

### Paso 2: Agregar las variables necesarias

#### Variables Obligatorias:

**DATABASE_URL** (PostgreSQL - Neon Console)
```
postgresql://neondb_owner:npg_F24YyrjwGVJC@ep-aged-dawn-ag3gijos-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
- Scope: Production, Preview, Development

**NEXTAUTH_SECRET** (Generar con: `openssl rand -base64 32`)
```
[Tu secret generado - ejemplo: dGhpc2lzYXNlY3JldGtleWZvcm5leHRhdXRo]
```
- Scope: Production, Preview, Development

**NEXTAUTH_URL**
- Production: `https://tu-dominio.vercel.app`
- Preview: `https://tu-proyecto-git-branch.vercel.app`
- Development: `http://localhost:3000`

#### Variables Opcionales (si usas OAuth):

**GOOGLE_CLIENT_ID** y **GOOGLE_CLIENT_SECRET**
- Obtener de [Google Cloud Console](https://console.cloud.google.com/)

**GITHUB_CLIENT_ID** y **GITHUB_CLIENT_SECRET**
- Obtener de [GitHub OAuth Apps](https://github.com/settings/developers)

### Paso 3: Guardar y redesplegar
- Haz clic en **Save** para cada variable
- Vercel automáticamente redesplegará tu aplicación

---

## 2. Ejecutar Migraciones de Prisma

### Opción A: Desde tu máquina local

```bash
# 1. Clonar el repositorio (si no lo has hecho)
git clone https://github.com/Damadruda/servicephere-mvp.git
cd servicephere-mvp

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env local (copiar de .env.example)
cp .env.example .env

# 4. Editar .env y agregar tu DATABASE_URL de Neon
nano .env  # o usa tu editor preferido

# 5. Ejecutar migraciones
npx prisma migrate deploy

# 6. Generar cliente de Prisma
npx prisma generate

# 7. (Opcional) Ver la base de datos
npx prisma studio
```

### Opción B: Desde Vercel (después del deploy)

Las migraciones se pueden ejecutar automáticamente agregando un script de build:

En `package.json`, modifica el script de build:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## 3. Verificar la Configuración

### Verificar conexión a la base de datos:
```bash
npx prisma db pull
```
Esto debe mostrar el esquema actual sin errores.

### Verificar que las tablas existen:
```bash
npx prisma studio
```
Abre una interfaz web para ver tus tablas (User, Account, Session, etc.)

### Verificar variables en Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Confirma que todas las variables están configuradas
4. Verifica que no haya espacios extra o caracteres especiales

---

## 4. Probar el Registro de Usuarios

### Prueba Local:
```bash
# 1. Iniciar servidor de desarrollo
npm run dev

# 2. Abrir navegador en http://localhost:3000

# 3. Ir a la página de registro

# 4. Intentar registrar un usuario con:
   - Email válido: test@example.com
   - Contraseña: mínimo 6 caracteres
```

### Prueba en Producción:
1. Ve a tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Navega a la página de registro
3. Completa el formulario
4. Verifica que:
   - Se crea el usuario correctamente
   - Recibes un mensaje de éxito
   - Puedes iniciar sesión con las credenciales

### Verificar en la base de datos:
```bash
npx prisma studio
```
- Abre la tabla `User`
- Verifica que el nuevo usuario aparece
- Confirma que la contraseña está hasheada (no en texto plano)

---

## 5. Solución de Problemas Comunes

### Error: "PrismaClientInitializationError"
- **Causa**: DATABASE_URL incorrecta o no configurada
- **Solución**: Verifica que la variable esté correctamente copiada en Vercel

### Error: "Table 'User' does not exist"
- **Causa**: Migraciones no ejecutadas
- **Solución**: Ejecuta `npx prisma migrate deploy`

### Error: "NEXTAUTH_SECRET is not defined"
- **Causa**: Variable de entorno faltante
- **Solución**: Genera un secret con `openssl rand -base64 32` y agrégalo en Vercel

### Error: "Email already exists"
- **Causa**: Intentando registrar un email que ya existe
- **Solución**: Usa otro email o elimina el usuario existente desde Prisma Studio

### Error de conexión SSL a Neon
- **Causa**: Parámetros SSL faltantes en DATABASE_URL
- **Solución**: Asegúrate de incluir `?sslmode=require&channel_binding=require`

---

## 6. Próximos Pasos

✅ Variables de entorno configuradas
✅ Migraciones ejecutadas
✅ Registro de usuarios funcionando

### Mejoras recomendadas:
1. **Verificación de email**: Implementar envío de email de confirmación
2. **Rate limiting**: Limitar intentos de registro por IP
3. **Validación de contraseña**: Requerir mayúsculas, números, caracteres especiales
4. **Recuperación de contraseña**: Implementar flujo de reset password
5. **Logging**: Agregar logs para debugging en producción
6. **Tests**: Agregar tests unitarios y de integración

---

## Recursos Útiles

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth.js](https://next-auth.js.org)
- [Neon Console](https://console.neon.tech)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Repositorio del proyecto](https://github.com/Damadruda/servicephere-mvp)

---

**¿Necesitas ayuda?** Revisa los logs en Vercel (Runtime Logs) para ver errores específicos.
