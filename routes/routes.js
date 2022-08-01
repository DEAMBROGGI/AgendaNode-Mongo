const Router = require('express').Router()
const usersControllers = require('../controllers/usersControllers')
const eventsControllers = require('../controllers/eventsControllers')

const {demo, login,logOut} = usersControllers
const {allEvents,newEvent,deleteEvent,updateEvent} = eventsControllers

Router.route("/demo")
.get(demo)

Router.route('/login')
.post(login)

Router.route('/logout')
.post(logOut)

Router.route("/all")
.get(allEvents)

Router.route("/new")
.post(newEvent)

Router.route("/delete/:_id")
.post(deleteEvent)

Router.route("/update/:_id&:start&:end") 
.post(updateEvent)

Router.all('/', function(req, res) {
    res.send('Error al mostrar el recurso solicitado. Por favor verifique la dirección url a la cual desea ingresar' )
    res.end()
  })
module.exports = Router