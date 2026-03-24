import express from "express";

import multer from "multer";

import {

createEvent,
getEvents,
updateEvent,
deleteEvent

}

from "../controllers/eventController.js";



const router = express.Router();



// MULTER


const storage = multer.diskStorage({

destination:"uploads/events",

filename:(req,file,cb)=>{

cb(null,Date.now()+file.originalname);

}

});


const upload = multer({ dest: "temp/" });



// ROUTES


router.post("/",upload.single("image"),createEvent);

router.get("/",getEvents);

router.put("/:id",upload.single("image"),updateEvent);

router.delete("/:id",deleteEvent);



export default router;