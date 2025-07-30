# Aguas Reko - Sitio Web Oficial

## 📁 Estructura de Imágenes

### `/public/images/`

#### `products/` - Imágenes de productos
- `bidon-retornable-20l.jpg` - Bidón Retornable 20L
- `dispensador-electrico.jpg` - Dispensador Eléctrico
- `pack-12-botellas-500ml.jpg` - Pack 12 Botellas 500ml
- `bidon-20l-premium.jpg` - Bidón 20L Premium
- `dispensador-compacto.jpg` - Dispensador Compacto
- `bidon-familiar-20l.jpg` - Bidón Familiar 20L

#### `hero/` - Imágenes principales
- `familia-brindando.png` - Imagen principal del hero (familia brindando)

#### `general/` - Imágenes generales y placeholders
- `placeholder.png` - Imagen placeholder principal
- `placeholder-2.png` - Imagen placeholder alternativa 2
- `placeholder-3.png` - Imagen placeholder alternativa 3
- `placeholder-4.png` - Imagen placeholder alternativa 4
- `logo-alt.png` - Logo alternativo
- `unnamed-image.jpg` - Imagen sin nombre específico

## 🔧 Uso de Imágenes

### En Productos:
```typescript
// Ejemplo de uso en productos
image: '/images/products/bidon-retornable-20l.jpg'
```

### En Hero:
```typescript
// Imagen principal del hero
src="/images/hero/familia-brindando.png"
```

### Placeholders:
```typescript
// Imagen de respaldo cuando falla la carga
e.currentTarget.src = '/images/general/placeholder.png';
```

## 📝 Convenciones de Nombres

- **Productos**: `nombre-descriptivo-especificaciones.jpg`
- **Hero**: `descripcion-contexto.png`
- **General**: `tipo-numero.png` o `descripcion.jpg`

## 🚀 Optimización

- Todas las imágenes están organizadas por categoría
- Nombres descriptivos y SEO-friendly
- Estructura escalable para futuras imágenes
- Referencias actualizadas en todo el código