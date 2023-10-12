const { Router } = require('express')
const { productosGet, productosPost, checkoutPost } = require('../controllers/controllers')

const router = Router()


const rutasAdmin = require("./admin")

// Mandar a /api/productos los datos de la BD
router.get('/api/productos', productosGet)

/*
router.post('/api/checkout', checkoutPost)
*/

router.post('/api/pay', productosPost)

router.use("/admin",  rutasAdmin)



module.exports = router
