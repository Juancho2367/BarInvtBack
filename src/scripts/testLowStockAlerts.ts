import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Script para probar las alertas de stock bajo
async function testLowStockAlerts() {
  try {
    // Debug: Mostrar información sobre variables de entorno
    logger.info('🧪 Iniciando prueba de alertas de stock bajo...');
    logger.info(`MONGODB_URI existe: ${process.env.MONGODB_URI ? 'Sí' : 'No'}`);
    
    // Verificar que existe la URI de MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está configurada en las variables de entorno.');
    }

    // Conectar a MongoDB
    logger.info('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Conectado a MongoDB para pruebas');

    // Crear un producto de prueba con stock bajo
    const testProduct = new Product({
      name: 'Producto Test Stock Bajo',
      description: 'Producto creado para probar alertas de stock bajo',
      stock: 2, // Stock bajo
      unit: 'unidades',
      price: 1000,
      minStock: 5, // Mínimo mayor que el stock actual
      category: 'Prueba'
    });

    logger.info('📦 Creando producto de prueba con stock bajo...');
    await testProduct.save(); // Esto debería activar la alerta en el middleware
    logger.info(`✅ Producto creado: ${testProduct.name} (Stock: ${testProduct.stock}, Mínimo: ${testProduct.minStock})`);

    // Actualizar el stock para que esté aún más bajo
    logger.info('📉 Actualizando stock para estar aún más bajo...');
    testProduct.stock = 1;
    await testProduct.save(); // Esto debería activar otra alerta
    logger.info(`✅ Stock actualizado: ${testProduct.name} ahora tiene ${testProduct.stock} ${testProduct.unit}`);

    // Actualizar el stock para que esté bien
    logger.info('📈 Restaurando stock a nivel seguro...');
    testProduct.stock = 10;
    await testProduct.save(); // Esto NO debería activar alerta
    logger.info(`✅ Stock restaurado: ${testProduct.name} ahora tiene ${testProduct.stock} ${testProduct.unit}`);

    // Buscar todos los productos con stock bajo
    logger.info('🔍 Buscando productos con stock bajo...');
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock', '$minStock'] }
    });
    
    logger.info(`📊 Productos con stock bajo encontrados: ${lowStockProducts.length}`);
    lowStockProducts.forEach(product => {
      logger.warn(`🚨 ${product.name}: ${product.stock} ${product.unit} (mínimo: ${product.minStock})`);
    });

    // Limpiar - eliminar el producto de prueba
    logger.info('🧹 Limpiando producto de prueba...');
    await Product.findByIdAndDelete(testProduct._id);
    logger.info('✅ Producto de prueba eliminado');

    logger.info('🎉 Prueba de alertas de stock bajo completada exitosamente!');

  } catch (error) {
    logger.error('❌ Error durante la prueba:', error);
    throw error;
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    logger.info('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar prueba si el script se ejecuta directamente
if (require.main === module) {
  testLowStockAlerts()
    .then(() => {
      logger.info('🏁 Script de prueba completado');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Error ejecutando script de prueba:', error);
      process.exit(1);
    });
}

export { testLowStockAlerts };