#!/bin/bash

# Script para iniciar ControlBook con Docker Compose
# Uso: ./docker-start.sh

set -e

echo "🎓 ControlBook - Docker Startup"
echo "================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

echo "🚀 Iniciando servicios..."
docker-compose up --build

echo ""
echo "✅ ControlBook está corriendo!"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo "Database: localhost:5432"
echo ""
echo "Credenciales:"
echo "  Email: admin@controlbook.es"
echo "  Password: admin123"
