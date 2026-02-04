const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateDeliveryCode, encryptCode, decryptCode } = require('../utils/encryption');
const { ORDER_STATUSES } = require('../utils/constants');

/**
 * Script de pruebas CRUD para la base de datos
 */

async function createTables(client) {
  console.log('=== CREANDO ESTRUCTURA DE BASE DE DATOS ===\n');

  // Crear tabla roles
  console.log('✓ Creando tabla "roles"...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('  ✓ Tabla "roles" lista');

  // Crear tabla users
  console.log('\n✓ Creando tabla "users"...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      address TEXT,
      role_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
    )
  `);
  console.log('  ✓ Tabla "users" lista');

  // Crear tabla lockers
  console.log('\n✓ Creando tabla "lockers"...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS lockers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      is_active BOOLEAN DEFAULT true,
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log('  ✓ Tabla "lockers" lista');

  // Crear tabla order_statuses
  console.log('\n✓ Creando tabla "order_statuses"...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS order_statuses (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('  ✓ Tabla "order_statuses" lista');

  // Crear tabla orders
  console.log('\n✓ Creando tabla "orders"...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      locker_id INTEGER NOT NULL,
      status_id INTEGER NOT NULL,
      delivery_user_id INTEGER,
      delivery_code_encrypted TEXT,
      delivery_code_iv TEXT,
      delivery_code_generated_at TIMESTAMP,
      client_code_encrypted TEXT,
      client_code_iv TEXT,
      client_code_generated_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (locker_id) REFERENCES lockers(id) ON DELETE RESTRICT,
      FOREIGN KEY (status_id) REFERENCES order_statuses(id) ON DELETE RESTRICT,
      FOREIGN KEY (delivery_user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log('  ✓ Tabla "orders" lista');

  // Crear índices para optimizar consultas
  console.log('\n✓ Creando índices...');
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_locker_id ON orders(locker_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status_id ON orders(status_id);
    CREATE INDEX IF NOT EXISTS idx_orders_delivery_user_id ON orders(delivery_user_id);
  `);
  console.log('  ✓ Índices creados');

  console.log('\n=== ESTRUCTURA DE BASE DE DATOS COMPLETADA ===\n');
}

async function runCRUDTests() {
  const client = await pool.connect();

  try {
    console.log('\n=== INICIANDO PRUEBAS CRUD ===\n');

    // Crear tablas si no existen
    await createTables(client);

    // Test 1: Insertar roles
    console.log('✓ Test 1: Insertando roles...');
    await client.query('BEGIN');
    
    const rolesInsert = await client.query(`
      INSERT INTO roles (name) 
      VALUES ($1), ($2), ($3)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    `, ['admin', 'cliente', 'delivery']);
    
    console.log(`  ✓ Roles insertados: ${rolesInsert.rows.length}`);

    // Test 2: Obtener roles
    console.log('\n✓ Test 2: Obteniendo roles...');
    const rolesSelect = await client.query('SELECT * FROM roles');
    console.log(`  ✓ Roles en BD: ${rolesSelect.rows.length}`);
    rolesSelect.rows.forEach((role) => {
      console.log(`    - ${role.id}: ${role.name}`);
    });

    // Test 3: Insertar usuarios con contraseñas hasheadas
    console.log('\n✓ Test 3: Insertando usuarios con contraseñas hasheadas...');
    const adminRole = rolesSelect.rows.find((r) => r.name === 'admin');
    const clienteRole = rolesSelect.rows.find((r) => r.name === 'cliente');
    const deliveryRole = rolesSelect.rows.find((r) => r.name === 'delivery');

    // Generar hashes de contraseñas
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const clientePasswordHash = await bcrypt.hash('cliente123', 10);
    const deliveryPasswordHash = await bcrypt.hash('delivery123', 10);

    const usersInsert = await client.query(`
      INSERT INTO users (name, email, password_hash, address, role_id)
      VALUES 
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15)
      RETURNING id, name, email, address, role_id
    `, [
      'Juan Admin',
      'juan.admin@example.com',
      adminPasswordHash,
      'Calle 80 #10-20, Bogotá',
      adminRole.id,
      'Carlos Cliente',
      'carlos.cliente@example.com',
      clientePasswordHash,
      'Carrera 7 #45-30, Bogotá',
      clienteRole.id,
      'María Delivery',
      'maria.delivery@example.com',
      deliveryPasswordHash,
      'Avenida 68 #25-15, Bogotá',
      deliveryRole.id,
    ]);

    console.log(`  ✓ Usuarios insertados: ${usersInsert.rows.length}`);
    usersInsert.rows.forEach((user) => {
      console.log(`    - ${user.id}: ${user.name} (${user.email})`);
    });
    
    console.log('\n  📝 Credenciales de acceso:');
    console.log('    Admin:');
    console.log('      Email: juan.admin@example.com');
    console.log('      Password: admin123');
    console.log('    Cliente:');
    console.log('      Email: carlos.cliente@example.com');
    console.log('      Password: cliente123');
    console.log('    Delivery:');
    console.log('      Email: maria.delivery@example.com');
    console.log('      Password: delivery123');

    // Test 4: Insertar lockers
    console.log('\n✓ Test 4: Insertando lockers...');
    const adminUser = usersInsert.rows.find((u) => u.name === 'Juan Admin');

    const lockersInsert = await client.query(`
      INSERT INTO lockers (name, address, latitude, longitude, created_by)
      VALUES 
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15)
      RETURNING id, name, address, latitude, longitude
    `, [
      'Locker Centro',
      'Calle 10 #15-30, Bogotá',
      4.7169,
      -74.0456,
      adminUser.id,
      'Locker Chapinero',
      'Carrera 5 #20-40, Bogotá',
      4.7089,
      -74.0082,
      adminUser.id,
      'Locker Usaquén',
      'Calle 72 #11-50, Bogotá',
      4.6734,
      -74.0447,
      adminUser.id,
    ]);

    console.log(`  ✓ Lockers insertados: ${lockersInsert.rows.length}`);
    lockersInsert.rows.forEach((locker) => {
      console.log(
        `    - ${locker.id}: ${locker.name} - ${locker.address} (${locker.latitude}, ${locker.longitude})`
      );
    });

    // Test 5: Insertar estados de órdenes
    console.log('\n✓ Test 5: Insertando estados de órdenes...');
    const statusesInsert = await client.query(`
      INSERT INTO order_statuses (name)
      VALUES ($1), ($2), ($3), ($4), ($5)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    `, [
      ORDER_STATUSES.PREPARING,
      ORDER_STATUSES.IN_TRANSIT,
      ORDER_STATUSES.IN_LOCKER,
      ORDER_STATUSES.DELIVERED,
      ORDER_STATUSES.CANCELLED
    ]);

    console.log(`  ✓ Estados insertados: ${statusesInsert.rows.length}`);

    // Test 6: Obtener estados
    console.log('\n✓ Test 6: Obteniendo estados...');
    const statusesSelect = await client.query('SELECT * FROM order_statuses');
    const enCaminoStatus = statusesSelect.rows.find((s) => s.name === ORDER_STATUSES.IN_TRANSIT);

    console.log(`  ✓ Estados en BD:`);
    statusesSelect.rows.forEach((status) => {
      console.log(`    - ${status.id}: ${status.name}`);
    });

    // Test 7: Crear una orden
    console.log('\n✓ Test 7: Creando una orden...');
    const clienteUser = usersInsert.rows.find((u) => u.name === 'Carlos Cliente');
    const deliveryUser = usersInsert.rows.find((u) => u.name === 'María Delivery');
    const locker = lockersInsert.rows[0];
    const enPreparacionStatus = statusesSelect.rows.find((s) => s.name === ORDER_STATUSES.PREPARING);

    const ordersInsert = await client.query(`
      INSERT INTO orders (user_id, locker_id, status_id, delivery_user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, locker_id, status_id, delivery_user_id, created_at
    `, [clienteUser.id, locker.id, enPreparacionStatus.id, deliveryUser.id]);

    console.log(`  ✓ Orden creada: ${ordersInsert.rows[0].id}`);
    console.log(`    - Usuario: ${ordersInsert.rows[0].user_id}`);
    console.log(`    - Locker: ${ordersInsert.rows[0].locker_id}`);
    console.log(`    - Estado: ${ordersInsert.rows[0].status_id}`);
    console.log(`    - Repartidor: ${ordersInsert.rows[0].delivery_user_id}`);

    // Test 8: Generar y validar código de delivery
    console.log('\n✓ Test 8: Probando encriptación de código de delivery...');
    const deliveryCode = generateDeliveryCode();
    const { encrypted, iv } = encryptCode(deliveryCode);
    const decrypted = decryptCode(encrypted, iv);
    
    console.log(`  ✓ Código generado: ${deliveryCode}`);
    console.log(`  ✓ Código encriptado (primeros 20 chars): ${encrypted.substring(0, 20)}...`);
    console.log(`  ✓ Código desencriptado: ${decrypted}`);
    console.log(`  ✓ Validación: ${deliveryCode === decrypted ? 'CORRECTA ✓' : 'FALLIDA ✗'}`);

    // Guardar código en la orden
    await client.query(
      `UPDATE orders 
       SET delivery_code_encrypted = $1, 
           delivery_code_iv = $2,
           delivery_code_generated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [encrypted, iv, ordersInsert.rows[0].id]
    );
    console.log(`  ✓ Código encriptado guardado en la orden`);

    // Test 9: Obtener órdenes con JOIN
    console.log('\n✓ Test 9: Obteniendo órdenes con información completa...');
    const ordersWithData = await client.query(`
      SELECT 
        o.id,
        u.name as usuario,
        l.address as locker_address,
        os.name as status,
        d.name as repartidor,
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN lockers l ON o.locker_id = l.id
      JOIN order_statuses os ON o.status_id = os.id
      LEFT JOIN users d ON o.delivery_user_id = d.id
    `);

    console.log(`  ✓ Órdenes encontradas: ${ordersWithData.rows.length}`);
    ordersWithData.rows.forEach((order) => {
      console.log(
        `    - Orden #${order.id}: ${order.usuario} → ${order.locker_address} (${order.status}) - Repartidor: ${order.repartidor || 'Sin asignar'}`
      );
    });

    // Test 10: Actualizar estado a "En el locker" y generar código de cliente
    console.log('\n✓ Test 10: Cambiando estado a "En el locker" y generando código de cliente...');
    const enElLockerStatus = statusesSelect.rows.find((s) => s.name === 'En el locker');
    const clientCodeGenerate = generateDeliveryCode();
    const { encrypted: clientEncrypted, iv: clientIv } = encryptCode(clientCodeGenerate);
    
    const updateToLocker = await client.query(
      `UPDATE orders 
       SET status_id = $1, 
           client_code_encrypted = $2,
           client_code_iv = $3,
           client_code_generated_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING *`,
      [enElLockerStatus.id, clientEncrypted, clientIv, ordersInsert.rows[0].id]
    );

    console.log(`  ✓ Orden #${updateToLocker.rows[0].id} actualizada a "En el locker"`);
    console.log(`  ✓ Código de cliente generado: ${clientCodeGenerate}`);
    console.log(`  ✓ Código encriptado guardado`);
    
    // Validar desencriptación del código de cliente
    const decryptedClientCode = decryptCode(clientEncrypted, clientIv);
    console.log(`  ✓ Código desencriptado: ${decryptedClientCode}`);
    console.log(`  ✓ Validación: ${clientCodeGenerate === decryptedClientCode ? 'CORRECTA ✓' : 'FALLIDA ✗'}`);

    // Test 11: Actualizar estado a "Entregada"
    console.log('\n✓ Test 11: Actualizando estado final a "Entregada"...');
    const entregadaStatus = statusesSelect.rows.find((s) => s.name === 'Entregada');
    const updateOrder = await client.query(
      `UPDATE orders SET status_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [entregadaStatus.id, ordersInsert.rows[0].id]
    );

    console.log(`  ✓ Orden #${updateOrder.rows[0].id} actualizada`);
    console.log(`    - Nuevo estado: ${entregadaStatus.name}`);

    // Test 12: Eliminar una orden
    console.log('\n✓ Test 12: Eliminando una orden...');
    const deleteOrder = await client.query(`DELETE FROM orders WHERE id = $1 RETURNING id`, [
      updateOrder.rows[0].id,
    ]);

    console.log(`  ✓ Orden #${deleteOrder.rows[0].id} eliminada`);

    await client.query('COMMIT');
    console.log('\n=== PRUEBAS CRUD COMPLETADAS EXITOSAMENTE ===\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n✗ ERROR DURANTE LAS PRUEBAS CRUD:');
    console.error(err.message);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

runCRUDTests();
