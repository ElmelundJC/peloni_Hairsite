require('dotenv').config();
const express = require("express");
const fs = require("fs");
require('./database/db');
const User = require('./models/userModel');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

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

// app.post("/signup", async (req, res) => {
//     try {
//         const user = await User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//             age: req.body.age
//         });

//         console.log(user);
//     } catch (error) {
//         console.log(error);
//     }

// });

// app.use('/', browsingRoute);

app.listen(port, (error) => {
    if (error) {
        console.log("Could not connect to server" + error);
    };
    console.log(`Connected to server on port ${port}`);
});