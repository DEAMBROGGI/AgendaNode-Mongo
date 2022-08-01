const Usuario = require('../models/users')
const Evento = require('../models/events')

const eventsControllers = {

    allEvents: async (req, res) => {
        {
            req.session.reload(function (err) {
                if (req.session.user) {
                    if (err) {
                        res.send('logout');
                        res.end()
                    } else {
                        Usuario.findOne({ user: req.session.user }).exec({}, function (error, doc) {
                            if (error) {
                                res.send('logout');
                            } else {
                                Evento.find({ user: doc._id }).exec(function (err, doc) {
                                    if (err) {
                                        res.status(500)
                                        res.json(err)
                                    }
                                    res.json(doc)
                                })
                            }
                        })
                    }
                } else { 
                    res.send('logout'); 
                    res.end()
                }
            })
        }
    },
    newEvent: async (req, res) => {
        req.session.reload(function (err) { 
            if (err) {
                console.log(err); 
                res.json("logout"); 
            } else {
                Usuario.findOne({ user: req.session.user }).exec({}, function (error, doc) {

                    let title = req.body.title, 
                        start = req.body.start, 
                        end = req.body.end, 
                        userId = doc._id 

                    let evento = new Evento({ 
                        title: title,
                        start: start,
                        end: end,
                        user: userId
                    })
                    evento.save(function (error) { 
                        if (error) {
                            console.log(error) 
                            res.json(error) 
                        }
                        res.json(evento)

                    })
                })
            }
        })
    },
    deleteEvent: async (req, res) => {

        let id = req.params._id
        req.session.reload(function (err) {
            if (err) {
                console.log(err)
                res.send("logout")
            } else {
                Evento.deleteOne({ _id: id }, function (error) {
                    if (error) {
                        res.status(500)
                        res.json(error)
                    }
                    res.send("Registro eliminado")
                })
            }
        })

    },
    updateEvent: async (req, res) => { 
        req.session.reload(function (err) {
            if (err) {
                res.send("logout") 
            } else {
                Evento.findOne({ _id: req.params._id }).exec((error, result) => { 
                    let id = req.params._id, 
                        start = req.params.start, 
                        end = req.params.end 
                    if (error) { 
                        res.send(error) 
                    } else {
                        Evento.findOneAndUpdate({ _id: id }, { start: start, end: end }, (error, result) => { 
                            if (error) { 
                                res.send(error)
                            } else {
                                res.send("Evento ha sido actualizado") 
                            }
                        })
                    }
                })
            }
        })
    }
}
module.exports = eventsControllers