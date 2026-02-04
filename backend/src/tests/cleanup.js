const pool = require('../config/database');

/**
 * Script para limpiar la base de datos
 * Elimina todos los datos pero mantiene la estructura de tablas
 */

async function cleanupDatabase() {
  const client = await pool.connect();

  try {
    console.log('\n=== LIMPIANDO BASE DE DATOS ===\n');

    await client.query('BEGIN');

    // Limpiar órdenes primero (tiene FK a otros)
    console.log('✓ Eliminando órdenes...');
    const ordersDelete = await client.query('DELETE FROM orders');
    console.log(`  ✓ ${ordersDelete.rowCount} órdenes eliminadas`);

    // Limpiar usuarios
    console.log('✓ Eliminando usuarios...');
    const usersDelete = await client.query('DELETE FROM users');
    console.log(`  ✓ ${usersDelete.rowCount} usuarios eliminados`);

    // Limpiar lockers
    console.log('✓ Eliminando lockers...');
    const lockersDelete = await client.query('DELETE FROM lockers');
    console.log(`  ✓ ${lockersDelete.rowCount} lockers eliminados`);

    // Limpiar order_statuses
    console.log('✓ Eliminando estados de órdenes...');
    const statusesDelete = await client.query('DELETE FROM order_statuses');
    console.log(`  ✓ ${statusesDelete.rowCount} estados eliminados`);

    // Limpiar roles
    console.log('✓ Eliminando roles...');
    const rolesDelete = await client.query('DELETE FROM roles');
    console.log(`  ✓ ${rolesDelete.rowCount} roles eliminados`);

    await client.query('COMMIT');

    console.log('\n✅ BASE DE DATOS LIMPIADA EXITOSAMENTE\n');
    console.log('Ahora puedes ejecutar: npm run test:crud\n');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n✗ ERROR DURANTE LA LIMPIEZA:');
    console.error(err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

cleanupDatabase();
