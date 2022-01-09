const mongoose = require("mongoose");


const messageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: String,
        default: false
    }
}, {
    timestamp: true
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;