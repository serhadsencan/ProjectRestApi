var mongoose = require('mongoose');

const Client = mongoose.model('Client',{
    userName:{
        type:String,
        required:false,
        trim:true
    },
    userId:{
        type:String,
        required:false,
        trim:true
    },
    roomId:{
        type:String,
        required:true,
        trim:true
    },
    host:{
        type:String,
        required:true
    },
    localIp:{
        type:String,
        required : false
    },
    localPort:{
        type:String,
        required:false
    },
    publicIp:{
        type:String,
        required:false,
        trim:true
    },
    publicPort:{
        type:String,
        required:false
    }
})


module.exports = Client