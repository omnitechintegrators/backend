import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// temporary storage (no local saving)
const upload = multer({ dest: "temp/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "humrahi/editor"
    });

    // EditorJS required response format
    res.json({
      success: 1,
      file: {
        url: result.secure_url
      }
    });

  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: 0
    });
  }
});

export default router;