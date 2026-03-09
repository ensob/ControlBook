# 🎨 ControlBook - Design System

## Paleta de Colores

### Naranjas (Primarios)
```css
--color-orange-50: #FFF7ED
--color-orange-100: #FFEDD5
--color-orange-300: #FDBA74
--color-orange-500: #F97316    ← Principal
--color-orange-600: #EA580C
--color-orange-700: #C2410C
--color-orange-900: #7C2D12
```

### Acentos
```css
--color-accent-orange: #FF6B35    ← Street Urban
--color-accent-neon: #FFA500      ← Neón
--color-dark: #1A1A1A
--color-light: #F5F5F5
```

### Neutrales
```css
--color-gray-50: #F9FAFB
--color-gray-100: #F3F4F6
--color-gray-600: #4B5563
--color-gray-900: #111827
```

## Tipografía

```
Sistema: Inter, system-ui, sans-serif

Tamaños:
- Heading 1: 48px (font-black)
- Heading 2: 32px (font-bold)
- Heading 3: 24px (font-bold)
- Body: 16px (regular)
- Small: 14px (regular)
- Tiny: 12px (regular)
```

## Componentes

### Botones

#### Primary
```html
<button class="btn-primary">
  🚀 Acción Principal
</button>
```

#### Secondary
```html
<button class="btn-secondary">
  ↩️ Volver
</button>
```

#### Danger
```html
<button class="bg-red-500 text-white hover:bg-red-600">
  🗑️ Eliminar
</button>
```

### Cards

```html
<div class="card">
  <!-- Contenido -->
</div>
```

### Inputs

```html
<input class="input-field" placeholder="...">
<textarea class="input-field"></textarea>
<select class="input-field">...</select>
```

## Animaciones

### Fade In
```css
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
```

### Slide Up
```css
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

### Bounce
```css
animate={{ y: [0, -5, 0] }}
transition={{ duration: 1, repeat: Infinity }}
```

## Iconografía

Usamos emojis para mantener visual moderno:

- 📖 ControlBook
- 🎓 Educación
- 👥 Usuarios/Equipo
- ✅ Presente
- ❌ Ausente
- 📊 Reportes
- ⚙️ Configuración
- 🎭 Danza/Arte
- 🎬 Producción
- 🎥 Realización
- 🎵 DJ/Música

## Espaciado

```css
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

## Border Radius

```css
rounded-lg: 8px (inputs, buttons)
rounded-lg: 12px (cards)
rounded-2xl: 16px (large elements)
```

## Sombras

```css
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow-md: 0 4px 6px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
```

## Responsive Breakpoints

```
base: 0px (mobile)
sm: 640px
md: 768px (tablet)
lg: 1024px (desktop)
xl: 1280px
2xl: 1536px
```

## Estado Visual

### Hover
Desaturación +10%, elevación +1

### Focus
Ring naranja de 2px, outline: none

### Disabled
Opacidad 50%, cursor not-allowed

### Active
Color primario más oscuro

## Accesibilidad

- ✅ Color contrast ratio > 4.5:1
- ✅ Focus indicators visibles
- ✅ Keyboard navigation
- ✅ ARIA labels donde aplique
- ✅ Reducido motion respetado

---

**Última actualización**: 2026-03-09
