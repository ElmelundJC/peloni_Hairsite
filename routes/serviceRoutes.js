// Skrevet af Jakob
const express = require("express");
const router = new express.Router();
const Service = require("../models/serviceModel");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Create service
router.post("/admin/servicePage", async (req, res) => {
    const service = new Service(req.body)

    try {
        await service.save()
        console.log(req.body)
        res.status(201).redirect("/adminServices")
    } catch (e) {
        res.status(400).send(e)
    }
});

// Get all services
router.get("/admin/servicePage", async (req, res) => {
    try {
        const service = await Service.find();
        //console.log(product);
        if (!service) {
            return res.status(404).send();
        };

        res.send(service);
    } catch (e) {
        console.log("Error" + e);
    }
});

// Get service
router.get("/services/:id", async (req, res) => {

    try {
        const service = await Service.findOne({ _id: req.params.id });

        console.log(service);


        if (!service) {
            return res.status(404).send();
        }
        res.send(service);
    } catch (e) {
        console.log("Error" + e);
    }
});

// Update service
router.post("/services/:id", async (req, res) => {

    const updates = Object.keys(req.body);
    try {
        const service = await Service.findOne({ _id: req.params.id });
        console.log(service);

        if (!service) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            service[update] = req.body[update];
        });

        await service.save();
        res.redirect("/adminServices");

    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete service
router.delete("/admin/services/:id", async (req, res) => {

    try {
        const service = await Service.findOneAndDelete({ _id: req.params.id });
        console.log(service);

        if (!service) {
            res.status(404).send();
        }
        res.send(service);

    } catch (e) {
        console.log("Error" + e);
    }
});

module.exports = router;
