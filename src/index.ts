import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './config/database';
import { corsMiddleware, corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import { corsErrorHandler, corsLogger } from './middleware/corsErrorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import routes from './routes';

// Load environment variables
config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware de seguridad
app.use(helmet({
  // Configuración específica de Helmet para CORS
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false, // Deshabilitar si necesitas cargar recursos externos
}));

// Aplicar CORS con configuración personalizada
app.use(corsMiddleware);

// Manejar solicitudes OPTIONS explícitamente para todas las rutas
app.options('*', corsMiddleware);

// Middleware adicional
app.use(express.json({ limit: '10mb' })); // Límite de tamaño para prevenir ataques
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(rateLimiter);

// Middleware de logging para CORS
app.use(corsLogger);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bar Inventory Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      sales: '/api/sales',
      reports: '/api/reports'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', routes);

// Error handling - CORS errors first, then general errors
app.use(corsErrorHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 