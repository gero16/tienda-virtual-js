const mercadopago = require('mercadopago/lib/mercadopago')
const Producto = require('../models/products-models')
const colors = require('colors')

const productosGet = async (req, res) => {
  try {
    const registros = await Producto.find().lean()
    const registrosOrdenados = registros.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
    //console.log(colors.bgRed(registrosOrdenados))
    let msg = 'Registros Encontrados'

    if (!registros.length) {
      msg = 'No existen registros'
    }

    return res.status(200).json({
      msg,
      registros,
    })
  } catch (error) {
    console.error(error)
    let msg = 'Error en la Consula'
    return res.status(500).json({
      msg,
    })
  }
}

const checkoutPost = async (req, res) => {
  console.log(req.body)
  const producto = req.body
  return producto
}

const productosPost = async (req, res) => {
  const body = req.body
  ids = body[1]
  console.log(colors.bgBlue(ids))

  // Leer archivos de la BD -
  const registros = await Producto.find().lean()

  // Preferencias - Para mandar el producto por MP
  let preference = {
    items: [],
    back_urls: {
      success: 'http://localhost:3000/feedback',
      failure: 'http://localhost:3000/feedback',
      pending: 'http://localhost:3000/feedback',
    },
    auto_return: 'approved',
  }

  console.log(`Esto es el ids ${ids}`)

  ids.forEach((id) => {
    console.log(colors.bgGreen(id.cantidad))

    const productAct = registros.find((p) => p.id === id.id)
    console.log(colors.bgRed(productAct))
    productAct.cantidad = id.cantidad
    
   //productAct.cantidad = id[1]
    console.log(`Este es el product Act ${productAct}`)

    // Agregar la preferencia de MP
    preference.items.push({
      title: productAct.name,
      unit_price: productAct.price,
      quantity: productAct.cantidad,
    })

    const idMongo = productAct._id.valueOf()
   
    const actualizarStock = async () => {
      try {
        productAct.cantidad = 0
        await Producto.findByIdAndUpdate(idMongo, productAct)
        console.log('Producto actualizado!')
      } catch (err) {
        console.error('Error al buscar el producto:', err);
      }
    }

    actualizarStock()  
  })

  const mpPreferencias = async () => {
    // LLamar a mercado pago y mandarle las preferencias
    const response = await mercadopago.preferences.create(preference)
    console.log(response.body.id)
    const preferenceId = response.body.id

    console.log('ejecutame esta')
    res.send({ preferenceId })
  }
  mpPreferencias()
  
}

module.exports = {
  productosGet,
  productosPost,
  checkoutPost,
}
