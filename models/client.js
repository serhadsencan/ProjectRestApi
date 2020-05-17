var mongoose = require('mongoose');

const Client = mongoose.model('Client',{
    userId:{
        type:String,
        required:true,
        trim:true
    },
    localIp:{
        type:String,
        required : true
    },
    localPort:{
        type:String,
    },
    publicIp:{
        type:String,
        required:false,
        trim:true
    },
    publicPort:{
        type:Boolean,
        required:true
    }
})


module.exports = Client