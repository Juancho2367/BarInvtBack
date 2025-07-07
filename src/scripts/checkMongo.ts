import mongoose from 'mongoose';
import { logger } from '../utils/logger';

async function checkMongoConnection() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://juandavidq2367:kypgvQSHcYu1ZnLu@clusterinvt.hio00gd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterInvt';
    
    logger.info('🔍 Verificando conexión a MongoDB...');
    logger.info(`📍 URL: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    logger.info('✅ Conexión exitosa a MongoDB!');
    logger.info(`📊 Base de datos: ${mongoose.connection.db?.databaseName || 'N/A'}`);
    logger.info(`🔗 Host: ${mongoose.connection.host}`);
    logger.info(`🚪 Puerto: ${mongoose.connection.port}`);
    
    await mongoose.disconnect();
    logger.info('👋 Desconectado de MongoDB');
    
  } catch (error: any) {
    logger.error('❌ Error al conectar con MongoDB:');
    
    if (error.name === 'MongooseServerSelectionError') {
      logger.error('📋 Posibles soluciones:');
      logger.error('');
      logger.error('1. Verifica que MongoDB esté instalado y ejecutándose');
      logger.error('2. Para Windows: net start MongoDB');
      logger.error('3. Para macOS: brew services start mongodb-community');
      logger.error('4. Para Linux: sudo systemctl start mongodb');
      logger.error('');
      logger.error('5. Verifica que la URL de conexión sea correcta');
      logger.error('6. Si usas MongoDB Atlas, verifica tu MONGODB_URI');
      logger.error('');
      logger.error('🔧 Para instalar MongoDB:');
      logger.error('   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/');
      logger.error('   - macOS: brew install mongodb-community');
      logger.error('   - Linux: sudo apt install mongodb');
    } else {
      logger.error('Error detallado:', error.message);
    }
    
    process.exit(1);
  }
}

checkMongoConnection(); 