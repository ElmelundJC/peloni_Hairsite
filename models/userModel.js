const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const validator = require('validator');


const EventSchema = new Schema({
    title: {
        type: String,
        default: "Tid taget",
    },
    timeSlot: {
        type: String,
        default: "08:00",
    },
    hairCut: {
        type: Boolean,
        default: false,
    },
    color: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
    },
});

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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, "Provide password"],
        trim: true,
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // Virker kun på CREATE & SAVE!!! (MongoDB)
            validator: function (el) {
                return el === this.password; 
            },
            message: 'Password are not the same!',
        },
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
    message: {
        type: String,
    },
    passwordChangedAt: Date,
    events: [ EventSchema ],
}, { 
    timestamps: true  
});

// ************** Document middleware/PRE MIDDLEWARE **************

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified

    // If the password has not been modified then just exit this function and call the next middleware
    if(!this.isModified('password')) return next();


    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    
    next();
});

// Instance Method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
       return JWTTimestamp < changedTimestamp;
    }
    
    return false;
}


const User = mongoose.model('User', userSchema);

module.exports = User;