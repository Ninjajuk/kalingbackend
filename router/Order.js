const express = require('express');
const { FetchOrders,CreateOrders } = require('../controller/Order');

const router = express.Router();

router.get('/', CreateOrders)
.get('/send-orders',FetchOrders)
      




exports.router = router;