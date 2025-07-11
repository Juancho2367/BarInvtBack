import cors from 'cors';
import { logger } from '../utils/logger';

// Expresión regular para validar orígenes de Vercel
// Acepta:
// 1. https://bar-invt-front.vercel.app (Producción)
// 2. https://bar-invt-front-xxxxxxxx.vercel.app (Cualquier vista previa)
// 3. https://bar-invt-front-xxxxxxxx-juan-davids-projects-xxxxxxxx.vercel.app (Vistas previa con hash largo)
const corsOriginRegex = /^https:\/\/bar-invt-front(-[a-zA-Z0-9]+(-juan-davids-projects-[a-zA-Z0-9]+)?)?\.vercel\.app$/;

// Configuración CORS optimizada con regex
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permite solicitudes sin origen (ej. Postman, curl, mobile apps)
    if (!origin) {
      return callback(null, true);
    }
    
    // En desarrollo, permite localhost
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    
    // Valida el origen contra nuestra expresión regular
    if (corsOriginRegex.test(origin)) {
      return callback(null, true); // Origen permitido
    }
    
    // Si no coincide, rechazar la solicitud
    console.warn(`CORS blocked request from origin: ${origin}`);
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
    pattern: corsOriginRegex.toString(),
    description: 'Regex pattern for Vercel frontend URLs (production + preview)'
  };
}; 