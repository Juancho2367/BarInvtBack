// Configuración de variables de entorno para CORS y seguridad
export const environment = {
  // Configuración de CORS
  cors: {
    // Orígenes permitidos - separados por comas
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      // Desarrollo local
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
    // Orígenes de producción (se añaden automáticamente si están definidos)
    productionOrigins: [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_VERCEL_URL,
    ].filter(Boolean) as string[],
    // Patrón regex para URLs de Vercel (incluye vistas previas)
    vercelPattern: /^https:\/\/bar-invt-front(-[a-zA-Z0-9]+)?\.vercel\.app$/,
    // Patrón regex para cualquier URL de Vercel (más flexible)
    anyVercelPattern: /^https:\/\/.*\.vercel\.app$/,
  },

  // Configuración de seguridad
  security: {
    // Tiempo de expiración del token JWT
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    // Secret para JWT
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    // Tiempo de expiración del refresh token
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    // Secret para refresh token
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
  },

  // Configuración de la base de datos
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario-bar',
  },

  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Configuración de rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // límite de solicitudes por ventana
  },
};

// Función para obtener todos los orígenes permitidos
export const getAllowedOrigins = (): string[] => {
  const { allowedOrigins, productionOrigins } = environment.cors;
  return [...allowedOrigins, ...productionOrigins];
};

// Función para validar si un origen está permitido
export const isOriginAllowed = (origin: string): boolean => {
  return getAllowedOrigins().includes(origin);
};

// Función para obtener la configuración de CORS basada en el entorno
export const getCorsConfig = () => {
  const origins = getAllowedOrigins();
  const { vercelPattern, anyVercelPattern } = environment.cors;
  
  return {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Permitir solicitudes sin origin (como Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Permitir localhost en desarrollo
      if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost')) {
        return callback(null, true);
      }

      // Verificar si el origen está en la lista blanca
      if (origins.includes(origin)) {
        return callback(null, true);
      }

      // Verificar si coincide con el patrón específico de Vercel (incluye vistas previas)
      if (vercelPattern.test(origin)) {
        return callback(null, true);
      }

      // Verificar si es cualquier URL de Vercel (más flexible para desarrollo)
      if (anyVercelPattern.test(origin)) {
        return callback(null, true);
      }

      // Si no coincide con ninguna regla, rechazar
      callback(new Error('No permitido por CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400, // 24 horas
    optionsSuccessStatus: 200,
  };
}; 