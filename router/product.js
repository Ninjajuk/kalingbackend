const express=require('express')
const {CreateProduct,FetchallProducts,fetchProductById,editProduct,removeproduct,GetProductsByCategory,SearchProducts}= require('../controller/product')
const router=express.Router()


router.get('/',FetchallProducts)
    .get('/:productId',fetchProductById)
    .post('/addproduct',CreateProduct)
    .put('/editproduct/:productId',editProduct)
    .delete('/deleteproduct/:productId',removeproduct)
    .get('/category/:category',GetProductsByCategory)
    .get('/search',SearchProducts)

exports.router = router;