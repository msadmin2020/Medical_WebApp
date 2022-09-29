const req = require('express/lib/request');
const Company = require('../models/company');
const Stock = require('../models/stock');
const Client = require('../models/client');
const Sales = require('../models/sales');
const axios=require('axios');


//******************* Company Model *********************/

//create and save new company
exports.createCompany = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new company
        const company=new Company({
            company_name: req.body.company_name,
            address: req.body.address,
            contact_person_name: req.body.contact_person_name,
            mobile_number: req.body.mobile_number,
        });
        const companyInserted = await company.save();
        return res.status(200).render('createNewCompany',{user:req.session.user,title:"MSS - New Company"})
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all company/ retrieve and retrun a single company
exports.findCompany = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Company.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found company with id%d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving company details."});
        });
    }else{
        Company.find()
        .then(companyData=>{
            res.send(companyData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading company details."})
        });
    }    
}

//Fetching the specified company id's details
exports.editCompany = (req, res) => {
    let userId = req.params.id;
    Company.findById(userId)
      .then(user => {
        res.render("updateCompanyDetails", {user:req.session.user,title:"MSS - Update Company",updateCompany:user});
        console.log(updateCompany)
    })
    .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
    });
}

//Updating the specified company id's details
exports.updateCompanyDetail = (req, res) => {
    let userId = req.params.id,
    userParams = {
        company_name: req.body.company_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        mobile_number: req.body.mobile_number
    };
  
    Company.findByIdAndUpdate(userId, {$set: userParams})
        .then(user => {
            res.render('dashboard',{user:req.session.user,title:"MSS - dashboard"})
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
        });
}

//delete a company with specified company id in the request
exports.deleteCompany = (req,res)=>{
    const id=req.params.id;
    Company.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete company with id %d",id});
        }else{
            res.redirect(`/route/companyDetails`);
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting company details."});
    });
}


//******************* Stock Model *********************/

//create and save new stock
exports.createStock = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new stock
        const stock=new Stock({
            item_name:req.body.item_name,
            item_detail:req.body.item_detail,
            item_price:req.body.item_price,
            quantity:req.body.quantity,
            company_name: req.body.company_name,
            location: req.body.location,
            expire_date: req.body.expire_date
        });
        const stockInserted = await stock.save();
        Company.find(function(err,data){
            return res.status(200).render('createNewStock',{user:req.session.user,title:"MSS - New Stock",getCompany:data})
        })
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all stock/ retrieve and retrun a single stock
exports.findStock = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Stock.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found stock with id %d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving stock details."});
        });
    }else{
        Stock.find()
        .then(stockData=>{
            res.send(stockData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading stock details."})
        });
    }    
}

//Fetching the specified stock id's details
exports.editStock = (req, res) => {
    let userId = req.params.id;
    Stock.findById(userId,function(err,user){
        Company.find(function(err,data){
            res.render('updateStockDetails',{user:req.session.user,title:'MSS- Update Stock',updateStock:user,getCompany:data})
        })
    })
}

//Updating the specified stock id's details
exports.updateStockDetail = (req, res) => {
    let userId = req.params.id,
    userParams = {
        item_name:req.body.item_name,
        item_detail:req.body.item_detail,
        item_price:req.body.item_price,
        quantity:req.body.quantity,
        company_name: req.body.company_name,
        location: req.body.location,
        expire_date: req.body.expire_date,
    };  
    Stock.findByIdAndUpdate(userId, {$set: userParams})
        .then(user => {
          res.render('dashboard',{user:req.session.user,title:"MSS - dashboard"})
        })
        .catch(error => {
          console.log(`Error updating user by ID: ${error.message}`);
        });
}

//Updating the specified stock id's details after sell
exports.updateStockDetailAfterSell = (req, res) => {
    let userId = req.params.id;
    userParams = {
        item_name:req.body.item_name,
        item_detail:req.body.item_detail,
        item_price:req.body.item_price,
        quantity:req.body.quantity,
        company_name: req.body.company_name,
        location: req.body.location,
        expire_date: req.body.expire_date,
    };    
    Stock.findByIdAndUpdate(userId, {$set: userParams})
        .then(user => {
          res.render('dashboard',{user:req.session.user,title:"MSS - dashboard"})
        })
        .catch(error => {
          console.log(`Error updating user by ID: ${error.message}`);
        });
}

//delete a stock with specified stock id in the request
exports.deleteStock = (req,res)=>{
    const id=req.params.id;
    Stock.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete stock with id %d",id});
        }else{
            res.redirect(`/route/stockDetails`);
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting stock details."});
    });
}


//******************* Client Model *********************/

//create and save new client
exports.createClient = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new client
        const client=new Client({
            client_name: req.body.client_name,
            surname: req.body.surname,
            mobile_number: req.body.mobile_number,
            address: req.body.address,
            city: req.body.city            
        });
        const clientInserted = await client.save();
        return res.status(200).render('createNewClient',{user:req.session.user,title:"MSS - New Client"})
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all client/ retrieve and retrun a single client
exports.findClient = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Client.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found client with id %d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving client details."});
        });
    }else{
        Client.find()
        .then(clientData=>{
            res.send(clientData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading client details."})
        });
    }    
}

//Fetching the specified client id's details
exports.editClient = (req, res) => {
    let userId = req.params.id;
    Client.findById(userId)
      .then(user => {
        res.render("updateClientDetails", {user:req.session.user,title:"MSS - Update Client",updateClient:user});
        console.log(updateClient)
    })
    .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
    });
}

//Updating the specified client id's details
exports.updateClientDetail = (req, res) => {
    let userId = req.params.id,
    userParams = {
        client_name: req.body.client_name,
        surname: req.body.surname,
        mobile_number: req.body.mobile_number,
        address: req.body.address,
        city: req.body.city 
    };
  
    Client.findByIdAndUpdate(userId, {$set: userParams})
        .then(user => {
            res.render('dashboard',{user:req.session.user,title:"MSS - dashboard"})
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
        });
}

//delete a client with specified client id in the request
exports.deleteClient = (req,res)=>{
    const id=req.params.id;
    Client.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete client with id %d",id});
        }else{
            res.redirect(`/route/clientDetails`);
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting client details."});
    });
}


//******************* Sales Model *********************/

//create and save new sales
exports.createSales = async(req,res)=>{
    //validate request
    if(!req.body){
        res.status(404).send({message:"Content cannot be empty."});
        return;
    }
    try{
        //add new sales
        const sell=new Sales({
            src_customer_name: req.body.src_customer_name,
            medicine_name: req.body.medicine_name,
            medicine_quantity: req.body.medicine_quantity,
            medicine_price: req.body.medicine_price,
            sell_quantity: req.body.sell_quantity,   
            total_amount: req.body.total_amount          
        });
        const salesInserted = await sell.save();
        // return res.status(200).render('salesDetails',{user:req.session.user,title:"MSS - Sales Details"})

        axios.get("http://localhost:3000/route/api/medical/sales")
        Stock.find(function(err,medicineData){
            Client.find(function(err,clientData){
                Sales.find(function(err,salesData){
                    res.render('salesDetails',{user:req.session.user, title:'MSS- Sales Details', getMedicine: medicineData, getClient: clientData, getSales:salesData})
                })
            })
        })
    }catch(error){
        res.status(400).send(error);
    }
}

//retrieve and return all sales/ retrieve and retrun a single sales
exports.findSales = async(req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        Client.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"Cannot found client with id %d",id});
            }else{
                res.send(data);
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error an retrieving client details."});
        });
    }else{
        Client.find()
        .then(salesData=>{
            res.send(salesData)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while loading client details."})
        });
    }    
}

//Fetching the specified sales id's details
exports.editSales = (req, res) => {
    let userId = req.params.id;
    Client.findById(userId)
      .then(user => {
        res.render("updateClientDetails", {user:req.session.user,title:"MSS - Update Client",updateClient:user});
        console.log(updateClient)
    })
    .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
    });
}

//Updating the specified sales id's details
exports.updateSalesDetail = (req, res) => {
    let userId = req.params.id
    console.log(userId)
    userParams = {
        quantity: (req.body.medicine_quantity)-(req.body.sell_quantity)
    };
  
    Stock.findByIdAndUpdate(userId, {$set: userParams})
        .then(user => {
            res.render('salesDetails',{user:req.session.user,title:"MSS - Sales Details"})
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
        });
}

//delete a sales with specified sales id in the request
exports.deleteSales = (req,res)=>{
    const id=req.params.id;
    Client.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({message:"Cannot delete sales with id %d",id});
        }else{
            res.redirect(`/route/salesDetails`);
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error an deleting sales details."});
    });
}