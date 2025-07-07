# Backend - Sistema de Inventario

Backend para el sistema de gestión de inventario de bar desarrollado con Node.js, Express, TypeScript y MongoDB.

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/inventario-bar

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Base de Datos

#### Opción A: MongoDB Local

1. **Instala MongoDB**:
   - **Windows**: Descarga desde [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: `sudo apt install mongodb`

2. **Inicia MongoDB**:
   - **Windows**: El servicio se inicia automáticamente después de la instalación
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongodb`

3. **Verifica que MongoDB esté ejecutándose**:
   ```bash
   mongosh
   # Deberías ver el prompt de MongoDB
   ```

#### Opción B: MongoDB Atlas (Recomendado para producción)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito
3. Obtén la URL de conexión
4. Actualiza `MONGODB_URI` en tu archivo `.env`

#### Solución de Problemas de Conexión

Si obtienes el error `connect ECONNREFUSED`:

1. **Verifica que MongoDB esté ejecutándose**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services list | grep mongodb
   
   # Linux
   sudo systemctl status mongodb
   ```

2. **Verifica la URL de conexión** en tu archivo `.env`

3. **Para MongoDB local**, usa:
   ```env
   MONGODB_URI=mongodb://localhost:27017/inventario-bar
   ```

4. **Para MongoDB Atlas**, usa:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventario-bar?retryWrites=true&w=majority
   ```

### 4. Crear Usuarios de Prueba

```bash
npm run seed
```

Esto creará:
- ✅ Usuario administrador: `admin` / `admin123`
- ✅ Usuario manager: `manager` / `manager123`
- ✅ Usuario normal: `user` / `user123`

**Nota**: El script solo crea usuarios y no modifica los productos existentes en la base de datos.

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Testing
npm test

# Linting
npm run lint

# Formateo
npm run format

# Crear usuarios de prueba
npm run seed

# Verificar conexión a MongoDB
npm run check-mongo
```

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── database.ts          # Configuración de MongoDB
├── controllers/
│   ├── authController.ts    # Controlador de autenticación
│   ├── productController.ts # Controlador de productos
│   ├── saleController.ts    # Controlador de ventas
│   └── clientController.ts  # Controlador de clientes
├── middleware/
│   ├── auth.ts              # Middleware de autenticación JWT
│   ├── errorHandler.ts      # Manejo de errores
│   └── rateLimiter.ts       # Rate limiting
├── models/
│   ├── User.ts              # Modelo de usuario
│   ├── Product.ts           # Modelo de producto
│   ├── Sale.ts              # Modelo de venta
│   └── Client.ts            # Modelo de cliente
├── routes/
│   ├── authRoutes.ts        # Rutas de autenticación
│   ├── productRoutes.ts     # Rutas de productos
│   ├── saleRoutes.ts        # Rutas de ventas
│   ├── clientRoutes.ts      # Rutas de clientes
│   └── index.ts             # Router principal
├── scripts/
│   └── seedData.ts          # Script para crear usuarios
├── utils/
│   └── logger.ts            # Configuración de logging
└── index.ts                 # Archivo principal
```

## 🔐 Autenticación

### Endpoints de Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil (protegido)
- `PUT /api/auth/profile` - Actualizar perfil (protegido)
- `PUT /api/auth/change-password` - Cambiar contraseña (protegido)
- `POST /api/auth/logout` - Cerrar sesión (protegido)

### Credenciales de Prueba

- **Super Admin**: `superadmin` / `superadmin123` (Acceso completo + Reportes)
- **Admin**: `admin` / `admin123` (Acceso limitado, sin reportes)
- **Manager**: `manager` / `manager123`
- **User**: `user` / `user123`

### Protección de Rutas

Las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

## 📊 API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/low-stock` - Productos con stock bajo

### Ventas
- `GET /api/sales` - Obtener todas las ventas
- `POST /api/sales` - Crear venta
- `GET /api/sales/:id` - Obtener venta por ID

### Clientes
- `GET /api/clients` - Obtener todos los clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients/:id` - Obtener cliente por ID

## 🔧 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **Zod** - Validación de esquemas
- **Winston** - Logging
- **Helmet** - Seguridad
- **CORS** - Cross-origin resource sharing

## 🚀 Deploy en Vercel

### Configuración

1. **Variables de Entorno en Vercel:**
   - `MONGODB_URI` - URL de MongoDB Atlas
   - `JWT_SECRET` - Clave secreta para JWT
   - `NODE_ENV` - `production`

2. **Build Command:**
   ```bash
   npm run build
   ```

3. **Output Directory:**
   ```
   dist
   ```

### MongoDB Atlas

Para usar MongoDB Atlas:

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster
3. Obtén la URL de conexión
4. Configura la variable `MONGODB_URI` en Vercel

## 🔒 Seguridad

- **JWT Tokens** para autenticación
- **bcrypt** para hash de contraseñas
- **Helmet** para headers de seguridad
- **Rate Limiting** para prevenir spam
- **CORS** configurado
- **Validación** con Zod
- **Logging** de actividades

## 📝 Logs

Los logs se guardan en:
- `combined.log` - Todos los logs
- `error.log` - Solo errores

## 🧪 Testing

```bash
npm test
```

## 📄 Licencia

MIT 