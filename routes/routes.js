const { Router } = require('express')
const {
  productosGet,
  productosPost,
  checkoutPost,
} = require('../controllers/controllers')

const router = Router()

// Mandar a /api/productos los datos de la BD
router.get('/api/productos', productosGet)

/*
router.post('/api/checkout', checkoutPost)
*/

router.post('/api/pay', productosPost)

module.exports = router
