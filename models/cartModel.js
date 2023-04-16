const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
 clothings: [
        {
           clothing: { type: mongoose.Schema.Types.ObjectId,
           ref: "Clothing",//"LaundryOrder"
        },
        count: Number,
        color: String,
        price: Number,
       },
  ],
   cartTotal: Number,
   totalAfterDiscount: Number,
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
module.exports = mongoose.model('Cart', cartSchema);