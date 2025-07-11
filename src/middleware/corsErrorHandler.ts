import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Expresión regular para validar orígenes de Vercel
const corsOriginRegex = /^https:\/\/bar-invt-front(-[a-zA-Z0-9]+(-juan-davids-projects-[a-zA-Z0-9]+)?)?\.vercel\.app$/;

// CORS error handler
export const corsErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    logger.warn(`CORS Error: ${req.method} ${req.path} from ${req.get('Origin') || 'unknown origin'}`);
    
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
      details: {
        pattern: corsOriginRegex.toString(),
        requestMethod: req.method,
        requestPath: req.path,
        userAgent: req.headers['user-agent']
      }
    });
  }
  
  next(err);
};

// CORS logging middleware
export const corsLogger = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const method = req.method;
  const path = req.path;
  
  logger.info(`[CORS] ${method} ${path} - Origin: ${origin || 'No origin'} - IP: ${req.ip}`);
  
  // Log CORS violations
  if (origin && !corsOriginRegex.test(origin) && !origin.startsWith('http://localhost')) {
    logger.warn(`[CORS WARNING] Unusual origin: ${origin} for ${method} ${path}`);
  }
  
  next();
};

// Función para verificar si una solicitud es preflight
export const isPreflightRequest = (req: Request): boolean => {
  return req.method === 'OPTIONS' && 
         (!!req.headers['access-control-request-method'] || 
          !!req.headers['access-control-request-headers']);
}; 