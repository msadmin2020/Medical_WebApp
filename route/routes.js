const e=require('express');
var express=require('express');
var router=express.Router();
const Stock=require('../models/stock');
const Company=require('../models/company');
const Client=require('../models/client');
const Sales =require('../models/sales');
const axios=require('axios');
const { response } = require('express');
const controller=require('../controller/controller');

const credentials={
    username:"rajesh",
    password:"Matryx@123"
}

//********************  Login page *******************/

//login user
router.post('/login',(req,res)=>{
    if(req.body.username==credentials.username && req.body.password==credentials.password){
        req.session.user=req.body.username;
        //alert('Login Successful..!');
        res.redirect('/route/dashboard');
    }else{
        res.end('Invalid Username and Password');
    }
});

//********************  Home page  *******************/

//route for dashboard
router.get('/dashboard',(req,res)=>{
    if(req.session){
        res.render('dashboard',{user:req.session.user,title:"MSS - Dashboard"})
    }else{
        res.send('Unauthorized user')
        //res.redirect('dashboard')
    }
});

//********************  Logout  *******************/

//route for logout
router.get('/logout',(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            res.send("Error");
        }else{
            res.render('login',{title:"MSS - MainPage",logout:"Logout Successfully"})
        }
    })
});

//********************  Company Model *******************/

//API's for company model
router.post('/api/medical/companies',controller.createCompany); //Create a new company
router.get('/api/medical/companies',controller.findCompany); //Get all company details or single 
router.put('/api/medical/companies/:id/update',controller.updateCompanyDetail); //Update a company details
router.delete('/api/medical/companies/:id',controller.deleteCompany); //Delete a company details
router.get("/api/medical/companies/:id/edit", controller.editCompany); //Get current company id and details
//router.put("/api/medical/companies/:id/update", controller.update);

//Navigate to Create new company page
router.get('/createNewCompany',(req,res)=>{
    if(req.session){
        res.render('createNewCompany',{user:req.session.user,title:"MSS - New Company"})
    }else{
        console.log('Failed to create company details: ');
        //res.redirect('createNewCompany',{user:req.session.user,title:"MSS - New Company"})
    }
});

//Navigate to Company details page and displaying all company details
router.get('/companyDetails',(req,res)=>{
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/companies")
        .then(function(companyDetailsData){
            res.render('companyDetails',{user:req.session.user,title:"MSS - Company Details",companyDetails:companyDetailsData.data})
        })
        .catch(err=>{
            console.log('Failed to retrieve the companies list: ' + err);
            
        })        
    }else{
        res.send('Unauthorized user')
        //res.redirect('companyDetails',{user:req.session.user,title:"MSS - Company Details",companyDetails:companyDetailsData.data})
    }
});

//********************  Stock Model *******************/

//API's for stock model
router.post('/api/medical/stocks',controller.createStock); //Create a new stock
router.get('/api/medical/stocks',controller.findStock); //Get all stock details or single 
router.put('/api/medical/stocks/:id/update',controller.updateStockDetail); //Update a stock details
router.put('/api/medical/stocks/:id/updateAfterSell',controller.updateStockDetailAfterSell); //Update a stock details
router.delete('/api/medical/stocks/:id',controller.deleteStock); //Delete a stock details
router.get("/api/medical/stocks/:id/edit", controller.editStock); //Get current stock id and details
//router.put("/api/medical/stocks/:id/update", controller.update);

//Add new stock
router.get('/createNewStock',(req,res)=>{
    if(req.session){
        Company.find((err, data) => {
            if (!err) {
                res.render('createNewStock', {user:req.session.user, title:"MSS - New Stock", getCompany: data});
            } else {
                console.log('Failed to create stock details: ' + err);
            }
        });        
    }else{
        res.send('Unauthorized user')
    }
});

//Navigate to Stock Details page and displaying all Stock details
router.get('/stockDetails',(req,res)=>{
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/stocks")
        .then(function(stockDetailsData){
            res.render('stockDetails',{user:req.session.user,title:"MSS - Stock Details",stockDetails:stockDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the stocks list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});

//********************  Client Model *******************/

//API's for client model
router.post('/api/medical/clients',controller.createClient); //Create a new clients
router.get('/api/medical/clients',controller.findClient); //Get all stock clients or single 
router.put('/api/medical/clients/:id/update',controller.updateClientDetail); //Update a clients details
router.delete('/api/medical/clients/:id',controller.deleteClient); //Delete a clients details
router.get("/api/medical/clients/:id/edit", controller.editClient); //Get current clients id and details
//router.put("/api/medical/clients/:id/update", controller.update);

//Add new clients
router.get('/createNewClient',(req,res)=>{
    if(req.session){
        res.render('createNewClient', {user:req.session.user, title:"MSS - New Client"});        
    }else{
        res.send('Unauthorized user')
    }
});

//Navigate to clients Details page and displaying all clients details
router.get('/clientDetails',(req,res)=>{
    if(req.session){
        axios.get("http://localhost:3000/route/api/medical/clients")
        .then(function(clientDetailsData){
            res.render('clientDetails',{user:req.session.user,title:"MSS - Client Details",clientDetails:clientDetailsData.data})
        }) 
        .catch(err=>{
            console.log('Failed to retrieve the clients list: ' + err);
        })        
    }else{
        res.send('Unauthorized user')
    }
});


//********************  Sales Model *******************/

//API's for sales model
router.post('/api/medical/sales',controller.createSales); //Create a new Sales
router.get('/api/medical/sales',controller.findSales); //Get all Sales details or single 
router.put('/api/medical/sales/:id/update',controller.updateSalesDetail); //Update a Sales details
router.delete('/api/medical/sales/:id',controller.deleteSales); //Delete a Sales details
router.get("/api/medical/sales/:id/edit", controller.editSales); //Get current Sales id and details
//router.put("/api/medical/clients/:id/update", controller.update);

//Navigate to Sales Details page and displaying all Sales details
router.get('/salesDetails',(req,res,next)=>{    
    if(req.session){
        Stock.find(function(err,medicineData){
            Client.find(function(err,clientData){
                Sales.find(function(err,salesData){
                    //console.log(medicineData)
                    res.render('salesDetails',{user:req.session.user, title:'MSS- Sales Details', getSales:salesData, getMedicine: medicineData, getClient: clientData},(error, html) =>{
                        if(error){ 
                            console.log(error) 
                            next(error)
                            return
                        }
                        res.send(html) 
                    })
                })                              
            })
        })
    }else{
        res.send('Unauthorized user')
        //res.redirect('salesDetails',{user:req.session.user, title:'MSS- Sales Details', getMedicine: user, getClient: data})
    }
});

module.exports = router;