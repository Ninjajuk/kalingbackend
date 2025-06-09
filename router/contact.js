const express = require('express');
const { contactForm } = require('../controller/contactForm');

const router = express.Router();

router.post('/', contactForm)

exports.router = router;