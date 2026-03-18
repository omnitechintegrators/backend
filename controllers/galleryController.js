import Gallery from "../models/Gallery.js";

import fs from "fs";



export const addGallery = async (req, res) => {

  try {

    const file = req.file;

    let gallery;


    if (file.mimetype.startsWith("video")) {

      gallery = new Gallery({

        type: "video",

        video: file.filename

      });

    }

    else {

      gallery = new Gallery({

        type: "image",

        image: file.filename

      });

    }


    await gallery.save();


    res.json({

      success: true,

      message: "Uploaded"

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};




export const getGallery = async (req, res) => {

  const data = await Gallery.find()

  .sort({ createdAt: -1 });


  res.json(data);

};




export const deleteGallery = async (req, res) => {

  try {

    const item = await Gallery.findById(req.params.id);


    if (!item)

      return res.status(404).json({ message: "Not found" });



    let path;


    if (item.type === "video")

      path = `uploads/gallery/videos/${item.video}`;

    else

      path = `uploads/gallery/images/${item.image}`;



    if (fs.existsSync(path))

      fs.unlinkSync(path);



    await Gallery.findByIdAndDelete(req.params.id);


    res.json({

      success: true

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};