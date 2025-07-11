import cors from 'cors';
import { logger } from '../utils/logger';
import { getCorsConfig, getAllowedOrigins } from './environment';

// Configuración de CORS siguiendo las mejores prácticas de seguridad
export const corsOptions = getCorsConfig();

// Middleware de CORS configurado
export const corsMiddleware = cors(corsOptions);

// Función para validar un origen específico
export const isValidOrigin = (origin: string): boolean => {
  return getAllowedOrigins().includes(origin);
}; 