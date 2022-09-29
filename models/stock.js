const mongoose = require('mongoose');

//creating a schema for stock
const stockSchema = new mongoose.Schema({
    item_name: {
        type:String,
        required:true
    },
    item_detail: {
        type:String,
        required:true
    },
    item_price: {
        type:Number,
        required:true
    },
    quantity: {
        type:Number,
        required:true
    },
    company_name: {
        type:String,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    expire_date: {
        type: Date,
        required:true,

    }
});


//now we need to create a collection for stock
const Stock = new mongoose.model('Stock',stockSchema);
module.exports = Stock;