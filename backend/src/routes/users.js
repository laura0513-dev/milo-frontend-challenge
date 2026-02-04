const express = require('express')
const pool = require('../config/database')
const { authAdmin, authCliente, authAny } = require('../middleware/authMiddleware')

// @utils
const { GET_ALL_USERS, GET_USER_BY_ID, UPDATE_USER, DELETE_USER } = require('../utils/query/users')
const { USER_NOT_FOUND, MISSING_REQUIRED_FIELDS, USER_NAME_TAKEN } = require('../utils/messages')

const router = express.Router()

// @GET ALL - admin only
router.get('/', authAdmin, async (req, res) => {
  try {
    const result = await pool.query(GET_ALL_USERS)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @GET user by id - admin puede ver cualquiera, cliente solo a sí mismo
router.get('/:id', authAny, async (req, res) => {
  try {
    // Si es cliente, solo puede ver sus propios datos
    if (req.user.role === 'cliente' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puede ver datos de otros usuarios'
      })
    }

    const result = await pool.query(
      GET_USER_BY_ID,
      [req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: USER_NOT_FOUND })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// @POST, create user - admin only
router.post('/', authAdmin, async (req, res) => {
  const { name, username, password_hash, role_id } = req.body

  if (!name || !username || !password_hash || !role_id) {
    return res.status(400).json({ error: MISSING_REQUIRED_FIELDS })
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (name, username, password_hash, role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, username, password_hash, role_id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: USER_NAME_TAKEN })
    }
    res.status(500).json({ error: err.message })
  }
})

// @PUT: update user data - admin puede editar cualquiera, cliente solo a sí mismo
router.put('/:id', authAny, async (req, res) => {
  try {
    // Si es cliente, solo puede editar sus propios datos
    if (req.user.role === 'cliente' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puede editar datos de otros usuarios'
      })
    }

    const { name, username, password_hash, email } = req.body

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           username = COALESCE($2, username),
           password_hash = COALESCE($3, password_hash),
           email = COALESCE($4, email),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, name, username, email, created_at, updated_at`,
      [name, username, password_hash, email, req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: USER_NOT_FOUND })
    }

    res.json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: USER_NAME_TAKEN })
    }
    res.status(500).json({ error: err.message })
  }
})

// DELETE: Eliminar usuario - admin puede eliminar cualquiera, cliente solo a sí mismo
router.delete('/:id', authAny, async (req, res) => {
  try {
    // Si es cliente, solo puede eliminarse a sí mismo
    if (req.user.role === 'cliente' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ 
        error: 'Permiso denegado',
        message: 'No puede eliminar otros usuarios'
      })
    }

    const result = await pool.query(DELETE_USER, [
      req.params.id,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: USER_NOT_FOUND })
    }

    res.json({ message: 'Usuario eliminado', id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
