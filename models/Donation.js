import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({

name:String,

email:String,

phone:String,

address:String,

pan:String,

message:String,

amount:Number,

amountWords:String,

transactionId:String,

paymentMethod:String,

certificateId:String,

certificateUrl:String,

financialYear:String,

status:String

},

{

timestamps:true

});

export default mongoose.model(
"Donation",
donationSchema
);