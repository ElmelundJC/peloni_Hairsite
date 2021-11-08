const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

const frontpage = fs.readFileSync(__dirname + "/public/frontpage.html", "utf-8");

app.get("/", (req, res) => {
    res.send(frontpage);
});

app.listen(port, (error) => {
    if (error) {
        console.log("Could not connect to server" + error);
    };
    console.log(`Connected to server on port ${port}`);
});