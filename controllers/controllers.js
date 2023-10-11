const mercadopago = require('mercadopago/lib/mercadopago')
const Producto = require('../models/products-models')
const colors = require('colors')

const productosGet = async (req, res) => {
  try {
    const registros = await Producto.find().lean()
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

  // Recorrer el arreglo de ids para encontrar coincidencia en la BD y restar Stock
  ids.forEach((id) => {
    console.log(colors.bgGreen(id))

    const productAct = registros.find((p) => p.id === id[0])
    productAct.cantidad = id[1]
    console.log(colors.bgRed(productAct))

    
   //productAct.cantidad = id[1]
    console.log(`Este es el product Act ${productAct}`)

    // Agregar la preferencia de MP
    preference.items.push({
      title: productAct.name,
      unit_price: productAct.price,
      quantity: productAct.cantidad,
    })

    const idMongo = productAct._id.valueOf()
    console.log(idMongo)

  })


    // Traer el _id de la base y eliminarlo - Para agregar el producto actualizado
    const actualizarStock = async () => {
      try {
        //
        await Producto.findByIdAndDelete(idMongo)

        const { name, price, image, stock, category, cantidad } = productAct
        const productoNuevo = new Producto({
          id,
          name,
          price,
          image,
          stock,
          category,
          cantidad,
        })
        console.log(productoNuevo)

        //  FUNCIONO CARAJOOOOOOOOO!!!!
        await productoNuevo.save()
        console.log('gato')
      } catch (err) {
        console.log(err)
      }
    }
    // [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    actualizarStock() // Ejecutandolo fuera del forEach me tiraba ese error
  


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
