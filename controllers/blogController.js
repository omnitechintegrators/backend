import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {

try {

console.log("BODY:", req.body);

console.log("FILE:", req.file);


if (!req.file) {

return res.status(400).json({

message: "No image uploaded"

});

}


const blog = new Blog({

title: req.body.title,

slug: req.body.slug,

excerpt: req.body.excerpt || "",

content: JSON.parse(req.body.content),

category: req.body.category,

keywords: req.body.keywords
? req.body.keywords.split(",")
: [],

image: req.file.filename

});


await blog.save();


res.json({

success: true

});

}
catch (err) {

console.error(err);

res.status(500).json({

message: err.message

});

}

};


export const getBlogs = async (req, res) => {

const blogs = await Blog.find().sort({ createdAt: -1 });

res.json(blogs);

};



export const getBlog = async (req,res)=>{

const blog = await Blog.findOne({

slug:req.params.slug

});

blog.views += 1;

await blog.save();

res.json(blog);

};


export const deleteBlog = async (req, res) => {

await Blog.findByIdAndDelete(req.params.id);

res.json({ success: true });

};