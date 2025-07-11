const { execSync } = require('child_process');

console.log('🚀 Ejecutando migraciones y seed de la base de datos...');

try {
  console.log('📦 Generando Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('🔄 Creando migraciones...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('🌱 Ejecutando seed para inicializar datos...');
  execSync('npx ts-node scripts/seed.ts', { stdio: 'inherit' });
  
  console.log('✅ Base de datos configurada correctamente');
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}