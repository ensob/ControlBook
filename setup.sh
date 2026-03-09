#!/bin/bash

# ControlBook Setup Script
# Instala y configura ControlBook completamente

set -e

echo "🎓 ControlBook Setup"
echo "===================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}📦 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Descárgalo de https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"
echo ""

# Check PostgreSQL
echo -e "${BLUE}📦 Verificando PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL no parece estar instalado${NC}"
    echo "Ejecuta:"
    echo "  Windows: choco install postgresql"
    echo "  Mac: brew install postgresql"
    echo "  Linux: sudo apt-get install postgresql"
    echo ""
fi

# Backend Setup
echo -e "${BLUE}🔧 Configurando Backend...${NC}"
cd backend
echo -e "${BLUE}  📦 Instalando dependencias...${NC}"
npm install > /dev/null 2>&1
echo -e "${GREEN}  ✅ Dependencias instaladas${NC}"

if [ ! -f ".env" ]; then
    echo -e "${BLUE}  📝 Creando .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}  ✅ .env creado (actualiza DATABASE_URL)${NC}"
fi
echo ""

# Frontend Setup
echo -e "${BLUE}🎨 Configurando Frontend...${NC}"
cd ../frontend
echo -e "${BLUE}  📦 Instalando dependencias...${NC}"
npm install > /dev/null 2>&1
echo -e "${GREEN}  ✅ Dependencias instaladas${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${BLUE}  📝 Creando .env.local...${NC}"
    cat > .env.local << EOF
VITE_API_URL=http://localhost:3001/api
VITE_DEBUG=true
EOF
    echo -e "${GREEN}  ✅ .env.local creado${NC}"
fi
echo ""

# Database Setup
echo -e "${BLUE}📊 Configurando Base de Datos...${NC}"
echo -e "${YELLOW}Asegúrate de que PostgreSQL esté corriendo${NC}"
echo ""
echo -e "${BLUE}Ejecuta esto en psql si es primera vez:${NC}"
echo "  createdb controlbook"
echo ""

# Final Instructions
echo -e "${GREEN}✨ Setup completado!${NC}"
echo ""
echo -e "${BLUE}Para iniciar:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Accede a: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}Credenciales demo:${NC}"
echo "  Email: admin@controlbook.es"
echo "  Password: admin123"
echo ""
echo -e "${GREEN}🚀 ¡Listo para desarrollar!${NC}"
