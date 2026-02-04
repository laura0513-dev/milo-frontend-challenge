const bcrypt = require('bcryptjs');

/**
 * Genera un hash seguro de una contraseña usando bcryptjs
 * 
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 * 
 * Uso:
 * const hash = await hashPassword('mi_contraseña');
 * // Guardar hash en BD
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifica una contraseña contra su hash
 * 
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado en BD
 * @returns {Promise<boolean>} true si coinciden, false si no
 * 
 * Uso:
 * const isValid = await verifyPassword('mi_contraseña', hash);
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
