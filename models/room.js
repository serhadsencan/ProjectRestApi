var mongoose = require('mongoose');
const Room = mongoose.model('Room',{
    title:{
        type:String,
        required:true,
        trim:true
    },
    host:
    {
        type:String,
        required:true,
    },
    guest:{
        type:String,
    },
    password:{
        type:String,
        required:false,
        trim:true
    },
    status:{
        type:Boolean,
        required:true
    }
})


module.exports = Room