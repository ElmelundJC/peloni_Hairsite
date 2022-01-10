const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

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

exports.updateMe = catchAsync (async (req, res, next) => {
    // Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update. Please use /updateMyPassword', 400));
    }
    // Tager 2 parameter -> Første er req.body, hvilket er det vi vil filtrere. De næste objekter er de objekter fra vores model vi gerne vil opdatere. Resten af de værdier fra vores model, vil blive sorteret fra således at disse ikke kan ændres.
    const filteredBody = filterObj(req.body, 'name', 'email');
    // console.log(req.body);

    // update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { 
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        }
    });
});

// Vi ønsker ikke at delete brugeren totalt fra databasen. Da vi ikke er helt færdig med at behandle personen i systemet. 
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getUser = catchAsync(async (req, res, next) => {

        const user = await User.findById(req.params.id);
        // const user = await User.findOne({ _id: req.params.id });

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