const jwt = require('jsonwebtoken')

const createAuthMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Obtener el header Authorization
      const authHeader = req.headers.authorization
      
      if (!authHeader) {
        return res.status(401).json({
          error: 'No autorizado',
          message: 'Token no proporcionado. Use: Authorization: Bearer <token>'
        })
      }

      // Extraer el token del formato "Bearer <token>"
      const token = authHeader.split(' ')[1]
      
      if (!token) {
        return res.status(401).json({
          error: 'No autorizado',
          message: 'Formato inválido. Use: Authorization: Bearer <token>'
        })
      }

      // Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Normalizar allowedRoles a array
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
      
      // Si se especificaron roles, verificar que el usuario tenga uno de ellos
      if (rolesArray.length > 0 && !rolesArray.includes(decoded.role)) {
        return res.status(403).json({
          error: 'Permiso denegado',
          message: `Solo usuarios con rol ${rolesArray.join(' o ')} pueden acceder`
        })
      }

      // Guardar datos del usuario en req para usarlos después
      req.user = decoded
      next()
      
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expirado',
          message: 'El token ha expirado. Haga login nuevamente'
        })
      }
      
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Token inválido',
          message: 'El token es inválido o ha sido manipulado'
        })
      }

      res.status(500).json({
        error: 'Error de autenticación',
        message: err.message
      })
    }
  }
}

// Middleware específicos para cada rol
const authAdmin = createAuthMiddleware('admin')
const authCliente = createAuthMiddleware('cliente')
const authDelivery = createAuthMiddleware('delivery')
const authAny = createAuthMiddleware()  // Cualquier usuario autenticado

module.exports = {
  createAuthMiddleware,
  authAdmin,
  authCliente,
  authDelivery,
  authAny
}
