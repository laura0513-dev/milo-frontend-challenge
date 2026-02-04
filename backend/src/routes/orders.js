const express = require('express')
const pool = require('../config/database')
const { authAdmin, authCliente, authDelivery, authAny } = require('../middleware/authMiddleware')
const { 
  generateDeliveryCode, 
  encryptCode, 
  decryptCode, 
  isCodeExpired, 
  getSecondsUntilExpiration 
} = require('../utils/encryption')
const { ORDER_STATUSES } = require('../utils/constants')

// @query
const { 
    GET_ORDERS, 
    GET_ORDER_BY_USER_ID, 
    CREATE_NEW_ORDER, 
    UPDATE_ORDER,
    DELETE_ORDER
} = require('../utils/query/orders')

const router = express.Router()

// GET: Obtener constantes de estados (requiere autenticación)
router.get('/config/statuses', authAny, async (req, res) => {
  try {
    res.json({
      statuses: ORDER_STATUSES,
      description: 'Constantes de estados de órdenes. Use estas constantes en las requests para cambiar estados.'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET ORDERS - Admin can see all, cliente can see only theirs, delivery can see available/assigned
router.get('/', authAny, async (req, res) => {
  try {
    // Si es admin, ve todas las órdenes
    if (req.user.role === 'admin') {
      const result = await pool.query(GET_ORDERS)
      return res.json(result.rows)
    }
    
    // Si es cliente, ve solo sus órdenes
    if (req.user.role === 'cliente') {
      const result = await pool.query(
        GET_ORDER_BY_USER_ID,
        [req.user.id]
      )
      return res.json(result.rows)
    }
    
    // Si es delivery, ve sus órdenes asignadas
    if (req.user.role === 'delivery') {
      const result = await pool.query(`
        SELECT 
          o.id,
          u.name as usuario,
          l.address as locker_address,
          os.name as status,
          o.created_at,
          o.updated_at
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN lockers l ON o.locker_id = l.id
        JOIN order_statuses os ON o.status_id = os.id
        WHERE o.delivery_user_id = $1
        ORDER BY o.created_at DESC
      `, [req.user.id])
      return res.json(result.rows)
    }
    
    res.status(403).json({ error: 'Permiso denegado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @ GET: order by user - admin can see all, cliente can see only theirs
router.get('/user/:user_id', authAny, async (req, res) => {
  try {
    // Si es cliente, solo puede ver sus propias órdenes
    if (req.user.role === 'cliente' && req.user.id !== parseInt(req.params.user_id)) {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puede ver órdenes de otros usuarios'
      })
    }

    // Si es delivery, no puede usar este endpoint
    if (req.user.role === 'delivery') {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'Los repartidores deben usar /my-deliveries'
      })
    }

    const result = await pool.query(
      GET_ORDER_BY_USER_ID,
      [req.params.user_id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST: New order - cliente can create, admin can create for anyone
router.post('/', authAny, async (req, res) => {
  const { user_id, locker_id } = req.body

  if (!user_id || !locker_id) {
    return res.status(400).json({ error: 'Faltan campos requeridos: user_id, locker_id' })
  }

  // Si es cliente, solo puede crear órdenes para sí mismo
  if (req.user.role === 'cliente' && req.user.id !== user_id) {
    return res.status(403).json({ 
      error: 'Permiso denegado',
      message: 'No puede crear órdenes para otros usuarios'
    })
  }

  try {
    // Obtener automáticamente el status_id para "En preparación"
    const statusResult = await pool.query(
      'SELECT id FROM order_statuses WHERE name = $1',
      ['En preparación']
    )
    
    if (statusResult.rows.length === 0) {
      return res.status(500).json({ error: 'Estado "En preparación" no configurado en BD' })
    }

    const status_id = statusResult.rows[0].id

    const result = await pool.query(
      CREATE_NEW_ORDER,
      [user_id, locker_id, status_id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Usuario o locker no existe' })
    }
    res.status(500).json({ error: err.message })
  }
})

// GET: Órdenes disponibles para asignar (sin delivery_user_id) - Solo delivery
router.get('/available', authDelivery, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id,
        o.user_id,
        o.locker_id,
        o.status_id,
        o.created_at,
        u.name as cliente_name,
        u.email as cliente_email,
        u.address as cliente_address,
        l.address as locker_address,
        l.latitude,
        l.longitude,
        os.name as status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN lockers l ON o.locker_id = l.id
      JOIN order_statuses os ON o.status_id = os.id
      WHERE o.delivery_user_id IS NULL
      ORDER BY o.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET: Mis órdenes asignadas - Solo delivery
router.get('/my-deliveries', authDelivery, async (req, res) => {
  try {
    // Primero, verificar si hay órdenes asignadas
    const debugOrders = await pool.query(`
      SELECT id, user_id, locker_id, status_id, delivery_user_id
      FROM orders
      WHERE delivery_user_id = $1
    `, [req.user.id])
    
    console.log(`[DEBUG] Órdenes asignadas al delivery ${req.user.id}:`, debugOrders.rows)
    
    // Ahora hacer el query completo con LEFT JOINs para evitar perder órdenes
    const result = await pool.query(`
      SELECT 
        o.id,
        o.user_id,
        o.locker_id,
        o.status_id,
        o.created_at,
        o.updated_at,
        u.name as cliente_name,
        u.email as cliente_email,
        u.address as cliente_address,
        l.address as locker_address,
        l.latitude,
        l.longitude,
        os.name as status
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN lockers l ON o.locker_id = l.id
      LEFT JOIN order_statuses os ON o.status_id = os.id
      WHERE o.delivery_user_id = $1
      ORDER BY o.created_at DESC
    `, [req.user.id])
    
    console.log(`[DEBUG] Resultado con LEFT JOINs:`, result.rows)
    res.json(result.rows)
  } catch (err) {
    console.error(`[ERROR] Error en /my-deliveries:`, err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST: Asignar orden a repartidor - Solo delivery
router.post('/:id/assign', authDelivery, async (req, res) => {
  try {
    // Verificar que la orden existe y no está asignada
    const orderCheck = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    )
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    if (orderCheck.rows[0].delivery_user_id) {
      return res.status(400).json({ 
        error: 'Orden ya asignada',
        message: 'Esta orden ya tiene un repartidor asignado'
      })
    }
    
    // Asignar la orden al repartidor
    const result = await pool.query(
      `UPDATE orders 
       SET delivery_user_id = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [req.user.id, req.params.id]
    )
    
    res.json({
      success: true,
      message: 'Orden asignada exitosamente',
      order: result.rows[0]
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET: Obtener código de delivery (solo para repartidor asignado)
router.get('/:id/delivery-code', authDelivery, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        o.*,
        os.name as status
       FROM orders o
       JOIN order_statuses os ON o.status_id = os.id
       WHERE o.id = $1`,
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    const order = result.rows[0]
    
    // Verificar que el repartidor es quien está asignado
    if (order.delivery_user_id !== req.user.id) {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puedes ver el código de una orden que no te está asignada'
      })
    }
    
    // Verificar que el estado sea "En camino"
    if (order.status !== 'En camino') {
      return res.status(400).json({ 
        error: 'Estado inválido',
        message: 'El código solo está disponible cuando la orden está "En camino"'
      })
    }
    
    // Si no hay código o está expirado, generar uno nuevo
    if (!order.delivery_code_encrypted || isCodeExpired(order.delivery_code_generated_at)) {
      const newCode = generateDeliveryCode()
      const { encrypted, iv } = encryptCode(newCode)
      
      await pool.query(
        `UPDATE orders 
         SET delivery_code_encrypted = $1,
             delivery_code_iv = $2,
             delivery_code_generated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [encrypted, iv, order.id]
      )
      
      return res.json({
        code: newCode,
        expiresIn: 60,
        generatedAt: new Date()
      })
    }
    
    // Desencriptar y devolver el código existente
    const decryptedCode = decryptCode(
      order.delivery_code_encrypted, 
      order.delivery_code_iv
    )
    
    const expiresIn = getSecondsUntilExpiration(order.delivery_code_generated_at)
    
    res.json({
      code: decryptedCode,
      expiresIn: expiresIn,
      generatedAt: order.delivery_code_generated_at
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST: Confirmar recogida con código de cliente (solo cliente dueño de la orden)
router.post('/:id/confirm-pickup', authCliente, async (req, res) => {
  const { clientCode } = req.body
  
  if (!clientCode) {
    return res.status(400).json({ 
      error: 'Código requerido',
      message: 'Debes proporcionar el código para confirmar la recogida'
    })
  }
  
  try {
    // Obtener la orden actual
    const orderResult = await pool.query(
      `SELECT o.*, os.name as current_status 
       FROM orders o
       JOIN order_statuses os ON o.status_id = os.id
       WHERE o.id = $1`,
      [req.params.id]
    )
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    const order = orderResult.rows[0]
    
    // Verificar que el cliente es el dueño de la orden
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puedes confirmar la recogida de una orden que no es tuya'
      })
    }
    
    // Verificar que el estado sea "En el locker"
    if (order.current_status !== 'En el locker') {
      return res.status(400).json({ 
        error: 'Estado inválido',
        message: `Solo puedes recoger paquetes en estado "En el locker". Estado actual: "${order.current_status}"`
      })
    }
    
    // Verificar que hay un código generado
    if (!order.client_code_encrypted || !order.client_code_iv) {
      return res.status(400).json({ 
        error: 'Sin código generado',
        message: 'No hay un código de cliente generado para esta orden. Contacta soporte.'
      })
    }
    
    // Verificar que el código no haya expirado
    if (isCodeExpired(order.client_code_generated_at)) {
      return res.status(400).json({ 
        error: 'Código expirado',
        message: 'El código ha expirado. Solicita uno nuevo en la app'
      })
    }
    
    // Desencriptar y validar el código
    const actualCode = decryptCode(order.client_code_encrypted, order.client_code_iv)
    
    if (actualCode !== clientCode) {
      return res.status(400).json({ 
        error: 'Código inválido',
        message: 'El código ingresado no es correcto'
      })
    }
    
    // Código válido - obtener ID del estado "Entregada"
    const deliveredStatusResult = await pool.query(
      'SELECT id FROM order_statuses WHERE name = $1',
      ['Entregada']
    )
    
    if (deliveredStatusResult.rows.length === 0) {
      return res.status(500).json({ 
        error: 'Error interno',
        message: 'El estado "Entregada" no existe en la BD'
      })
    }
    
    const deliveredStatusId = deliveredStatusResult.rows[0].id
    
    // Actualizar orden a "Entregada"
    const result = await pool.query(
      `UPDATE orders 
       SET status_id = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [deliveredStatusId, req.params.id]
    )
    
    res.json({
      success: true,
      message: '¡Paquete recogido exitosamente!',
      order: result.rows[0]
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET: Obtener código de cliente (solo para cliente dueño de la orden)
router.get('/:id/client-code', authCliente, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        o.*,
        os.name as status
       FROM orders o
       JOIN order_statuses os ON o.status_id = os.id
       WHERE o.id = $1`,
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    const order = result.rows[0]
    
    // Verificar que el cliente es el dueño de la orden
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puedes ver el código de una orden que no es tuya'
      })
    }
    
    // Verificar que el estado sea "En el locker"
    if (order.status !== 'En el locker') {
      return res.status(400).json({ 
        error: 'Estado inválido',
        message: 'El código solo está disponible cuando la orden está "En el locker"'
      })
    }
    
    // Si no hay código o está expirado, generar uno nuevo
    if (!order.client_code_encrypted || isCodeExpired(order.client_code_generated_at)) {
      const newCode = generateDeliveryCode()
      const { encrypted, iv } = encryptCode(newCode)
      
      await pool.query(
        `UPDATE orders 
         SET client_code_encrypted = $1,
             client_code_iv = $2,
             client_code_generated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [encrypted, iv, order.id]
      )
      
      return res.json({
        code: newCode,
        expiresIn: 60,
        generatedAt: new Date()
      })
    }
    
    // Desencriptar y devolver el código existente
    const decryptedCode = decryptCode(
      order.client_code_encrypted, 
      order.client_code_iv
    )
    
    const expiresIn = getSecondsUntilExpiration(order.client_code_generated_at)
    
    res.json({
      code: decryptedCode,
      expiresIn: expiresIn,
      generatedAt: order.client_code_generated_at
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Actualizar estado de orden (solo admin y delivery según el estado)
router.put('/:id/status', authAny, async (req, res) => {
  const { status, deliveryCode, clientCode } = req.body
  
  if (!status) {
    return res.status(400).json({ error: 'El campo status es requerido' })
  }
  
  try {
    // Convertir constantes en inglés a nombres en español si es necesario
    const statusName = ORDER_STATUSES[status] || status
    
    // Obtener el ID del nuevo estado
    const statusResult = await pool.query(
      'SELECT id, name FROM order_statuses WHERE name = $1',
      [statusName]
    )
    
    if (statusResult.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Estado inválido',
        message: `El estado "${statusName}" no existe. Estados válidos: ${Object.keys(ORDER_STATUSES).join(', ')}`
      })
    }
    
    const newStatus = statusResult.rows[0]
    
    // Obtener la orden actual
    const orderResult = await pool.query(
      `SELECT o.*, os.name as current_status 
       FROM orders o
       JOIN order_statuses os ON o.status_id = os.id
       WHERE o.id = $1`,
      [req.params.id]
    )
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    const order = orderResult.rows[0]
    
    // CLIENTE: Solo puede ver sus órdenes, pero NO puede cambiar estado
    if (req.user.role === 'cliente') {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'Los clientes no pueden cambiar el estado de las órdenes'
      })
    }
    
    // ADMIN: Puede cambiar cualquier estado
    if (req.user.role === 'admin') {
      const result = await pool.query(
        `UPDATE orders 
         SET status_id = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [newStatus.id, req.params.id]
      )
      
      return res.json({
        success: true,
        message: `Estado actualizado a "${newStatus.name}"`,
        order: result.rows[0]
      })
    }
    
    // DELIVERY: Solo puede cambiar estados si la orden le está asignada
    if (req.user.role === 'delivery') {
      if (order.delivery_user_id !== req.user.id) {
        return res.status(403).json({ 
          error: 'Permiso denegado',
          message: 'No puedes actualizar órdenes que no te están asignadas'
        })
      }
      
      // Si el nuevo estado es "En camino", generar código
      if (newStatus.name === 'En camino') {
        const code = generateDeliveryCode()
        const { encrypted, iv } = encryptCode(code)
        
        const result = await pool.query(
          `UPDATE orders 
           SET status_id = $1, 
               delivery_code_encrypted = $2,
               delivery_code_iv = $3,
               delivery_code_generated_at = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP 
           WHERE id = $4 
           RETURNING *`,
          [newStatus.id, encrypted, iv, req.params.id]
        )
        
        return res.json({
          success: true,
          message: 'Estado actualizado a "En camino" y código generado',
          order: result.rows[0]
        })
      }
      
      // Si el nuevo estado es "En el locker", validar código
      if (newStatus.name === 'En el locker') {
        if (!deliveryCode) {
          return res.status(400).json({ 
            error: 'Código requerido',
            message: 'Debes proporcionar el código de delivery para marcar como "En el locker"'
          })
        }
        
        if (!order.delivery_code_encrypted || !order.delivery_code_iv) {
          return res.status(400).json({ 
            error: 'Sin código generado',
            message: 'No hay un código de delivery generado para esta orden'
          })
        }
        
        // Verificar que el código no haya expirado
        if (isCodeExpired(order.delivery_code_generated_at)) {
          return res.status(400).json({ 
            error: 'Código expirado',
            message: 'El código ha expirado. Solicita uno nuevo'
          })
        }
        
        // Desencriptar y validar el código
        const actualCode = decryptCode(order.delivery_code_encrypted, order.delivery_code_iv)
        
        if (actualCode !== deliveryCode) {
          return res.status(400).json({ 
            error: 'Código inválido',
            message: 'El código ingresado no es correcto'
          })
        }
        
        // Código válido, actualizar estado y generar código para cliente
        const clientCode = generateDeliveryCode()
        const { encrypted: clientEncrypted, iv: clientIv } = encryptCode(clientCode)
        
        const result = await pool.query(
          `UPDATE orders 
           SET status_id = $1, 
               client_code_encrypted = $2,
               client_code_iv = $3,
               client_code_generated_at = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP 
           WHERE id = $4 
           RETURNING *`,
          [newStatus.id, clientEncrypted, clientIv, req.params.id]
        )
        
        return res.json({
          success: true,
          message: 'Estado actualizado a "En el locker" y código de cliente generado',
          order: result.rows[0]
        })
      }
      
      // Para otros cambios de estado, delivery no puede
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puedes cambiar la orden a ese estado'
      })
    }
    
    res.status(403).json({ error: 'Permiso denegado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Update order - admin can update all, cliente can update only theirs
router.put('/:id', authAny, async (req, res) => {
  const { status_id } = req.body

  if (!status_id) {
    return res.status(400).json({ error: 'status_id es requerido' })
  }

  try {
    // Si es cliente, verificamos que la orden sea suya
    if (req.user.role === 'cliente') {
      const orderResult = await pool.query(
        'SELECT user_id FROM orders WHERE id = $1',
        [req.params.id]
      )
      
      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Orden no encontrada' })
      }
      
      if (orderResult.rows[0].user_id !== req.user.id) {
        return res.status(403).json({ 
          error: 'Permiso denegado',
          message: 'No puede actualizar órdenes de otros usuarios'
        })
      }
    }

    const result = await pool.query(
      UPDATE_ORDER,
      [status_id, req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Cancelar una orden (solo cambiar estado a CANCELLED, no eliminar)
router.put('/:id/cancel', authAny, async (req, res) => {
  try {
    // Obtener la orden
    const orderResult = await pool.query(
      `SELECT o.*, os.name as current_status 
       FROM orders o
       JOIN order_statuses os ON o.status_id = os.id
       WHERE o.id = $1`,
      [req.params.id]
    )
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    const order = orderResult.rows[0]
    
    // CLIENTE: Solo puede cancelar sus propias órdenes y solo si no están en ciertos estados
    if (req.user.role === 'cliente') {
      if (order.user_id !== req.user.id) {
        return res.status(403).json({ 
          error: 'Permiso denegado',
          message: 'No puedes cancelar órdenes de otros usuarios'
        })
      }
      
      // No puede cancelar si ya está entregada, en el locker o cancelada
      if (['Entregada', 'En el locker', 'Cancelada'].includes(order.current_status)) {
        return res.status(400).json({ 
          error: 'No se puede cancelar',
          message: `No puedes cancelar una orden en estado "${order.current_status}"`
        })
      }
    }
    
    // DELIVERY: NO puede cancelar órdenes
    if (req.user.role === 'delivery') {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'Los repartidores no pueden cancelar órdenes'
      })
    }
    
    // ADMIN: Puede cancelar cualquier orden excepto si ya está entregada
    if (req.user.role === 'admin') {
      if (order.current_status === 'Entregada') {
        return res.status(400).json({ 
          error: 'No se puede cancelar',
          message: 'No puedes cancelar una orden que ya ha sido entregada'
        })
      }
    }
    
    // Obtener ID del estado CANCELLED
    const statusResult = await pool.query(
      'SELECT id FROM order_statuses WHERE name = $1',
      ['Cancelada']
    )
    
    if (statusResult.rows.length === 0) {
      return res.status(500).json({ 
        error: 'Error interno',
        message: 'El estado "Cancelada" no existe en la BD'
      })
    }
    
    const cancelledStatusId = statusResult.rows[0].id
    
    // Actualizar orden a estado CANCELLED
    const result = await pool.query(
      `UPDATE orders 
       SET status_id = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [cancelledStatusId, req.params.id]
    )
    
    res.json({
      success: true,
      message: 'Orden cancelada exitosamente',
      order: result.rows[0]
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @DELETE: Delete order - NO LONGER USED (use PUT /:id/cancel instead)
// Mantener para compatibilidad pero devolver error
router.delete('/:id', authAny, async (req, res) => {
  res.status(410).json({ 
    error: 'Método obsoleto',
    message: 'Use PUT /api/orders/:id/cancel para cancelar una orden. Las órdenes no se eliminan, solo se marcan como canceladas.'
  })
})

module.exports = router
