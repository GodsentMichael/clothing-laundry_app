const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const crypto = require("crypto");

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        
    },
    lastname:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
   role:{
        type:String,
        default:"user",
},
isBlocked: {
    type:Boolean,
    default:false,
},

cart:{
    type:Array,
    default:[]
},
address:[{type:ObjectId, ref: "Address"}],

wishlist:[{type:ObjectId, ref: "Clothing"}],

refreshToken: {
    type: String
},
passwordChangedAt: Date,
passwordResetToken: String,
passwordResetExpires: Date,
},

{timestamps: true}

);


//Hash the password.
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    const user = this;
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//To compare the password a prev user entered and the one hashed.
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
// To generate a password reset token
userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //i.e 10mins
    return resetToken;
}

//Export the user model
module.exports = mongoose.model('User', userSchema);