import express from "express";

import Donation from "../models/Donation.js";

const router = express.Router();



// GET donations

router.get("/donations", async (req, res) => {

const data = await Donation.find().sort({ createdAt: -1 });

res.json(data);

});




// DELETE donation

router.delete("/donations/:id", async (req, res) => {

try {

const deleted = await Donation.findByIdAndDelete(req.params.id);

if (!deleted) {

return res.status(404).json({

success: false,

message: "Donation not found"

});

}


res.json({

success: true

});

}
catch (error) {

console.log(error);

res.status(500).json({

success: false

});

}

});



export default router;
