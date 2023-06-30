require('dotenv').config()

const express = require('express')
const colors = require('colors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const { dbConnection } = require('./database/config')
const routes = require('./routes/routes')

const app = express()
const port = 5000

const mercadopago = require('mercadopago')
// Agrega credenciales
mercadopago.configure({
  access_token:
    'APP_USR-3488859500794386-010715-9adf8e40ec5dd43f090030975e9e633f-370206533',
})

// process.env.PORT - Si el servidor me esta dando un puerto tome ese
app.set('port', process.env.PORT || port)

// Para usar lo que hay html en la ruta principal "/"
app.use('/', express.static('public/html'))
// Para usar todo lo de public
app.use(express.static('public'))

app.use(morgan('dev'))

app.use(bodyParser.json())

app.use(routes)

const conectarDB = async () => {
  await dbConnection()
}
conectarDB()

app.listen(app.get('port'), () => {
  console.log(colors.blue(`Puerto corriendo en: ${port} :)`))
})
