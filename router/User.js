const express = require('express');
const { fetchUserById, updateUser } = require('../controller/User');

const router = express.Router();
//  /users is already added in base path
router.get('/user', fetchUserById)
      .patch('/:id', updateUser)

exports.router = router;