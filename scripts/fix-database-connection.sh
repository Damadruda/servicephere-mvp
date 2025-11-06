#!/bin/bash

# Script para verificar y arreglar la conexión de base de datos
# ServicePhere MVP - Fixing Registration Issues

echo "🔧 Verificando conexión a base de datos..."

# 1. Verificar variables de entorno
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL no está configurada"
    echo "Por favor configura DATABASE_URL en tu .env local"
    exit 1
fi

echo "✅ DATABASE_URL configurada"

# 2. Generar Prisma Client
echo "📦 Generando Prisma Client..."
npx prisma generate

# 3. Ejecutar migraciones
echo "🗄️ Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# 4. Verificar conexión
echo "🔍 Verificando conexión a la base de datos..."
npx prisma db pull --print

echo "✅ Configuración de base de datos completada"
