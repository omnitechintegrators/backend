import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

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

router.post("/", upload.single("image"), (req, res) => {

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/blog/${req.file.filename}`;

  res.json({
    success: 1,
    file: {
      url: imageUrl
    }
  });

});

export default router;