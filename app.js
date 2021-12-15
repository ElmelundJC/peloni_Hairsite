require('dotenv').config();
const express = require("express");
const fs = require("fs");
require('./database/db');
const User = require('./models/userModel');
const productRouter = require("./routes/productRoutes");
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;



// Middleware

app.use(express.static(__dirname + "/public"));

// body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(productRouter);


// // error handling middleware
// app.use((err, req, res, next) => {
//     //console.log(err);
//     res.status(422).send({ error: err.message });
// });


// Pages
const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const about = fs.readFileSync(__dirname + "/public/about/about.html", "utf-8");
const services = fs.readFileSync(__dirname + "/public/services/services.html", "utf-8");
const products = fs.readFileSync(__dirname + "/public/products/productPage.html", "utf-8");
const adminProducts = fs.readFileSync(__dirname + "/public/products/adminProductPage.html", "utf-8");
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

app.get("/productPage", (req, res) => {
    res.send(products);
})

app.get("/adminProductPage", (req, res) => {
    res.send(adminProducts);
})

app.get("/info", (req, res) => {
    res.send(infopage);
});

app.get("/booking", (req, res) => {
    res.send(bookingpage);
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