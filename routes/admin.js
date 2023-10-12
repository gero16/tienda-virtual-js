const { Router } = require('express')
const Producto = require('../models/products-models')
const router = Router()


router.post('/agregar-producto', async (req, res) => {
    const { id, name, price, image, category, stock, cantidad } = req.body
    const producto = new Producto({
        id: id,
        name: name,
        price: price,
        image: image,
        category: category,
        stock : stock,
        cantidad: cantidad,
    })

    await producto.save();
    res.status(200).json({"Producto Agregado": `id: ${producto.id} - nombre : ${producto.name}`})
})



module.exports = router
