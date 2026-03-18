import express from "express";

import multer from "multer";

import fs from "fs";

import {

createBlog,
getBlogs,
getBlog,
deleteBlog

} from "../controllers/blogController.js";

import Blog from "../models/Blog.js";
const router = express.Router();



/* STORAGE */

const storage = multer.diskStorage({

destination: (req, file, cb) => {

const dir = "uploads/blog";

fs.mkdirSync(dir, { recursive: true });

cb(null, dir);

},

filename: (req, file, cb) => {

cb(null, Date.now() + "-" + file.originalname);

}

});

const upload = multer({ storage });

router.post(
"/create",
upload.single("image"),
createBlog
);



router.get("/all", getBlogs);

router.get("/:slug", getBlog);

router.delete("/:id", deleteBlog);

router.get("/related/:category", async (req,res)=>{

const blogs = await Blog.find({

category:req.params.category

}).limit(3);

res.json(blogs);

});

/* ================= UPDATE BLOG ================= */

router.put(

"/update/:id",

upload.single("image"),

async (req, res) => {

try {

/* FIND BLOG */

const blog = await Blog.findById(

req.params.id

);


/* UPDATE DATA */

blog.title = req.body.title;

blog.excerpt = req.body.excerpt;

blog.category = req.body.category;

blog.keywords = req.body.keywords?.split(",") || [];

blog.content = JSON.parse(req.body.content);


/* IF NEW IMAGE */

if (req.file)

blog.image = req.file.filename;


/* SAVE */

await blog.save();


res.json({

success: true

});

}

catch (error) {

console.error(error);

res.status(500).json({

message: "Update failed"

});

}

}

);
export default router;