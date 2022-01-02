// Skrevet af Christian
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');



exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.params.id);


    if (!user) {
        return next(new AppError('There was no user with that id', 404));
    }

    res.status(200).json({
        status: 'succes',
        data: {
            user: user,
        },
    });
});

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};