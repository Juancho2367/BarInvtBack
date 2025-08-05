import cors from 'cors';
import { logger } from '../utils/logger';

// Lista de dominios permitidos - Solución Permanente y Mantenible
const allowedOrigins = [
  // URLs de producción
  'https://bar-invt-front.vercel.app',
  
  // URLs de preview conocidas
  'https://bar-invt-front-2gcdivcpm-juan-davids-projects-3cf28ed7.vercel.app',
  'http://localhost:5173',
  // URLs adicionales desde variables de entorno
  process.env.FRONTEND_URL,
  process.env.FRONTEND_VERCEL_URL,
  
  // Patrón para URLs de preview futuras (más flexible)
  // Cualquier URL que contenga 'bar-invt-front' y 'vercel.app'
].filter(Boolean); // Filtrar valores undefined

// Configuración CORS optimizada y permanente
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permite solicitudes sin origen (ej. Postman, curl, mobile apps)
    if (!origin) {
      logger.info('[CORS] Allowing request without origin');
      return callback(null, true);
    }
    
    // En desarrollo, permite localhost
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost')) {
      logger.info(`[CORS] Allowing localhost in development: ${origin}`);
      return callback(null, true);
    }
    
    // Verificar si el origen está en la lista blanca
    if (allowedOrigins.includes(origin)) {
      logger.info(`[CORS] Allowing whitelisted origin: ${origin}`);
      return callback(null, true);
    }
    
    // Verificar si es una URL de Vercel con patrón similar (para previews futuras)
    if (origin.includes('bar-invt-front') && origin.includes('vercel.app')) {
      logger.info(`[CORS] Allowing Vercel preview origin: ${origin}`);
      return callback(null, true);
    }
    
    // Si no coincide, rechazar la solicitud
    logger.warn(`[CORS] Blocked request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Permite credenciales (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Origin',
    'Accept',
    'Cache-Control',
    'X-File-Name',
    'x-request-id',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With', 'Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 horas
  optionsSuccessStatus: 200 // Algunos navegadores legacy necesitan 200 en lugar de 204
};

// Middleware CORS principal usando la librería cors
export const corsMiddleware = cors(corsOptions);

// Función para obtener información de CORS (útil para debugging)
export const getAllowedOrigins = (): { 
  whitelist: string[], 
  pattern: string, 
  description: string 
} => {
  return {
    whitelist: allowedOrigins as string[],
    pattern: 'bar-invt-front.vercel.app + preview URLs',
    description: 'Permanent whitelist for Vercel frontend URLs (production + preview)'
  };
};

// Función para verificar si un origen está permitido (útil para testing)
export const isOriginAllowed = (origin: string): boolean => {
  return allowedOrigins.includes(origin) || 
         (origin.includes('bar-invt-front') && origin.includes('vercel.app'));
}; 