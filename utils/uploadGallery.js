import multer from "multer";



// temporary storage (no local saving)
export const uploadGallery = multer({
  dest: "temp/"
});



