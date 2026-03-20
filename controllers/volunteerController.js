import Volunteer from "../models/Volunteer.js";
import sendEmail from "../utils/sendEmail.js";


// CREATE VOLUNTEER

export const createVolunteer = async (req, res) => {

try {

const volunteer = await Volunteer.create(req.body);

res.status(201).json({
success: true,
message: "Volunteer application submitted",
volunteer
});

} catch (error) {

res.status(500).json({ message: error.message });

}

};



// GET ALL VOLUNTEERS (Admin)

export const getVolunteers = async (req, res) => {

try {

const volunteers = await Volunteer.find().sort({ createdAt: -1 });

res.json(volunteers);

} catch (error) {

res.status(500).json({ message: error.message });

}

};




// APPROVE VOLUNTEER

export const approveVolunteer = async (req, res) => {

try {

const volunteer = await Volunteer.findById(req.params.id);

volunteer.status = "approved";

await volunteer.save();


// SEND EMAIL

// SEND EMAIL (NON-BLOCKING)
const emailResult = await sendEmail(
  volunteer.email,
  "Volunteer Application Approved",
  `Dear ${volunteer.name},<br><br>
  Congratulations! Your volunteer application has been approved.<br><br>
  Humrahi Foundation`
);

if (!emailResult.success) {
  console.error("❌ Approval email failed:", emailResult.error);
}

res.json({ message: "Volunteer approved" });

} catch (error) {

res.status(500).json({ message: error.message });

}

};




// REJECT VOLUNTEER

export const rejectVolunteer = async (req, res) => {

try {

const volunteer = await Volunteer.findById(req.params.id);

volunteer.status = "rejected";

await volunteer.save();


// SEND EMAIL

// SEND EMAIL (NON-BLOCKING)
const emailResult = await sendEmail(
  volunteer.email,
  "Volunteer Application Rejected",
  `Dear ${volunteer.name},<br><br>
  We appreciate your interest, but your volunteer application was not selected.<br><br>
  Humrahi Foundation`
);

if (!emailResult.success) {
  console.error("❌ Rejection email failed:", emailResult.error);
}

res.json({ message: "Volunteer rejected" });

} catch (error) {

res.status(500).json({ message: error.message });

}

};


export const deleteVolunteer = async (req, res) => {

try {

await Volunteer.findByIdAndDelete(req.params.id);

res.json({ message: "Volunteer deleted" });

} catch (error) {

res.status(500).json({ message: error.message });

}

};
