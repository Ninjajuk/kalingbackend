const express = require('express');
const { FetchOrders, } = require('../controller/Order');

const router = express.Router();

router.get('/', FetchOrders)
.get('/id:')
      




exports.router = router;