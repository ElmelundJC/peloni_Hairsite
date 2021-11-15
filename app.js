const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");

const newspage = fs.readFileSync(__dirname + "/public/newspage/newspage.html", "utf-8");
const bookingpage = fs.readFileSync(__dirname + "/public/bookingspage/bookingspage.html", "utf-8");



app.get("/", (req, res) => {
    res.send(frontpage);
});

app.get("/nyheder", (req, res) => {
    res.send(newspage);
});

app.get("/booking", (req, res) => {
    res.send(bookingpage);
});


app.listen(port, (error) => {
    if (error) {
        console.log("Could not connect to server" + error);
    };
    console.log(`Connected to server on port ${port}`);
});