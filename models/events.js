const mongoose =  require('mongoose')

const eventSchema =  new mongoose.Schema({
    title:{ type: String, required: true }, 
    start: { type: String, required: true }, 
    end: { type: String, required: false }, 
    user: { type: mongoose.Types.ObjectId, ref: "users" }   
})

const Event = mongoose.model('events', eventSchema)
module.exports = Event