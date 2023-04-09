const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

// Declaring the Schema of the product model
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        lowercase: true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    category: {
        type:mongoose.Schema.types.ObjectId,
        ref: 'category',
        required:true,
    },

});

//Export the model
module.exports = mongoose.model('User', userSchema);