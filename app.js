require('dotenv').config();
const express = require("express");
const fs = require("fs");
require('./database/db');
const User = require('./models/userModel');
const productRouter = require("./routes/productRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;



// Middleware

app.use(express.static(__dirname + "/public"));

// body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(productRouter);
app.use(serviceRouter)


// // error handling middleware
// app.use((err, req, res, next) => {
//     //console.log(err);
//     res.status(422).send({ error: err.message });
// });


// Customer views
const navbar = fs.readFileSync(__dirname + "/public/navbar/navbar.html", "utf-8");
const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const about = fs.readFileSync(__dirname + "/public/about/about.html", "utf-8");
const services = fs.readFileSync(__dirname + "/public/services/services.html", "utf-8");
const products = fs.readFileSync(__dirname + "/public/products/productPage.html", "utf-8");
const infopage = fs.readFileSync(__dirname + "/public/infopage/infopage.html", "utf-8");
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

app.get("/booking", (req, res) => {
    res.send(navbar + bookingpage);
});

// Admin routes
app.get("/adminLogin", (req, res) => {
    res.send(adminLogin)
});


app.get("/admin", (req, res) => {
    res.send(adminNavbar + adminFrontpage);
});

app.get("/adminAbout", (req, res) => {
    res.send(adminNavbar + adminAbout);
});

app.get("/adminServices", (req, res) => {
    res.send(adminNavbar + adminServices);
});

app.get("/adminProductPage", (req, res) => {
    res.send(adminNavbar + adminProducts);
})

app.get("/adminInfo", (req, res) => {
    res.send(adminNavbar + adminInfopage);
});

app.get("/adminBooking", (req, res) => {
    res.send(adminNavbar + adminBookingpage);
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

app.listen(port, (error) => {
    if (error) {
        console.log("Could not connect to server" + error);
    };
    console.log(`Connected to server on port ${port}`);
});