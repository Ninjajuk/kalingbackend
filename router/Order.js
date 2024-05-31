const express = require('express');
const { FetchAllOrders,createOrder,updateOrder,fetchOrdersByUser,sendMEailOrder } = require('../controller/Order');

const router = express.Router();

router
.post('/',createOrder)
.get('/', fetchOrdersByUser)
// .delete('/:id', deleteOrder)
.patch('/:id', updateOrder)
.get('/all',FetchAllOrders)
.get('/testemail',sendMEailOrder)
      




exports.router = router;