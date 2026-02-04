const express = require('express')
const pool = require('../config/database')
const { authAdmin, authAny } = require('../middleware/authMiddleware')

// @query
const { 
    GET_ALL_LOCKERS,
    GET_LOCKER_BY_ID, 
    GET_LOCKERS_BY_DISTANCE,
    CREATE_NEW_LOCKER,
    UPDATE_LOCKER,
    DELETE_LOCKER
} = require('../utils/query/lockers')

const router = express.Router()

// @GET: all lockers - admin only (cliente usa /nearby para ver cercanos)
router.get('/', authAdmin, async (req, res) => {
  try {
    const result = await pool.query(GET_ALL_LOCKERS)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @GET: get locker by ID - admin only
router.get('/:id', authAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(GET_LOCKER_BY_ID, [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Locker no encontrado' })
    }
    
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @GET lockers by radius - cliente and admin can use
router.get('/nearby/:lat/:lng', authAny, async (req, res) => {
  const { lat, lng } = req.params
  const radius = 5 // radio fijo en km

  try {
    const result = await pool.query(
      GET_LOCKERS_BY_DISTANCE,
      [lat, lng, radius]
    )
    
    res.json({
      searchLocation: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
      radius: radius,
      lockers: result.rows,
      count: result.rows.length
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @POST: create locker, admin only
router.post('/', authAdmin, async (req, res) => {
  const { name, address, latitude, longitude, created_by } = req.body

  if (!name || !address || latitude === undefined || longitude === undefined || !created_by) {
    return res.status(400).json({ error: 'Faltan campos requeridos: name, address, latitude, longitude, created_by' })
  }

  try {
    const result = await pool.query(
      CREATE_NEW_LOCKER,
      [name, address, latitude, longitude, created_by]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @PUT: update locker - admin only
router.put('/:id', authAdmin, async (req, res) => {
  const { name, address, latitude, longitude, is_active } = req.body

  try {
    const result = await pool.query(
      UPDATE_LOCKER,
      [name, address, latitude, longitude, is_active, req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Locker no encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @DELETE: delete locker - admin only
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const result = await pool.query(DELETE_LOCKER, [
      req.params.id,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Locker no encontrado' })
    }

    res.json({ message: 'Locker eliminado', id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
