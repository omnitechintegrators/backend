import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ["image", "video"],
    required: true
  },

  image: String,

  video: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Gallery", gallerySchema);