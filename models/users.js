const mongoose =  require('mongoose')

const userSchema =  new mongoose.Schema({
    user: { type: String, required: true, unique: true}, //variable usuario - Obligatoria
    email: { type: String, required: true }, //variable email - Obligatoria
    password: { type: String, required: true}, //variable contraseña - Obligatoria    
})

const User = mongoose.model('users', userSchema)
module.exports = User