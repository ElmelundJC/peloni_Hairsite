const express = require("express");
const router = new express.Router()
const Product = require("../models/productModel");

// create product
router.post("/product", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).send(newProduct);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get all products
router.get("/products", async (req, res) => {
    try {
        const product = await Product.find();
        console.log(product);
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
        // try this above: const product = await Product.findById(req.params.id);
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
router.patch("/products/:id", async (req, res) => {
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
        res.redirect("/");

    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete product
router.delete("/products/:id", async (req, res) => {
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