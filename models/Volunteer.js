import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },

  message: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Volunteer", volunteerSchema);
