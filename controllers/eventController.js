const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const authController = require('./../controllers/authController');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.createEvent = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const filteredBody = filterObj(req.body, 'events');
    console.log(filteredBody);


     // update user document
     const userEvent = await User.findByIdAndUpdate(req.user.id, {$push: { events: req.body }}, {
        safe: true, 
        upsert: true, 
        new: true,
        runValidators: true,
    });

    const token = signToken(userEvent._id);

    res.status(200).json({
        status: 'succes',
        token,
        data: {
            user: userEvent,
        },
    });
});


exports.getAllEvents = catchAsync(async (req, res, next) => {
    const users = await User.find();
    
    if(!users) {
        return next(new AppError('You are not logged in. Please login to get access to all booking-events', 401));
    }
    const eventsArray = [];

    for(let i = 0; i < users.length; i++){
        eventsArray.push(users[i].events);
    };

    const token = signToken(users._id);

    res.status(200).json({
        status: 'succes',
        token,
        results: eventsArray.length,
        data: {
            user: eventsArray,
        },
    });
});

exports.getAllEventsOnUser = catchAsync(async (req, res, next) => {
    const eventsArray = [];
    const user = await User.findById(req.params.id);

    eventsArray.push(user.events);
  
    const token = signToken(user._id);

    res.status(200).json({
        status: 'succes',
        token,
        data: {
            user: eventsArray,
        },
    });
});

exports.getSingleEventOnUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ "_id": req.params.id });

    const userEvent = user.events.id(req.body._id);
    console.log(userEvent);

    const token = signToken(user._id);

    res.status(200).json({
        status: 'succes',
        token,
        data: {
            user: userEvent,
        },
    });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
    // update user document
    const user = await User.updateOne({"_id": req.params.id}, {"$pull": { events: { "_id": req.body._id }}}, {
        multi: true,
    });
    

    const token = signToken(user._id);

    res.status(200).json({
        status: 'succes',
        token,
        data: {
            user: user,
        },
        message: "Event has been deleted",
    });
});

//getEventsOnUser

//getSingleEventOnUser



//deleteEvent

//updateEvent

// exports.signup = catchAsync(async (req, res, next) => {
//     // By specifying the fields like this instead of only "req.body" we only allow the data that we actually need to be put into the new user.
//     const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         passwordConfirm: req.body.password,
//         passwordChangedAt: req.body.passwordChangedAt,
//         role: req.body.role,
//         age: req.body.age,
//         message: req.body.message,
//     });

//     createSendToken(newUser, 201, res);
    // const token = signToken(newUser._id);
    // res.status(201).json({
    //     status: 'succes',
    //     token,
    //     data: {
    //         user: newUser,
    //     }
    // });
// });