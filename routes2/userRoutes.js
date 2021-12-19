const express = require('express');
const User = require('../models/userModel');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const getAllEvents = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};

const createUser = async (req, res, next) => {
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.password,
            role: req.body.role,
            age: req.body.age,
            message: req.body.message,
        });

        res.status(201).json({
            data: {
                user: newUser,
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.body.id);

        if (!user) {
            return next(new Error('There was no user with that id'));
        }

        res.status(200).json({
            status: 'succes',
            data: {
                user: user,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};


const router = express.Router();

router.post('/signup', createUser);

router.get('/getUser', getUser);

router
    .route('/')
    .get(getAllUsers)
    .get(getAllEvents);


router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


module.exports = router;