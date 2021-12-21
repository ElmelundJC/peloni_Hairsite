const mongoose = require("mongoose");


const serviceSchema = mongoose.Schema({
    service: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamp: true
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;