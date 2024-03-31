const express = require('express');
const { FetchOrders,CreateOrders } = require('../controller/Order');

const router = express.Router();

<<<<<<< HEAD
router.get('/', CreateOrders)
.get('/send-orders',FetchOrders)
=======
router.get('/', FetchOrders)
.get('/id:')
>>>>>>> origin/main
      




exports.router = router;