const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Medical",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Successfully connected MongooseDB.");
}).catch((err)=>{
    console.log("MongooseDB is not connected.");
});