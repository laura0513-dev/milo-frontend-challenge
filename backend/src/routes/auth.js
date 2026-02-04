require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validación fallida',
        message: 'email y password son requeridos'
      });
    }

    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.password_hash, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    // Verificar que existe el usuario
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        message: 'Email o contraseña inválidos'
      });
    }

    const user = result.rows[0];

    // Verificar que es administrador
    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'Solo administradores pueden acceder'
      });
    }

    // Validar contraseña contra el hash almacenado
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        message: 'Email o contraseña inválidos'
      });
    }

    // Crear el token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h', // Token válido por 24 horas
        issuer: 'milo-api',
        subject: user.id.toString()
      }
    );

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      expiresIn: '24h'
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error en autenticación',
      message: err.message
    });
  }
});

/**
 * POST /api/auth/register/cliente
 * 
 * Registra un nuevo cliente en la plataforma
 * 
 * Body requerido:
 * {
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "password": "contraseña",
 *   "address": "Calle 123 # 45-67"
 * }
 * 
 * Respuesta exitosa (201):
 * {
 *   "success": true,
 *   "message": "Cliente registrado exitosamente",
 *   "token": "eyJhbGc...",
 *   "user": {...}
 * }
 */
router.post('/register/cliente', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Validar que vienen todos los campos
    if (!name || !email || !password || !address) {
      return res.status(400).json({
        error: 'Validación fallida',
        message: 'name, email, password y address son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validación fallida',
        message: 'El formato del email no es válido'
      });
    }

    // Validar que email sea único
    const emailExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        error: 'Validación fallida',
        message: 'No se puede completar el registro con esta información'
      });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Obtener ID del rol "cliente"
    const roleResult = await pool.query(
      'SELECT id FROM roles WHERE name = $1',
      ['cliente']
    );

    if (roleResult.rows.length === 0) {
      return res.status(500).json({
        error: 'Error interno',
        message: 'El rol cliente no existe en la BD'
      });
    }

    const roleId = roleResult.rows[0].id;

    // Insertar nuevo usuario
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role_id`,
      [name, email, passwordHash, address, roleId]
    );

    const newUser = result.rows[0];

    // Crear token JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'cliente'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
        issuer: 'milo-api',
        subject: newUser.id.toString()
      }
    );

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Cliente registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: 'cliente'
      },
      expiresIn: '24h'
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error en registro',
      message: err.message
    });
  }
});

/**
 * POST /api/auth/login/cliente
 * 
 * Autentica un cliente y devuelve un token JWT
 * 
 * Body requerido:
 * {
 *   "username": "juanperez",
 *   "password": "contraseña"
 * }
 */
router.post('/login/cliente', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que vienen email y password
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validación fallida',
        message: 'email y password son requeridos'
      });
    }

    // Buscar el usuario en la BD
    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.password_hash, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    // Verificar que existe el usuario
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        message: 'Email o contraseña inválidos'
      });
    }

    const user = result.rows[0];

    // Verificar que es cliente
    if (user.role !== 'cliente') {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'Solo clientes pueden acceder a este endpoint'
      });
    }

    // Validar contraseña contra el hash almacenado
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        message: 'Email o contraseña inválidos'
      });
    }

    // Crear el token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
        issuer: 'milo-api',
        subject: user.id.toString()
      }
    );

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      expiresIn: '24h'
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error en autenticación',
      message: err.message
    });
  }
});


router.post('/login/delivery', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que vienen email y password
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validación fallida',
        message: 'email y password son requeridos'
      });
    }

    // Buscar el usuario en la BD
    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.password_hash, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    // Verificar que existe el usuario
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        message: 'Email o contraseña inválidos'
      });
    }

    const user = result.rows[0];

    // Verificar que es delivery
    if (user.role !== 'delivery') {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'Solo repartidores pueden acceder a este endpoint'
      });
    }

    // Validar contraseña contra el hash almacenado
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        message: 'Email o contraseña inválidos'
      });
    }

    // Crear el token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
        issuer: 'milo-api',
        subject: user.id.toString()
      }
    );

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      expiresIn: '24h'
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error en autenticación',
      message: err.message
    });
  }
});


router.post('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        valid: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        valid: false,
        message: 'Formato inválido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      valid: true,
      user: decoded
    });

  } catch (err) {
    res.status(401).json({
      valid: false,
      message: 'Token inválido o expirado'
    });
  }
});

module.exports = router;
