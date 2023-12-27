const express=require('express')
const {CreateProduct,FetchallProducts,editProduct,removeproduct,GetProductsByCategory,SearchProducts}= require('../controller/product')
const router=express.Router()


router.get('/',FetchallProducts)
    .post('/addproduct',CreateProduct)
    .put('/editproduct/:productId',editProduct)
    .delete('/deleteproduct/:productId',removeproduct)
    .get('/category/:category',GetProductsByCategory)
    .get('/search',SearchProducts)

exports.router = router;