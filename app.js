require('dotenv').config();
require('./database/db');
const fs = require("fs");

const express = require("express");
const User = require('./models/userModel');
const userRouter = require('./routes2/userRoutes'); // Muligvis ligegyldig i app.js

7
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

// body parser
app.use(bodyParser.json());



// error handling middleware
app.use((err, req, res, next) => {
    //console.log(err);
    res.status(422).send({ error: err.message });
});


// Pages
const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const about = fs.readFileSync(__dirname + "/public/about/about.html", "utf-8");
const services = fs.readFileSync(__dirname + "/public/services/services.html", "utf-8");
const products = fs.readFileSync(__dirname + "/public/products/products2.html", "utf-8");

const infopage = fs.readFileSync(__dirname + "/public/infopage/infopage.html", "utf-8");
const bookingpage = fs.readFileSync(__dirname + "/public/bookingspage/bookingspage.html", "utf-8");



app.get("/", (req, res) => {
    res.send(frontpage);
});

app.get("/about", (req, res) => {
    res.send(about);
})

app.get("/services", (req, res) => {
    res.send(services);
})

app.get("/products", (req, res) => {
    res.send(products);
})

app.get("/info", (req, res) => {
    res.send(infopage);
});

app.get("/booking", (req, res) => {
    res.send(bookingpage);
});

// app.get("/admingBooking", protected, (req, res) => {
//     res.status(500).send(bookingpage);
// });


// ROUTES
app.use('/api/users', userRouter);


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
