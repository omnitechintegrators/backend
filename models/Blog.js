import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({

title: String,

slug: {
type: String,
unique: true
},

excerpt: String,

content: Object,

image: String,

category: String,

keywords: [String],

views: {
type: Number,
default: 0
},

status: {
type: String,
default: "published" // draft / published
},

seoTitle: String,

seoDescription: String,

createdAt: {
type: Date,
default: Date.now
}

});

export default mongoose.model("Blog", blogSchema);