const pool = require('../config/database');

/**
 * Script de pruebas para validar la estructura de la base de datos
 */

async function runTests() {
  console.log('\n=== INICIANDO PRUEBAS DE BASE DE DATOS ===\n');

  try {
    // Test 1: Verificar conexión
    console.log('✓ Test 1: Verificando conexión a la base de datos...');
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('  ✓ Conexión exitosa:', connectionTest.rows[0].now);

    // Test 2: Verificar tabla de roles
    console.log('\n✓ Test 2: Verificando tabla de roles...');
    const rolesCheck = await pool.query(
      "SELECT * FROM information_schema.tables WHERE table_name = 'roles'"
    );
    if (rolesCheck.rows.length > 0) {
      console.log('  ✓ Tabla "roles" existe');
      const roles = await pool.query('SELECT * FROM roles');
      console.log(`  ✓ Registros en roles: ${roles.rows.length}`, roles.rows);
    } else {
      console.log('  ✗ Tabla "roles" no existe');
    }

    // Test 3: Verificar tabla de usuarios
    console.log('\n✓ Test 3: Verificando tabla de usuarios...');
    const usersCheck = await pool.query(
      "SELECT * FROM information_schema.tables WHERE table_name = 'users'"
    );
    if (usersCheck.rows.length > 0) {
      console.log('  ✓ Tabla "users" existe');
      const users = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`  ✓ Total de usuarios: ${users.rows[0].count}`);
    } else {
      console.log('  ✗ Tabla "users" no existe');
    }

    // Test 4: Verificar tabla de lockers
    console.log('\n✓ Test 4: Verificando tabla de lockers...');
    const lockersCheck = await pool.query(
      "SELECT * FROM information_schema.tables WHERE table_name = 'lockers'"
    );
    if (lockersCheck.rows.length > 0) {
      console.log('  ✓ Tabla "lockers" existe');
      const lockers = await pool.query('SELECT COUNT(*) FROM lockers');
      console.log(`  ✓ Total de lockers: ${lockers.rows[0].count}`);
    } else {
      console.log('  ✗ Tabla "lockers" no existe');
    }

    // Test 5: Verificar tabla de órdenes
    console.log('\n✓ Test 5: Verificando tabla de órdenes...');
    const ordersCheck = await pool.query(
      "SELECT * FROM information_schema.tables WHERE table_name = 'orders'"
    );
    if (ordersCheck.rows.length > 0) {
      console.log('  ✓ Tabla "orders" existe');
      const orders = await pool.query('SELECT COUNT(*) FROM orders');
      console.log(`  ✓ Total de órdenes: ${orders.rows[0].count}`);
    } else {
      console.log('  ✗ Tabla "orders" no existe');
    }

    // Test 6: Verificar tabla de order_statuses
    console.log('\n✓ Test 6: Verificando tabla de order_statuses...');
    const statusesCheck = await pool.query(
      "SELECT * FROM information_schema.tables WHERE table_name = 'order_statuses'"
    );
    if (statusesCheck.rows.length > 0) {
      console.log('  ✓ Tabla "order_statuses" existe');
      const statuses = await pool.query('SELECT * FROM order_statuses');
      console.log(`  ✓ Estados disponibles: ${statuses.rows.length}`);
    } else {
      console.log('  ✗ Tabla "order_statuses" no existe');
    }

    // Test 7: Verificar foreign keys
    console.log('\n✓ Test 7: Verificando integridad referencial...');
    const fkCheck = await pool.query(`
      SELECT 
        constraint_name, 
        table_name 
      FROM information_schema.table_constraints 
      WHERE constraint_type = 'FOREIGN KEY'
    `);
    console.log(`  ✓ Total de foreign keys: ${fkCheck.rows.length}`);
    fkCheck.rows.forEach((fk) => {
      console.log(`    - ${fk.constraint_name} en tabla ${fk.table_name}`);
    });

    // Test 8: Verificar índices
    console.log('\n✓ Test 8: Verificando índices...');
    const indexesCheck = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    console.log(`  ✓ Total de índices: ${indexesCheck.rows.length}`);
    indexesCheck.rows.forEach((idx) => {
      console.log(`    - ${idx.indexname}`);
    });

    console.log('\n=== PRUEBAS COMPLETADAS EXITOSAMENTE ===\n');
  } catch (err) {
    console.error('\n✗ ERROR DURANTE LAS PRUEBAS:');
    console.error(err.message);
    console.error(err.code);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runTests();
