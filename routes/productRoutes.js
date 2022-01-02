// Skrevet af Jakob
const express = require("express");
const router = new express.Router()
const Product = require("../models/productModel");
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());


// create product
router.post("/admin/productPage", async (req, res) => {

    const product = new Product(req.body)

    try {
        await product.save()
        console.log(req.body)
        res.status(201).redirect("/adminProductPage")
    } catch (e) {
        res.status(400).send(e)
    }
});

// Get all products
router.get("/admin/productPage", async (req, res) => {
    try {
        const product = await Product.find();
        if (!product) {
            return res.status(404).send();
        };

        res.send(product);
    } catch (e) {
        console.log("Error" + e);
    }
});

// Get product
router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        console.log(product);

        if (!product) {
            return res.status(404).send();
        }
        res.send(product);
    } catch (e) {
        console.log("Error" + e);
    }
});

// Update product
router.post("/products/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        const product = await Product.findOne({ _id: req.params.id });
        console.log(product);

        if (!product) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            product[update] = req.body[update];
        });

        await product.save();
        res.redirect("/adminProductPage");

    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete product
router.delete("/admin/products/:id", async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id });
        console.log(product);

        if (!product) {
            res.status(404).send();
        }
        res.send(product);

    } catch (e) {
        console.log("Error" + e);
    }
});


module.exports = router;