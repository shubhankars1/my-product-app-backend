const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    _id:Number,
    name:String,
    barcode:String,
    createdOn:String,
    expiredOn:String,
    price:Number,
    qty:Number,
    
},{versionKey:false});

const Product =new mongoose.model('Product',productSchema,'productCollection')

module.exports=Product;