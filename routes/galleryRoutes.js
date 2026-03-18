import express from "express";

import {

addGallery,
getGallery,
deleteGallery

} from "../controllers/galleryController.js";

import { uploadGallery }

from "../utils/uploadGallery.js";


const router = express.Router();


router.post(

"/add",

uploadGallery.single("file"),

addGallery

);


router.get(

"/all",

getGallery

);


router.delete(

"/delete/:id",

deleteGallery

);


export default router;