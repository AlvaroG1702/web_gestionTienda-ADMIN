/**
 * Script de uso único para generar hashes bcrypt reales
 * en los usuarios de prueba de ORUEL_DEV.
 *
 * Ejecutar: node api/src/scripts/reset-passwords.js
 * Contraseña por defecto: Oruel2024!
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { getConnection, sql } = require('../config/db');

const DEFAULT_PASSWORD = 'oruel';

async function main() {
  console.log('🔐 Generando hashes bcrypt...');
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  console.log(`✅ Hash generado para "${DEFAULT_PASSWORD}"`);

  const pool = await getConnection();

  // Actualizar TODOS los usuarios sin importar su hash actual
  const result = await pool.request()
    .input('hash', sql.VarChar(200), hash)
    .query(`
      UPDATE USUARIO
      SET Password_hash = @hash
    `);

  console.log(`✅ ${result.rowsAffected[0]} usuarios actualizados.`);
  console.log(`\nCredenciales de prueba:`);
  console.log(`  carlos@oruel.com   / ${DEFAULT_PASSWORD}  (superadmin)`);
  console.log(`  juan@donjuan.com   / ${DEFAULT_PASSWORD}  (admin - Bodega Don Juan)`);
  console.log(`  luz@mkluz.com      / ${DEFAULT_PASSWORD}  (admin - Minimarket Luz)`);
  console.log(`  rosa@rapidita.com  / ${DEFAULT_PASSWORD}  (admin - Tienda Rápida)`);
  console.log(`  ana@gmail.com      / ${DEFAULT_PASSWORD}  (cliente)`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
