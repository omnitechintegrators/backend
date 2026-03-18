import Blog from "../models/Blog.js";
import fs from "fs";



export const createBlog = async (req, res) => {

try {

const blog = new Blog({

title: req.body.title,

slug: req.body.slug,

excerpt: req.body.excerpt,

content: JSON.parse(req.body.content),

category: req.body.category,

keywords: req.body.keywords.split(","),

image: req.file.filename

});

await blog.save();

res.json({ success: true });

}

catch (err) {

res.status(500).json({ message: err.message });

}

};



export const getBlogs = async (req, res) => {

const blogs = await Blog.find()
.sort({ createdAt: -1 });

res.json(blogs);

};



export const getBlog = async (req, res) => {

const blog = await Blog.findOne({

slug: req.params.slug

});

res.json(blog);

};



export const getLatestBlogs = async (req, res) => {

const blogs = await Blog.find()
.sort({ createdAt: -1 })
.limit(5);

res.json(blogs);

};



export const deleteBlog = async (req, res) => {

const blog = await Blog.findById(req.params.id);

fs.unlinkSync(`uploads/blog/${blog.image}`);

await Blog.findByIdAndDelete(req.params.id);

res.json({ success: true });

};