import cors from 'cors';
import { logger } from '../utils/logger';

// Configuración CORS optimizada para Vercel
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permite solicitudes sin origen (ej. Postman, curl, mobile apps)
    if (!origin) {
      console.log('[CORS] Allowing request without origin');
      return callback(null, true);
    }
    
    // En desarrollo, permite localhost
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost')) {
      console.log(`[CORS] Allowing localhost in development: ${origin}`);
      return callback(null, true);
    }
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://bar-invt-front.vercel.app',
      'https://bar-invt-front-2gcdivcpm-juan-davids-projects-3cf28ed7.vercel.app',
      // Agregar cualquier URL adicional desde variables de entorno
      process.env.FRONTEND_URL,
      process.env.FRONTEND_VERCEL_URL
    ].filter(Boolean); // Filtrar valores undefined
    
    // Verificar si el origen está en la lista blanca
    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] Allowing origin: ${origin}`);
      return callback(null, true);
    }
    
    // Verificar si es una URL de Vercel con patrón similar
    if (origin.includes('bar-invt-front') && origin.includes('vercel.app')) {
      console.log(`[CORS] Allowing Vercel origin: ${origin}`);
      return callback(null, true);
    }
    
    // Si no coincide, rechazar la solicitud
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
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
export const getAllowedOrigins = (): { pattern: string, description: string } => {
  return {
    pattern: 'bar-invt-front.vercel.app + preview URLs',
    description: 'Whitelist for Vercel frontend URLs (production + preview)'
  };
}; 