 const mongoose = require('mongoose');
 const ObjectId = mongoose.Schema.Types.ObjectId;

// Declare the Schema of the Mongo model
const promoCodeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        upper:true
    },
    expiry:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    isUsed:{
        type:Boolean,
        default:false,
    },
    promoCode: {
        type: String
    },
});

//Export the model
module.exports = mongoose.model('PromoCode', promoCodeSchema);