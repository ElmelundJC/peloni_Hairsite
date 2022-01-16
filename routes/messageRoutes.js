const express = require("express");
const router = new express.Router();
const Message = require("../models/messageModel");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Create message
router.post("/admin/infoPage", async (req, res) => {
    const message = new Message(req.body)

    try {
        await message.save()
        console.log(req.body)
        res.status(201).redirect("/adminInfo")
    } catch (e) {
        res.status(400).send(e)
    }
});

// Get all messages
router.get("/admin/infoPage", async (req, res) => {
    try {
        const message = await Message.find();
        //console.log(product);
        if (!message) {
            return res.status(404).send();
        };

        res.send(message);
    } catch (e) {
        console.log("Error" + e);
    }
});

// Get message
router.get("/messages/:id", async (req, res) => {

    try {
        const message = await Message.findOne({ _id: req.params.id });

        console.log(message);


        if (!message) {
            return res.status(404).send();
        }
        res.send(message);
    } catch (e) {
        console.log("Error" + e);
    }
});

// Update message
router.post("/messages/:id", async (req, res) => {

    const updates = Object.keys(req.body);
    try {
        const message = await Message.findOne({ _id: req.params.id });
        console.log(message);

        if (!message) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            message[update] = req.body[update];
        });

        await message.save();
        res.redirect("/adminInfo");

    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete message
router.delete("/admin/message/:id", async (req, res) => {

    try {
        const message = await Message.findOneAndDelete({ _id: req.params.id });
        console.log(message);

        if (!message) {
            res.status(404).send();
        }
        res.send(message);

    } catch (e) {
        console.log("Error" + e);
    }
});

module.exports = router;