const crypto = require('crypto');
require('dotenv').config();

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

/**
 * Valida que la clave de encriptación esté configurada correctamente
 */
function validateEncryptionKey() {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY no está configurada en las variables de entorno');
  }
  
  const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY debe ser una cadena hexadecimal de 64 caracteres (32 bytes)');
  }
}

/**
 * Genera un código de 6 dígitos aleatorio
 * @returns {string} Código de 6 dígitos
 */
function generateDeliveryCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Encripta un código usando AES-256-CBC
 * @param {string} code - Código a encriptar
 * @returns {Object} Objeto con el código encriptado y el IV
 */
function encryptCode(code) {
  validateEncryptionKey();
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM, 
    Buffer.from(ENCRYPTION_KEY, 'hex'), 
    iv
  );
  
  let encrypted = cipher.update(code, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted: encrypted,
    iv: iv.toString('hex')
  };
}

/**
 * Desencripta un código previamente encriptado
 * @param {string} encrypted - Código encriptado en hexadecimal
 * @param {string} iv - Initialization Vector en hexadecimal
 * @returns {string} Código desencriptado
 */
function decryptCode(encrypted, iv) {
  validateEncryptionKey();
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    Buffer.from(ENCRYPTION_KEY, 'hex'), 
    Buffer.from(iv, 'hex')
  );
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Verifica si un código ha expirado (más de 60 segundos)
 * @param {Date|string} generatedAt - Fecha de generación del código
 * @returns {boolean} true si el código expiró
 */
function isCodeExpired(generatedAt) {
  if (!generatedAt) return true;
  
  const generated = new Date(generatedAt);
  const now = new Date();
  const diffSeconds = (now - generated) / 1000;
  
  return diffSeconds > 60;
}

/**
 * Obtiene los segundos restantes hasta que el código expire
 * @param {Date|string} generatedAt - Fecha de generación del código
 * @returns {number} Segundos restantes (0 si ya expiró)
 */
function getSecondsUntilExpiration(generatedAt) {
  if (!generatedAt) return 0;
  
  const generated = new Date(generatedAt);
  const now = new Date();
  const diffSeconds = (now - generated) / 1000;
  const remaining = Math.max(0, 60 - Math.floor(diffSeconds));
  
  return remaining;
}

module.exports = {
  generateDeliveryCode,
  encryptCode,
  decryptCode,
  isCodeExpired,
  getSecondsUntilExpiration
};
