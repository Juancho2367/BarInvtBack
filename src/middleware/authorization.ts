import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Define role hierarchy
const roleHierarchy = {
  superadmin: 4,
  admin: 3,
  manager: 2,
  user: 1
};

// Middleware to check if user has minimum required role
export const requireRole = (minimumRole: keyof typeof roleHierarchy) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        return res.status(401).json({ 
          message: 'No autorizado - Usuario no autenticado' 
        });
      }

      const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
      const requiredRoleLevel = roleHierarchy[minimumRole];

      if (userRoleLevel < requiredRoleLevel) {
        logger.warn(`Acceso denegado: Usuario ${user.username} (${user.role}) intentó acceder a recurso que requiere ${minimumRole}`);
        return res.status(403).json({ 
          message: 'Acceso denegado - Permisos insuficientes',
          requiredRole: minimumRole,
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      logger.error('Error en middleware de autorización:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};

// Middleware específico para acceso a reportes (solo superadmin)
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ 
        message: 'No autorizado - Usuario no autenticado' 
      });
    }

    if (user.role !== 'superadmin') {
      logger.warn(`Acceso denegado a reportes: Usuario ${user.username} (${user.role}) intentó acceder a reportes`);
      return res.status(403).json({ 
        message: 'Acceso denegado - Solo super administradores pueden acceder a reportes',
        userRole: user.role
      });
    }

    next();
  } catch (error) {
    logger.error('Error en middleware de superadmin:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Middleware para verificar si usuario puede acceder a inventario
export const canAccessInventory = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ 
        message: 'No autorizado - Usuario no autenticado' 
      });
    }

    // Solo superadmin, admin y manager pueden acceder al inventario
    const allowedRoles = ['superadmin', 'admin', 'manager'];
    
    if (!allowedRoles.includes(user.role)) {
      logger.warn(`Acceso denegado a inventario: Usuario ${user.username} (${user.role})`);
      return res.status(403).json({ 
        message: 'Acceso denegado - No tienes permisos para acceder al inventario',
        userRole: user.role
      });
    }

    next();
  } catch (error) {
    logger.error('Error en middleware de inventario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Utility function to get user permissions
export const getUserPermissions = (role: string) => {
  const permissions = {
    superadmin: {
      canAccessReports: true,
      canAccessInventory: true,
      canManageUsers: true,
      canViewSales: true,
      canManageProducts: true,
      canDeleteRecords: true
    },
    admin: {
      canAccessReports: false,
      canAccessInventory: true,
      canManageUsers: false,
      canViewSales: true,
      canManageProducts: true,
      canDeleteRecords: false
    },
    manager: {
      canAccessReports: false,
      canAccessInventory: true,
      canManageUsers: false,
      canViewSales: true,
      canManageProducts: false,
      canDeleteRecords: false
    },
    user: {
      canAccessReports: false,
      canAccessInventory: false,
      canManageUsers: false,
      canViewSales: false,
      canManageProducts: false,
      canDeleteRecords: false
    }
  };

  return permissions[role as keyof typeof permissions] || permissions.user;
}; 