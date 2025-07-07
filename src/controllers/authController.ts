import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, userSchema, loginSchema, IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;

    // Find user by username
    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString(), user.role);

    // Log successful login
    logger.info(`User ${username} logged in successfully`);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: (user._id as any).toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: validatedData.username }, { email: validatedData.email }]
    });

    if (existingUser) {
      throw new AppError('El usuario o email ya existe', 400);
    }

    // Create new user
    const user = await User.create(validatedData);

    // Generate token
    const token = generateToken((user._id as any).toString(), user.role);

    logger.info(`New user ${user.username} registered successfully`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: (user._id as any).toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const { username, email } = req.body;

    // Check if username or email already exists
    if (username || email) {
      const existingUser = await User.findOne({
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : []),
        ],
        _id: { $ne: userId }
      });

      if (existingUser) {
        throw new AppError('El usuario o email ya existe', 400);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Contraseña actual y nueva contraseña son requeridas', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('La nueva contraseña debe tener al menos 6 caracteres', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AppError('Contraseña actual incorrecta', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente',
    });
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Logout (client-side token removal)
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (userId) {
      logger.info(`User ${userId} logged out`);
    }

    res.json({
      success: true,
      message: 'Logout exitoso',
    });
  } catch (error) {
    next(error);
  }
}; 