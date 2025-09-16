# Configuración de Google OAuth para Testis

Esta guía te ayudará a configurar la autenticación con Google para permitir que solo usuarios con cuentas @usal.edu.ar accedan al chatbot Testis.

## 🚀 Pasos para Configurar Google OAuth

### 1. Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Dale un nombre como "Testis USAL Auth"

### 2. Habilitar Google+ API

1. En el panel izquierdo, ve a **APIs & Services > Library**
2. Busca "Google+ API" y habilítala
3. También busca y habilita "Google OAuth2 API"

### 3. Configurar OAuth Consent Screen

1. Ve a **APIs & Services > OAuth consent screen**
2. Selecciona **External** (a menos que tengas Google Workspace)
3. Completa la información requerida:
   - **App name**: Testis - Asistente SIU USAL
   - **User support email**: Tu email
   - **Developer contact information**: Tu email
4. En **Authorized domains**, agrega:
   - `usal.edu.ar`
   - `localhost` (para desarrollo)
   - Tu dominio de producción

### 4. Crear Credenciales OAuth

1. Ve a **APIs & Services > Credentials**
2. Haz clic en **Create Credentials > OAuth 2.0 Client IDs**
3. Selecciona **Web application**
4. Configura:
   - **Name**: Testis Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://tu-dominio.com/api/auth/callback/google`

### 5. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Completa las variables con los datos de Google:
   ```env
   # Autenticación Google OAuth para cuentas USAL
   GOOGLE_CLIENT_ID=tu_client_id_aqui
   GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
   
   # NextAuth configuración
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=genera_un_secret_aleatorio_aqui
   ```

### 6. Generar NEXTAUTH_SECRET

Ejecuta este comando para generar un secret seguro:
```bash
openssl rand -base64 32
```

O usa este comando de Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🔒 Configuración de Seguridad

### Restricción de Dominio USAL

El sistema está configurado para **solo permitir** emails que terminen en `@usal.edu.ar`. Esto se hace automáticamente en:

- **OAuth Config**: Con el parámetro `hd: "usal.edu.ar"`
- **Sign-in Callback**: Verificación adicional del dominio del email

### Testing de la Configuración

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:3000`

3. Haz clic en "Ingresar con USAL"

4. Prueba con:
   - ✅ Una cuenta @usal.edu.ar (debería funcionar)
   - ❌ Una cuenta @gmail.com (debería ser rechazada)

## 🚨 Problemas Comunes

### Error "Access Denied"
- Verifica que uses una cuenta @usal.edu.ar
- Asegúrate de que el dominio esté autorizado en Google Cloud Console

### Error "Redirect URI Mismatch"
- Verifica que las URIs de redirect coincidan exactamente
- Incluye tanto HTTP (desarrollo) como HTTPS (producción)

### Error de Variables de Entorno
- Verifica que todas las variables estén configuradas en `.env.local`
- No uses `.env.example`, crea `.env.local`

## 🔄 Flujo de Autenticación

1. **Usuario hace clic en "Ingresar con USAL"**
2. **Redirección a Google OAuth** con restricción de dominio USAL
3. **Google muestra pantalla de consentimiento** (solo para cuentas @usal.edu.ar)
4. **Callback a la aplicación** con token de autenticación
5. **Verificación adicional** del dominio del email
6. **Creación de sesión** con datos del usuario
7. **Redirección al inicio** con usuario logueado

## 📱 Características Implementadas

### Header Personalizado
- Botón de login/logout
- Información del usuario logueado
- Avatar del usuario

### Chatbot Personalizado
- Saludo personalizado con nombre del usuario
- Header del chat muestra el nombre
- Placeholder personalizado en el input

### Páginas de Autenticación
- `/auth/signin`: Página de login personalizada
- `/auth/error`: Manejo de errores de autenticación

¡Listo! Tu chatbot Testis ahora tiene autenticación segura con cuentas USAL. 🎉
