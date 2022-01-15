const express = require("express");
require('dotenv').config();
require('./database/db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit').default;
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const User = require('./models/userModel');
const userRouter = require('./routes2/userRoutes'); // Muligvis ligegyldig i app.js
const authController = require('./controllers/authController');

const productRouter = require("./routes/productRoutes");
const serviceRouter = require("./routes/serviceRoutes");



const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const fs = require("fs");

// ******* Middleware *********

// Set Security HTTP headers
// app.use(helmet());

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

// Sætter et max-limit for hvor mange gange en bruger kan foretage
const limiter = rateLimit({
    max: 30,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter);


// Data sanitization mod NoSQL query injection
// Fjerner dollar tegn og . fra requests.
// app.use(mongoSanitize());

// Data sanitization mod XSS
// nem omskrivning af html tegn < > som sikrer os mod xss angreb.
// app.use(xss());

// Prevent parameter pollution hvilket fjerner duplikater i query string // Whitelisting gør det muligt for nogle parametre at blive duplikeret i qString
// app.use(hpp({
//     whitelist: ['events']
// }));


// body parser
app.use(bodyParser.json());

// Serving static files
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(productRouter);
app.use(serviceRouter);

// error handling middleware
app.use((err, req, res, next) => {
    //console.log(err);
    res.status(422).send({ error: err.message });
});


// Customer views
const navbar = fs.readFileSync(__dirname + "/public/navbar/navbar.html", "utf-8");
const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const about = fs.readFileSync(__dirname + "/public/about/about.html", "utf-8");
const services = fs.readFileSync(__dirname + "/public/services/services.html", "utf-8");
const products = fs.readFileSync(__dirname + "/public/products/productPage.html", "utf-8");
const infopage = fs.readFileSync(__dirname + "/public/infopage/infopage.html", "utf-8");
const userloginpage = fs.readFileSync(__dirname + "/public/userLogin/userLogin.html", "utf-8");
const userSignuppage = fs.readFileSync(__dirname + "/public/userSignUp/userSignup.html", "utf-8");
const bookingpage = fs.readFileSync(__dirname + "/public/bookingspage/bookingspage.html", "utf-8");

// Admin views
const adminLogin = fs.readFileSync(__dirname + "/public/adminLogin/adminLogin.html", "utf-8");
const adminNavbar = fs.readFileSync(__dirname + "/public/navbar/adminNavbar.html", "utf-8");
const adminFrontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const adminAbout = fs.readFileSync(__dirname + "/public/about/adminAbout.html", "utf-8");
const adminServices = fs.readFileSync(__dirname + "/public/services/adminServices.html", "utf-8");
const adminProducts = fs.readFileSync(__dirname + "/public/products/adminProductPage.html", "utf-8");
const adminInfopage = fs.readFileSync(__dirname + "/public/infopage/adminInfopage.html", "utf-8");
const adminBookingpage = fs.readFileSync(__dirname + "/public/bookingspage/adminBookingspage.html", "utf-8");

// Customer routes
app.get("/", (req, res) => {
    res.send(navbar + frontpage);
});

app.get("/about", (req, res) => {
    res.send(navbar + about);
})

app.get("/services", (req, res) => {
    res.send(navbar + services);
})

app.get("/productPage", (req, res) => {
    res.send(navbar + products);
})

app.get("/info", (req, res) => {
    res.send(navbar + infopage);
});

app.get('/userLogin', (req, res) => {
    res.send(userloginpage);
})

app.get('/userSignup', (req, res) => {
    res.send(userSignuppage);
});

app.get("/booking", authController.protect, authController.restrictTo('admin', 'user'), (req, res) => {
    res.send(bookingpage);
});



// Admin routes
app.get("/adminLogin", (req, res) => {
    res.status(200).send(adminLogin);
});


app.get("/admin", authController.protect, authController.restrictTo('admin'), (req, res) => {
    res.send(adminNavbar + adminFrontpage);
});

app.get("/adminAbout", authController.protect, authController.restrictTo('admin'), (req, res) => {
    res.send(adminNavbar + adminAbout);
});

app.get("/adminServices", authController.protect, authController.restrictTo('admin'), (req, res) => {
    res.send(adminNavbar + adminServices);
});

app.get("/adminProductPage", authController.protect, authController.restrictTo('admin'), (req, res) => {
    res.send(adminNavbar + adminProducts);
})

app.get("/adminInfo", authController.protect, authController.restrictTo('admin'), (req, res) => {
    res.send(adminNavbar + adminInfopage);
});

app.get("/adminBooking", (req, res) => {
    res.send(adminNavbar + adminBookingpage);
});


// ROUTES
app.use('/api/users', userRouter);


app.all('*', (req, res, next) => {

    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail!';
    // err.statusCode = 404;
  
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404) );
  });

app.use(globalErrorHandler);

app.listen(port, (error) => {
    if (error) {
        console.log("Could not connect to server" + error);
    };
    console.log(`Connected to server on port ${port}`);
});