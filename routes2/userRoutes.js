const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);


// EventRoutes
router.get('/getAllEvents', authController.protect, authController.restrictTo('admin', 'user'), eventController.getAllEvents);
router.get('/getAllEventsOnUser/:id', authController.protect, authController.restrictTo('admin', 'user'), eventController.getAllEventsOnUser);
router.get('/getSingleEventOnUser/:id', authController.protect, authController.restrictTo('admin', 'user'), eventController.getSingleEventOnUser);
router.patch('/createEvent/:id', authController.protect, authController.restrictTo('admin', 'user'), eventController.createEvent);
router.patch('/deleteEvent/:id', authController.protect, authController.restrictTo('admin', 'user'), eventController.deleteEvent);



// User routes
router.get('/getUser/:id', authController.protect, authController.restrictTo('admin'), userController.getUser);

router
    .route('/')
    .get(userController.getAllUsers);


router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(authController.protect, userController.deleteUser);


module.exports = router;