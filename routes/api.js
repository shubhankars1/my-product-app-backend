const express = require('express');
let router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/product');

const User = require('../models/user');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

let date = new Date();

// ==============================>

// use mongoose
mongoose.connect("mongodb://127.0.0.1:27017/productApi",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("mongoDb Connected");
}).catch((err)=>{
    console.log(err);
})

// Create
router.post('/post', (req,res)=>{
    let _id=req.body._id;
    let name=req.body.name;
    let barcode=req.body.barcode;
    let createdOn=req.body.createdOn;
    let expiredOn=req.body.expiredOn;
    let price=req.body.price;
    let qty=req.body.qty;

    let productModel = new Product();

    productModel._id = _id;
    productModel.name = name;
    productModel.barcode = barcode;
    productModel.createdOn = createdOn
    productModel.expiredOn = expiredOn
    productModel.price = price;
    productModel.qty = qty;

    productModel.save().then(()=>{
        res.status(202).json({
            message:'Product added Successfully'
        })
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    });

});


// router.post('/post/date', (req,res)=>{
//     let startDate = req.body.startDate;
//     let endDate = req.body.endDate;

//     Product.find({
//         createdOn : {
//             $gte:startDate,
//             $lte:endDate
//         }

//     }).then((data)=>{
//         res.status(202).json({
//             Products:data
//         })
//     })
// })

// Read 
//for get all Products GET API
router.get('/products', (req,res)=>{
    Product.find({}).then((data)=>{
        res.status(202).json({Products:data})
    }).catch((err)=>{
        res.status(404).json({message:err})
    })
})

// for get Product by ID GET API
router.get('/products/:id', (req,res)=>{
    Product.findById(req.params.id).exec().then((data)=>{
        res.status(202).json({Product:data})
    }).catch((err)=>{
        res.status(404).json({message:err})
    })
})


// Update : for update a product
// update whole dataSet of a product
 router.put('/products/:id', checkAuth, (req,res)=>{
    Product.findByIdAndUpdate(req.params.id,{
         $set:{
           name : req.body.name,
           barcode : req.body.barcode,
           price : req.body.price,
           qty : req.body.qty
         }
     }).then((data)=>{
        res.status(202).json({message:'Updated'})
     }).catch((err)=>{
         res.status(404).json({message:err})
         console.log(err);
     });
 });


 // PATCH request
// update only required data
router.patch('/products/:id', (req,res)=>{
    Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true
    }).then((data)=>{
        res.status(202).json({message:'Updated'})
    }).catch((err)=>{
        res.status(404).json({message:err})
    })
})


// DELETE
// for Delete API
router.delete('/products/:id', (req,res)=>{
    Product.findByIdAndDelete(req.params.id).then(()=>{
        res.status(202).json({message:'Deleted'})
    }).catch((err)=>{
        res.status(404).json({message:err})
    })
})

router.post('/user/add', (req,res)=>{
    let name=req.body.name;
    let email=req.body.email;
    let pass=req.body.pass;


    const saltRounds = 11;
    let newUserModel = new User();

    bcrypt.genSalt(saltRounds, function(err,salt) {
        bcrypt.hash(pass, salt, function(err, hash){
            newUserModel.email=email;
            newUserModel.pass=hash;
            newUserModel.name=name;
            newUserModel.save().then(()=>{
                res.status(202).json({message:'SignUp Successfully'})
            }).catch((err)=>{
                res.status(202).json({message:err})
            })
        })
    })
})

router.post('/user/login',(req,res)=>{
    let email = req.body.email;
    let pass = req.body.pass;

    User.findOne({'email':email}).then((user)=>{
        if(user===null) {
            res.status(404).json({message:'User not found'});
        } else {
            const hashPass=user.pass;
            bcrypt.compare(pass, hashPass, (err,result)=>{
                if(result) {

                    const token = jwt.sign({
                        'user':user.name,
                        'email':user.email,
                    },'secret',{'expiresIn':'1h'})

                    res.status(202).json({message:'Logged In Successfully', name:user.name, email:user.email, token:token});
                } else {
                    res.status(404).json({message:'Invalid Credentials'});
                }
            })
        }
    })
})




//==========================================================>>>>
module.exports=router;