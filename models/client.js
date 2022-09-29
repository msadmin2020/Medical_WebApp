const mongoose = require('mongoose');

//creating a schema for client
const clientSchema = new mongoose.Schema({
    client_name: {
        type:String,
        required:true,
    },
    surname: {
        type:String,
        required:true
    },
    mobile_number: {
        type:Number,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    }
});


//now we need to create a collection for client
const Client = new mongoose.model('Client',clientSchema);
module.exports = Client;