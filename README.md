# Aguas Reko - Sitio Web Oficial

## 📁 Estructura de Imágenes

### `/public/images/`

#### `products/` - Imágenes de productos
- `bidon-retornable-20l.jpg` - Bidón retornable principal
- `dispensador-electrico.jpg` - Dispensador eléctrico con agua fría/caliente
- `pack-botellas-500ml.jpg` - Pack de 12 botellas de 500ml
- `bidon-premium-20l.jpg` - Bidón premium de 20L
- `dispensador-compacto.jpg` - Dispensador compacto
- `bidon-familiar-20l.jpg` - Bidón familiar de 20L
- `producto-extra.jpg` - Producto adicional

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