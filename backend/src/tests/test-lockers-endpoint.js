const http = require('http');

/**
 * Script de pruebas para endpoints de Lockers
 * Se ejecuta sin afectar el servidor
 */

const BASE_URL = 'http://localhost:3000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoianVhbi5hZG1pbkBleGFtcGxlLmNvbSIsIm5hbWUiOiJKdWFuIEFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcwMDY3MDQ3LCJleHAiOjE3NzAxNTM0NDcsImlzcyI6Im1pbG8tYXBpIiwic3ViIjoiMTMifQ.n0_qxPBKvfLRjqzZTJo3bMrkPa8ikPDWvUxYftlhj5A';

function makeRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonData,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n=== PRUEBAS DE ENDPOINTS LOCKERS ===\n');

  try {
    // Test 0: GET /api/users
    console.log('✓ Test 0: GET /api/users (obtener todos los usuarios)');
    const getUsersResponse = await makeRequest('GET', '/users');
    console.log(`  Status: ${getUsersResponse.status}`);
    if (getUsersResponse.status === 200) {
      console.log(`  Usuarios encontrados: ${Array.isArray(getUsersResponse.body) ? getUsersResponse.body.length : 0}`);
    } else {
      console.log(`  Error: ${getUsersResponse.body.error || getUsersResponse.body.message || 'Desconocido'}`);
    }

    // Test 1: GET /api/lockers (lista todos)
    console.log('\n✓ Test 1: GET /api/lockers (obtener todos los lockers)');
    const getAllResponse = await makeRequest('GET', '/lockers');
    console.log(`  Status: ${getAllResponse.status}`);
    console.log(`  Lockers encontrados: ${Array.isArray(getAllResponse.body) ? getAllResponse.body.length : 0}`);
    if (Array.isArray(getAllResponse.body) && getAllResponse.body.length > 0) {
      console.log(`  Ejemplo: ID ${getAllResponse.body[0].id} - ${getAllResponse.body[0].name}`);
    }

    // Test 2: GET /api/lockers/:id (obtener por ID)
    console.log('\n✓ Test 2: GET /api/lockers/24 (obtener locker específico)');
    const getByIdResponse = await makeRequest('GET', '/lockers/24');
    console.log(`  Status: ${getByIdResponse.status}`);
    if (getByIdResponse.status === 200) {
      console.log(`  ✓ Locker encontrado:`);
      console.log(`    - ID: ${getByIdResponse.body.id}`);
      console.log(`    - Nombre: ${getByIdResponse.body.name}`);
      console.log(`    - Dirección: ${getByIdResponse.body.address}`);
      console.log(`    - Creado por: ${getByIdResponse.body.created_by}`);
      console.log(`    - Activo: ${getByIdResponse.body.is_active}`);
    } else {
      console.log(`  ✗ Error: ${getByIdResponse.body.error || 'No encontrado'}`);
    }

    // Test 3: GET /api/lockers/nearby/:lat/:lng
    console.log('\n✓ Test 3: GET /api/lockers/nearby/4.7169/-74.0456 (lockers cercanos)');
    const nearbyResponse = await makeRequest('GET', '/lockers/nearby/4.7169/-74.0456?radius=5');
    console.log(`  Status: ${nearbyResponse.status}`);
    console.log(`  Lockers encontrados: ${Array.isArray(nearbyResponse.body) ? nearbyResponse.body.length : 0}`);
    if (Array.isArray(nearbyResponse.body) && nearbyResponse.body.length > 0) {
      console.log(`  Primeros 3 resultados (ordenados por distancia):`);
      nearbyResponse.body.slice(0, 3).forEach((locker) => {
        console.log(`    - ${locker.name}: ${locker.distance.toFixed(2)} km`);
      });
    }

    // Test 4: POST /api/lockers (crear nuevo)
    console.log('\n✓ Test 4: POST /api/lockers (crear nuevo locker)');
    const newLocker = {
      name: 'Locker Test',
      address: 'Calle Test #100-200, Bogotá',
      latitude: 4.7200,
      longitude: -74.0500,
      created_by: 13,
    };
    const createResponse = await makeRequest('POST', '/lockers', newLocker);
    console.log(`  Status: ${createResponse.status}`);
    if (createResponse.status === 201) {
      console.log(`  ✓ Locker creado:`);
      console.log(`    - ID: ${createResponse.body.id}`);
      console.log(`    - Nombre: ${createResponse.body.name}`);
    } else {
      console.log(`  ✗ Error: ${createResponse.body.error || JSON.stringify(createResponse.body)}`);
    }

    // Test 5: PUT /api/lockers/:id (actualizar)
    if (createResponse.status === 201) {
      console.log('\n✓ Test 5: PUT /api/lockers/:id (actualizar locker)');
      const updateData = {
        name: 'Locker Test Actualizado',
        is_active: true,
      };
      const updateResponse = await makeRequest('PUT', `/lockers/${createResponse.body.id}`, updateData);
      console.log(`  Status: ${updateResponse.status}`);
      if (updateResponse.status === 200) {
        console.log(`  ✓ Locker actualizado:`);
        console.log(`    - ID: ${updateResponse.body.id}`);
        console.log(`    - Nuevo nombre: ${updateResponse.body.name}`);
      } else {
        console.log(`  ✗ Error: ${updateResponse.body.error}`);
      }

      // Test 6: DELETE /api/lockers/:id (eliminar)
      console.log('\n✓ Test 6: DELETE /api/lockers/:id (eliminar locker)');
      const deleteResponse = await makeRequest('DELETE', `/lockers/${createResponse.body.id}`);
      console.log(`  Status: ${deleteResponse.status}`);
      if (deleteResponse.status === 200) {
        console.log(`  ✓ Locker eliminado: ID ${deleteResponse.body.id}`);
      } else {
        console.log(`  ✗ Error: ${deleteResponse.body.error}`);
      }
    }

    console.log('\n=== PRUEBAS COMPLETADAS ===\n');
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
    console.error('  Asegúrate de que el servidor está corriendo en http://localhost:3000');
  }
}

runTests();
