import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Middleware para manejar errores de CORS de manera específica
export const corsErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Verificar si es un error de CORS
  if (err.message === 'No permitido por CORS') {
    logger.warn(`CORS Error: ${req.method} ${req.path} from ${req.get('Origin') || 'unknown origin'}`);
    
    return res.status(403).json({
      error: 'CORS Error',
      message: 'El origen de la solicitud no está permitido',
      details: {
        origin: req.get('Origin'),
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Si no es un error de CORS, pasar al siguiente middleware
  next(err);
};

// Middleware para logging de solicitudes CORS
export const corsLogger = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin');
  const method = req.method;
  const path = req.path;

  // Log solo solicitudes CORS (con origen)
  if (origin) {
    logger.info(`CORS Request: ${method} ${path} from ${origin}`);
  }

  next();
};

// Función para verificar si una solicitud es preflight
export const isPreflightRequest = (req: Request): boolean => {
  return req.method === 'OPTIONS' && 
         (!!req.headers['access-control-request-method'] || 
          !!req.headers['access-control-request-headers']);
}; 