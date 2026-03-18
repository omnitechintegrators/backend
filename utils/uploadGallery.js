import multer from "multer";
import fs from "fs";


const storage = multer.diskStorage({

destination: (req, file, cb) => {

let uploadPath =

file.mimetype.startsWith("video")

? "uploads/gallery/videos"

: "uploads/gallery/images";


// create folder if not exists

fs.mkdirSync(uploadPath, { recursive: true });

cb(null, uploadPath);

},

filename: (req, file, cb) => {

cb(null, Date.now() + "-" + file.originalname);

}

});


export const uploadGallery = multer({ storage });