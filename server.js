require('dotenv').config()
require('./config/database')
const express = require("express");
const cors = require("cors")
const Router = require('./routes/routes')
const session = require('express-session') // requerir el modulo express-session para manejar las sesiones de los usuarios.
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 8082
const HOST = process.env.HOST || '0.0.0.0'
const path = require ('path')

const app = express()

app.use(cors())
app.use(express.json())




app.use(express.static('client')) //Definir el directorio cliente como directorio raiz
app.use(bodyParser.json()) //Iniciar el módulo body-parser para interpretar datos en formato JSON.
app.use(bodyParser.urlencoded({ extended: true}))
app.use(session({ //Iniciar modulo de manejo de sesiones
    secret: 'secret-pass', //Cadena de caracteres secreta para firmar el Identificador de la sesión cookie
    cookie: { maxAge: 3600000 }, //Mantener las cookies de la sesión iniciada por una hora
    resave: false,
    saveUninitialized: true,
  }));

  app.use('/api', Router)


app.listen(PORT, HOST,()=>console.log('Server ready on PORT '+PORT))

