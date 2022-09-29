const mongoose = require('mongoose');

//creating a schema for company
const companySchema = new mongoose.Schema({
    company_name: {
        type:String,
        required:true,
        unique:true
    },
    address: {
        type:String,
        required:true
    },
    contact_person_name: {
        type:String,
        required:true
    },
    mobile_number: {
        type:Number,
        required:true
    }
});


//now we need to create a collection for company
const Company = new mongoose.model('Company',companySchema);
module.exports = Company;