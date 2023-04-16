const mongoose = require('mongoose'); // Erase if already required
const ObjectId = require('mongoose').Types.ObjectId;

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
   products: [
         {
            product: { type: mongoose.Schema.Types.ObjectId,
            ref: "Clothing",//"LaundryOrder"
         },
         count: Number,
         color: String,
        },
   ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed","Cash On Delivery","Processing","Dispatched","Cancelled","Completed",
        ],
    },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},
{timestamps: true});

//Export the model
module.exports = mongoose.model('Order', orderSchema);