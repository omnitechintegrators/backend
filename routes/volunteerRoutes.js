import express from "express";

import {

createVolunteer,
getVolunteers,
approveVolunteer,
rejectVolunteer

} from "../controllers/volunteerController.js";
import { deleteVolunteer } from "../controllers/volunteerController.js";

const router = express.Router();


// Volunteer submits form

router.post("/", createVolunteer);


// Admin gets list

router.get("/", getVolunteers);


// Admin approve

router.put("/approve/:id", approveVolunteer);


// Admin reject

router.put("/reject/:id", rejectVolunteer);

router.delete("/:id", deleteVolunteer);


export default router;
