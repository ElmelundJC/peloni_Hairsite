const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
        // secure: true, // cookie vil kun blive sendt ved en encrypted connection (ved https)
        httpOnly: true // Cookie kan ikke tilgåes eller modificere af hvilken som helst browser. (for at undgå cross site scripting attack), så det der sker er at browseren modtager cookien, gemmer den og sender den automatisk afsted ved hver request
    };
    // Cookien bliver nu kun sendt afsted når production "mode" er slået til.
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Fjerner password fra outputtet
    user.password = undefined;

    res.status(statusCode).json({
        status: 'succes',
        token,
        data: {
            user,
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    // By specifying the fields like this instead of only "req.body" we only allow the data that we actually need to be put into the new user.
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.password,
        passwordChangedAt: req.body.passwordChangedAt,
        phone: req.body.phone,
        role: req.body.role,
        age: req.body.age,
        message: req.body.message,
    });

    createSendToken(newUser, 201, res);
    // const token = signToken(newUser._id);
    // res.status(201).json({
    //     status: 'succes',
    //     token,
    //     data: {
    //         user: newUser,
    //     }
    // });
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

    createSendToken(user, 200, res);
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
});

exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
    });
    res.redirect('/');
};

exports.protect = catchAsync(async (req, res, next) => {
        let token;
        // 1) Getting token and check if it exists
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];   
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
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

        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again', 401));
        };

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array og hvis den enkelte rolle ikke er inkluderet i arrayet er det den rolle useren har tildelt.

        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get User based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    // validate before save -> deaktivere alle validators på dokumentet i skemaet
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Reset Token der sendes via URL er den non-encrypterede token og den vi har i databasen er encyrpteret. Derfor skal det nye password selvfølgelig encrypte den nye token.
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt : Date.now() } });
    // if token has not expired, and there is a user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
      }
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save(); // her vil vi ikke slå validators fra!

    // Update changedPasswordAt property for the user

    // Log the user in, send JWT
    createSendToken(user, 200, res);
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    // Check if POSTed current password is correct
    if(!( await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }
    // if so, update passwrod
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate vil ikke fungere, da validatoren i vores model kun fungere med create og save

    // Log user in, send JWT
    createSendToken(user, 200, res);
});