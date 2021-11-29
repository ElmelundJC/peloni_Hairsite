const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name field is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    }, 
    password: {
        type: String,
        required: [true, "Provide password"],
        trim: true,
        minlength: 8,
    },
    age: {
        type: Number,
        default: 1,
        validate(value) {
            if(value < 0){
                throw new Error("Age must be above 0");
            }
        }
    },
}, { 
    timestamps: true  
});

const User = mongoose.model('User', userSchema);

module.exports = User;