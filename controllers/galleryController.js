import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

export const addGallery = async (req, res) => {
  try {
    const file = req.file;

    let gallery;

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "humrahi/gallery"
    });

    if (file.mimetype.startsWith("video")) {

      gallery = new Gallery({
        type: "video",
        video: result.secure_url
      });

    } else {

      gallery = new Gallery({
        type: "image",
        image: result.secure_url
      });

    }

    await gallery.save();

    res.json({
      success: true,
      message: "Uploaded"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getGallery = async (req, res) => {
  const data = await Gallery.find().sort({ createdAt: -1 });
  res.json(data);
};


export const deleteGallery = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};