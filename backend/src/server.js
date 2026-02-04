require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { COMMON_ERROR } = require('./utils/messages')

const app = express()
const PORT = process.env.PORT || 3000

// @CORS configuration
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())

// @routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/lockers', require('./routes/lockers'))
app.use('/api/orders', require('./routes/orders'))

// @error handling
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err)
  res.status(500).json({
    error: COMMON_ERROR,
    message: err.message,
  })
})
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`)
})

module.exports = app

