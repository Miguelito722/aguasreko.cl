# Configuración de Google OAuth en Supabase

## Pasos para configurar la autenticación de Google

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú de navegación, ve a **APIs y Servicios** > **Credenciales**

### 2. Crear credenciales de OAuth 2.0

1. Haz clic en **+ Crear credenciales** > **ID de cliente de OAuth**
2. Si aparece un mensaje, primero configura la pantalla de consentimiento:
   - Tipo de usuario: "Externo"
   - Completa los campos requeridos (nombre de la aplicación, email de soporte, etc.)
3. Vuelve a Credenciales y crea un **ID de cliente de OAuth**
4. Tipo de aplicación: **Aplicación web**

### 3. Configurar URLs autorizadas

En las Credenciales de OAuth, agrega las siguientes URLs:

**URIs de redireccionamiento autorizados:**
```
https://[PROJECT_ID].supabase.co/auth/v1/callback?provider=google
```

Reemplaza `[PROJECT_ID]` con tu ID de proyecto Supabase.

### 4. Copiar las credenciales

De la credencial creada, copia:
- **Client ID**
- **Client Secret**

### 5. Configurar en Supabase

1. Ve a tu [Supabase Dashboard](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a **Autenticación** > **Proveedores**
4. Busca y habilita **Google**
5. Pega tu **Client ID** y **Client Secret**
6. Haz clic en **Guardar**

### 6. Verificar la configuración

- El botón "Iniciar sesión con Google" debe estar disponible en:
  - Modal de autenticación (botón de login)
  - Página `/login`

## Notas importantes

- Asegúrate de que el **Client ID** y **Client Secret** son correctos
- Las URLs de redireccionamiento deben coincidir exactamente con las configuradas en Google
- Después de configurar, los usuarios podrán registrarse e iniciar sesión con su cuenta de Google
- El perfil del usuario se completará automáticamente con la información de Google

## Prueba en desarrollo

Para pruebas locales, usa:
```
http://localhost:5173/auth/v1/callback?provider=google
```

Asegúrate de agregar esto también en Google Cloud Console en las URIs de redireccionamiento autorizados.
