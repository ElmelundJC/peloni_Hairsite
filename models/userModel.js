const crypto = require('crypto');
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
        default: "00:00",
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
    phone: {
        type: Number,
        required: [true, "Please provide your phonenumber"],
        minlength: 7,
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
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    events: [ EventSchema ],
}, { 
    timestamps: true  
});

// ************** Document middleware/PRE MIDDLEWARE **************

userSchema.pre('save', async function(next) {
    // Kører kun funktionen hvis password er blevet modificeret

    // Hvis password ikke er modificeret return next.
    if(!this.isModified('password')) return next();


    // Hash password med 12 værdier
    this.password = await bcrypt.hash(this.password, 12);
    // sætter værdi til undefined således værdien ikke fortsat gemmes på passwordConfirm
    this.passwordConfirm = undefined;
    
    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();
    // ved at sætte vores passwordChangeAt lig - 1 sekund sikrer os at koden når at gemme i databasen, så der ikke opstår fejl i koden i forhold til mulige delay.
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// query middleware
userSchema.pre(/^find/, function(next) {
    // 'this' peger på nuværende query
    // find users that is $ne (Not equal) to false )
    this.find({ active: { $ne: false }});
    next();
});

// ************** Instance Methods ************
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

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutter

    console.log({ resetToken }, this.passwordResetToken);

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;