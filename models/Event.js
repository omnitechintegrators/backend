import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

title:String,

date:String,

time:String,

locationName:String,

locationLink:String,

host:String,

volunteers:String,

description:String,

aim:String,

image:String

},{timestamps:true});

export default mongoose.model("Event",eventSchema);