import { getAllowedOrigins, isOriginAllowed } from '../config/cors';

/**
 * Script de utilidad para gestionar URLs de CORS
 * Uso: npm run manage-cors
 */

console.log('🔧 Gestión de URLs de CORS');
console.log('========================');

// Mostrar configuración actual
const config = getAllowedOrigins();
console.log('\n📋 Configuración Actual:');
console.log(`Patrón: ${config.pattern}`);
console.log(`Descripción: ${config.description}`);
console.log('\n📝 URLs Permitidas:');
config.whitelist.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

// Función para probar una URL
const testUrl = (url: string) => {
  const isAllowed = isOriginAllowed(url);
  console.log(`\n🧪 Probando URL: ${url}`);
  console.log(`✅ Permitida: ${isAllowed ? 'SÍ' : 'NO'}`);
  return isAllowed;
};

// Probar URLs conocidas
console.log('\n🧪 Pruebas de URLs:');
testUrl('https://bar-invt-front.vercel.app');
testUrl('https://bar-invt-front-2gcdivcpm-juan-davids-projects-3cf28ed7.vercel.app');
testUrl('https://bar-invt-front-nueva-preview.vercel.app'); // URL de ejemplo
testUrl('http://localhost:5173'); // Desarrollo local
testUrl('https://malicious-site.com'); // URL maliciosa

console.log('\n📝 Instrucciones:');
console.log('1. Para añadir una nueva URL de preview:');
console.log('   - Edita el archivo back/src/config/cors.ts');
console.log('   - Añade la URL al array allowedOrigins');
console.log('   - Redeploya el backend');
console.log('\n2. Para URLs de preview futuras:');
console.log('   - El patrón automático detectará URLs que contengan:');
console.log('     * "bar-invt-front"');
console.log('     * "vercel.app"');

export { testUrl }; 