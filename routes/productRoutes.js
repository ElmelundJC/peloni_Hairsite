const express = require("express");
const router = new express.Router()
const Product = require("../models/productModel");
const mongoose = require('mongoose');
const multer = require("multer");
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
        //console.log(product);
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
        //console.log(product);

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
        //console.log(product);

        if (!product) {
            res.status(404).send();
        }
        res.send(product);

    } catch (e) {
        console.log("Error" + e);
    }
});

// Image upload

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/products/productImages");
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `produkt-${req.params.id.trim()}-${Date.now()}.${ext}`)
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new Error("Please upload an image!", 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 1000000
    },
})

router.post("/productImage/:id", upload.single("productImage"), async (req, res) => {
    console.log("post image" + 1)
    console.log(req.file)
    console.log(req.params.id.trim())
    try {
        //console.log(req.file.buffer)
        await Product.findByIdAndUpdate(req.params.id.trim(), { productImage: req.file.originalname });
        res.send()
    } catch (e) {
        console.log(e)
    }
});

router.delete("/productImage/:id", async (req, res) => {
    console.log("delete" + 1)
    //console.log(req.body)
    console.log(req.params.id.trim())
    try {
        //console.log(req.file.buffer)
        await Product.findByIdAndUpdate(req.params.id.trim(), { productImage: null });
        res.send()
    } catch (e) {
        console.log(e)
    }
});

router.get("/products/:id/productImage", async (req, res) => {
    console.log("get" + 1)
    //console.log(req.file)
    console.log(req.params.id.trim())

    try {
        const product = await Product.findOne({ _id: req.params.id.trim() });
        //console.log(product)

        if (!product || !product.productImage) {
            throw new Error()
        }

        //res.set("Content-Type", "image/jpg")
        //res.send({ productImage: req.file.originalname })
        //console.log()
        res.send(product.productImage)
    } catch (e) {
        res.status(404).send()
    }
})

router.post("/upload", upload.single("productImage"), (req, res) => {
    console.log(req.file)
    console.log(req.body.id)
    res.send()
});

module.exports = router;