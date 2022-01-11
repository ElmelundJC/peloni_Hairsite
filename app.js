const express = require("express");
require('dotenv').config();
require('./database/db');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const User = require('./models/userModel');
const userRouter = require('./routes2/userRoutes'); // Muligvis ligegyldig i app.js

const productRouter = require("./routes/productRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const messageRouter = require("./routes/messageRoutes");



const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const fs = require("fs");


// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

// File upload example
const multer = require("multer");
const upload = multer({
    dest: "images2",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error("Please upload a Word document"))
        }

        cb(undefined, true)

    }
});

app.post("/upload", upload.single("upload"), (req, res) => {
    res.send()
});


// Middleware
app.use(express.urlencoded({ extended: false }));

// body parser
app.use(bodyParser.json());

// Serving static files
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(productRouter);
app.use(serviceRouter);
app.use(messageRouter);

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
const bookingpage = fs.readFileSync(__dirname + "/public/bookingspage/bookingspage.html", "utf-8");
const footer = fs.readFileSync(__dirname + "/public/footer/footer.html", "utf-8");

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
    res.send(navbar + frontpage + footer);
});

app.get("/about", (req, res) => {
    res.send(navbar + about + footer);
})

app.get("/services", (req, res) => {
    res.send(navbar + services + footer);
})

app.get("/productPage", (req, res) => {
    res.send(navbar + products + footer);
})

app.get("/info", (req, res) => {
    res.send(navbar + infopage + footer);
});

app.get("/booking", (req, res) => {
    res.send(navbar + bookingpage + footer);
});

// app.get("/admingBooking", protected, (req, res) => {
//     res.status(500).send(bookingpage);
// });




// Admin routes
app.get("/adminLogin", (req, res) => {
    res.send(adminLogin)
});


app.get("/admin", (req, res) => {
    res.send(adminNavbar + adminFrontpage + footer);
});

app.get("/adminAbout", (req, res) => {
    res.send(adminNavbar + adminAbout + footer);
});

app.get("/adminServices", (req, res) => {
    res.send(adminNavbar + adminServices + footer);
});

app.get("/adminProductPage", (req, res) => {
    res.send(adminNavbar + adminProducts + footer);
})

app.get("/adminInfo", (req, res) => {
    res.send(adminNavbar + adminInfopage + footer);
});

app.get("/adminBooking", (req, res) => {
    res.send(adminNavbar + adminBookingpage + footer);
});



app.post("/signup", async (req, res) => {
    try {
        const newUser = await User.create(req.body)

        console.log(newUser);
        res.status(201).send(newUser);
    } catch (e) {
        res.status(400).send(e)
    }
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

// run()
// async function run() {
//     try {
//         const user = await User.findByIdAndUpdate("61bc9d14e825f45c00cd4939");
//         console.log(user);
        
//         const newEvent = {
//             title: "Tid taget",
//             timeSlot: "09:00",
//             hairCut: true,
//             color: false,
//             message: "Det er min 3 årige der skal klippes for første gang."
//         }
//         user.events.push(newEvent);
//         await user.save();
//     } catch(e) {
//         console.log(e.message);
//     }
// }

// UPDATE FUNCTION FOR A USER..
// var objFriends = { fname:"fname",lname:"lname",surname:"surname" };
// Friend.findOneAndUpdate(
//     { _id: req.body.id }, 
//     { $push: { friends: objFriends  } },
//    function (error, success) {
//          if (error) {
//              console.log(error);
//          } else {
//              console.log(success);
//          }
//      });
//  )
