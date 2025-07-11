import { logger } from '../utils/logger';

// Script para ayudar a encontrar la URL correcta del backend
console.log('🔍 Buscando URL del backend...\n');

// Posibles URLs de Vercel basadas en el nombre del proyecto
const possibleUrls = [
  'https://inventario-bar-backend.vercel.app',
  'https://inventario-bar-back.vercel.app',
  'https://bar-inventory-backend.vercel.app',
  'https://bar-inventory-back.vercel.app',
  'https://inventario-bar.vercel.app',
  'https://bar-invt-backend.vercel.app',
  'https://bar-invt-back.vercel.app',
];

console.log('📋 URLs posibles del backend:');
possibleUrls.forEach((url, index) => {
  console.log(`  ${index + 1}. ${url}`);
});

console.log('\n🔧 Para configurar correctamente:');
console.log('\n1. Encuentra la URL real de tu backend en Vercel Dashboard');
console.log('2. Configura las variables de entorno en Vercel:');
console.log('\n   Backend (Vercel Dashboard):');
console.log('   - FRONTEND_URL=https://bar-invt-front.vercel.app');
console.log('   - FRONTEND_VERCEL_URL=https://bar-invt-front.vercel.app');
console.log('   - JWT_SECRET=tu-super-secreto-jwt-muy-seguro-y-largo');
console.log('   - MONGODB_URI=tu-uri-de-mongodb');
console.log('\n   Frontend (Vercel Dashboard):');
console.log('   - VITE_API_URL=https://TU-BACKEND-REAL.vercel.app/api');

console.log('\n3. Reemplaza "TU-BACKEND-REAL" con la URL real de tu backend');
console.log('\n4. Después de configurar las variables, redeploya ambos proyectos');

console.log('\n💡 Tip: La URL del backend aparece en Vercel Dashboard > Deployments > Latest'); 