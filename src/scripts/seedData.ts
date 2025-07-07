import mongoose from 'mongoose';
import { User } from '../models/User';
import { logger } from '../utils/logger';

// Super Admin user data (acceso completo incluyendo reportes)
const superAdminUser = {
  username: 'superadmin',
  email: 'superadmin@bar.com',
  password: 'superadmin123',
  role: 'superadmin' as const,
  isActive: true,
};

// Admin user data (acceso limitado, sin reportes)
const adminUser = {
  username: 'admin',
  email: 'admin@bar.com',
  password: 'admin123',
  role: 'admin' as const,
  isActive: true,
};

// Additional test users
const testUsers = [
  {
    username: 'manager',
    email: 'manager@bar.com',
    password: 'manager123',
    role: 'manager' as const,
    isActive: true,
  },
  {
    username: 'user',
    email: 'user@bar.com',
    password: 'user123',
    role: 'user' as const,
    isActive: true,
  },
];

async function seedUsers() {
  try {
    // Connect to MongoDB with better error handling
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://juandavidq2367:kypgvQSHcYu1ZnLu@clusterinvt.hio00gd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterInvt';
    
    logger.info(`Attempting to connect to MongoDB at: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    
    logger.info('✅ Connected to MongoDB successfully');

    // Check if super admin user already exists
    const existingSuperAdmin = await User.findOne({ username: 'superadmin' });
    if (existingSuperAdmin) {
      logger.info('ℹ️  Super Admin user already exists, skipping user creation');
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
      process.exit(0);
    }

    // Create super admin user
    const superAdmin = await User.create(superAdminUser);
    logger.info(`✅ Created super admin user: ${superAdmin.username}`);

    // Create admin user
    const admin = await User.create(adminUser);
    logger.info(`✅ Created admin user: ${admin.username}`);

    // Create test users
    const users = await User.create(testUsers);
    logger.info(`✅ Created ${users.length} test users`);

    // Log the created data
    logger.info('🎉 Users seeded successfully!');
    logger.info('=== Credenciales de Acceso ===');
    logger.info(`Super Admin: ${superAdminUser.username} / ${superAdminUser.password} (Acceso completo + Reportes)`);
    logger.info(`Admin: ${adminUser.username} / ${adminUser.password} (Acceso limitado, sin reportes)`);
    logger.info(`Manager: ${testUsers[0].username} / ${testUsers[0].password}`);
    logger.info(`User: ${testUsers[1].username} / ${testUsers[1].password}`);
    logger.info('==============================');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');

    process.exit(0);
  } catch (error: any) {
    if (error.name === 'MongooseServerSelectionError') {
      logger.error('❌ Error: No se puede conectar a MongoDB');
      logger.error('📋 Soluciones posibles:');
      logger.error('   1. Asegúrate de que MongoDB esté instalado y ejecutándose');
      logger.error('   2. Verifica que la URL de conexión sea correcta');
      logger.error('   3. Si usas MongoDB local: mongod --dbpath /ruta/a/tu/db');
      logger.error('   4. Si usas MongoDB Atlas: verifica tu MONGODB_URI en .env');
      logger.error('');
      logger.error('🔧 Para instalar MongoDB localmente:');
      logger.error('   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/');
      logger.error('   - macOS: brew install mongodb-community');
      logger.error('   - Linux: sudo apt install mongodb');
    } else {
      logger.error('❌ Error seeding users:', error);
    }
    process.exit(1);
  }
}

// Run the seed function
seedUsers(); 