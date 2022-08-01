const Usuarios = require('../models/users')
const Eventos = require('../models/events')

const usersControllers = {

    demo: async (req,res)=>{
        Usuarios.find({user: req.query.user}).count({}, function(err, count) { 
          if(count>0){ 
              res.send("Utilice los siguientes datos: </br>usuario: demo | password:123456 </br>usuario: adrian | password:123456") 
          }else{
            Eventos.find({}).count({}, function(err, count) { 
              if(count>0){ 
                Eventos.remove({},function(err, doc){ 
                if(err){
                  console.log(err)
                }else{
                  console.log("Información de eventos reinicializada") 
                }
              })
            }
          })
            crearUsuarioDemo((error, result) => { 
              if(error){
                res.send(error) 
              }else{
                res.send(result) 
              }
            })
          }
        })
      }, 
      login: (req,res)=>{
       
        let user = req.body.user //Obtener la informacion del nombre de usuario enviada desde el formulario
        let password = req.body.pass //Obtener la informacion de la conrtaseña de usuario enviada desde el formulario
        let sess = req.session; //iniciar el manejador de sesiones.
      
        
       Usuarios.find({user: user}).count({}, function(err, count) { //Verificar que el usuario está registrado
        if (err) {
                res.status(500)
                res.json(err) //Devolver mensaje de error
            }else{
              if(count == 1){ //Si el usuario existe
                Usuarios.find({user: user, password: password }).count({}, function(err, count) { //Verificar su contraseña
                    if (err) {
                        res.status(500) //Devolver status de error
                        res.json(err) //Devolver devolver el error en formato json
                    }else{
                      if(count == 1){ //Si ambos campos coinciden con el registro de la base de datos, enviar mensaje Validado
                        sess.user = req.body.user; //Guardar el nombre del usuario en la variable de manejo de sesiones
                        res.send("Validado") //Devolver mensaje
                      }else{ //Si la contraseña no coincide, enviar mensaje de error de contraseña
                        res.send("Contraseña incorrecta") //Devolver mensaje
                      }
                    }
                })
              }else{
                res.send("Usuario no registrado") //Mostrar mensaje Usuario o registrado
              }
            }
    
        })
    },
    logOut: (req,res)=>{
        req.session.destroy(function(err) {
        if(err) {
          console.log(err); //Mostrar mensaje de error en cónsola
          res.json(err) //Devolver mensaje de error
        } else {
          req.session = null //Elimina las cookies de la session
          res.send('logout') //Devolver logout como respuesta
          res.end()
        }
        });
      }
}
const crearUsuarioDemo = function(callback){  
    var arr = [{ email: 'demo@mail.com', user: "demo", password: "123456"}, { email: 'adrian@mail.com', user: "adrian", password: "123456"}]; 
    Usuarios.insertMany(arr, function(error, docs) { 
      if (error){ 
        if (error.code == 11000){ 
          callback("Utilice los siguientes datos: </br>usuario: demo | password:123456 </br>usuario: adrian | password:123456") 
        }else{
          callback(error.message) 
        }
      }else{
        callback(null, "El usuario 'demo' y 'adrian' se ha registrado correctamente. </br>usuario: demo | password:123456 </br >usuario: adrian | password:123456") 
      }
    });
  }

  module.exports = usersControllers