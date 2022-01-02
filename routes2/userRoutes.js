// Skrevet af Christian
const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);


router.get('/getUser/:id', authController.protect, userController.getUser);



router
    .route('/')
    .get(authController.protect, userController.getAllUsers);


router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;