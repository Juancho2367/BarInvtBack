import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

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
        allowedOrigins: ['https://bar-invt-front.vercel.app', 'https://bar-invt-front-2gcdivcpm-juan-davids-projects-3cf28ed7.vercel.app'],
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
  const allowedOrigins = [
    'https://bar-invt-front.vercel.app',
    'https://bar-invt-front-2gcdivcpm-juan-davids-projects-3cf28ed7.vercel.app'
  ];
  
  if (origin && !allowedOrigins.includes(origin) && !origin.startsWith('http://localhost') && !origin.includes('bar-invt-front')) {
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