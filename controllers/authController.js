const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // By specifying the fields like this instead of only "req.body" we only allow the data that we actually need to be put into the new user.
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.password,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
        age: req.body.age,
        message: req.body.message,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'succes',
        token,
        data: {
            user: newUser,
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check om email and password eksistere
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) check om brugeren eksistere
    // filter objectet { email: email }, i ES6 kan man omskrive til nedenstående
    const user = await User.findOne({ email }).select('+password');
    // password bliver hentet med fra db da man selecter +password

    // // da user er et dokument fra vores DB og vi i userModel har defineret en instance method til at sammenligne passwords kan vi her bruge: 
    if (!user || !(await user.correctPassword(password, user.password)))  {
        return next(new AppError('Incorrect email or password', 401));

    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
        let token;
        // 1) Getting token and check if it exists
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please login to get access.', 401));
        };

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }

        // 4) Check if user chaged password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again', 401));
        };

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
});