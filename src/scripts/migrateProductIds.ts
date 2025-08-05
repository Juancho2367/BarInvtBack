import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Script para migrar productos existentes y asegurar que tengan el campo 'id'
async function migrateProductIds() {
  try {
    // Debug: Mostrar información sobre variables de entorno
    logger.info('🔍 Verificando variables de entorno...');
    logger.info(`NODE_ENV: ${process.env.NODE_ENV || 'no configurado'}`);
    logger.info(`MONGODB_URI existe: ${process.env.MONGODB_URI ? 'Sí' : 'No'}`);
    
    // Verificar que existe la URI de MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está configurada en las variables de entorno. Asegúrate de que el archivo .env existe y contiene MONGODB_URI.');
    }

    // Conectar a MongoDB usando la misma configuración que el servidor
    logger.info('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Conectado a MongoDB para migración');

    // Obtener todos los productos
    const products = await Product.find({});
    logger.info(`📦 Encontrados ${products.length} productos para migrar`);

    if (products.length === 0) {
      logger.info('ℹ️  No hay productos para migrar');
      return;
    }

    let migratedCount = 0;
    
    // Procesar cada producto
    for (const product of products) {
      try {
        // Verificar si el producto ya tiene el campo 'id' como virtual
        const productObj = product.toObject();
        
        if (!productObj.id) {
          // Si no tiene 'id', forzar la regeneración del virtual
          await product.save();
          migratedCount++;
          logger.info(`✅ Migrado producto: ${product.name} (ID: ${product.id})`);
        } else {
          logger.info(`✓ Producto ya tiene ID: ${product.name} (ID: ${product.id})`);
        }
      } catch (error) {
        logger.error(`❌ Error migrando producto ${product.name}:`, error);
      }
    }

    logger.info(`🎉 Migración completada: ${migratedCount} productos migrados de ${products.length} total`);

    // Verificar que todos los productos ahora tienen el campo 'id'
    const verificationProducts = await Product.find({});
    const productsWithId = verificationProducts.filter(p => p.toObject().id);
    
    logger.info(`✅ Verificación: ${productsWithId.length}/${verificationProducts.length} productos tienen campo 'id'`);

    if (productsWithId.length === verificationProducts.length) {
      logger.info('🎯 ¡Todos los productos han sido migrados exitosamente!');
    } else {
      logger.warn('⚠️  Algunos productos aún no tienen el campo "id". Revisa los logs de errores.');
    }

  } catch (error) {
    logger.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    logger.info('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar migración si el script se ejecuta directamente
if (require.main === module) {
  migrateProductIds()
    .then(() => {
      logger.info('🏁 Script de migración completado');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Error ejecutando script de migración:', error);
      process.exit(1);
    });
}

export { migrateProductIds };