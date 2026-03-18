import Event from "../models/Event.js";


// ================= CREATE EVENT =================


export const createEvent = async (req,res) => {

try{


const {

title,
date,
time,
locationName,
locationLink,
host,
volunteers,
description,
aim

} = req.body;



const image = req.file
? `/uploads/events/${req.file.filename}`
: "";



const event = new Event({

title,
date,
time,
locationName,
locationLink,
host,
volunteers,
description,
aim,
image

});


await event.save();



res.json({

success:true,
message:"Event Created",
event

});


}

catch(err){

res.status(500).json({

success:false,
message:"Server Error"

});

}

};



// ================= GET EVENTS =================


export const getEvents = async (req,res)=>{

const events = await Event.find()

.sort({createdAt:-1});

res.json({

success:true,
events

});

};



// ================= UPDATE EVENT =================


export const updateEvent = async (req,res)=>{


try{


const data = req.body;


if(req.file){

data.image =

`/uploads/events/${req.file.filename}`;

}


await Event.findByIdAndUpdate(

req.params.id,
data

);


res.json({

success:true,
message:"Updated"

});


}

catch{

res.status(500).json({

success:false

});

}

};



// ================= DELETE EVENT =================


export const deleteEvent = async (req,res)=>{


await Event.findByIdAndDelete(

req.params.id

);


res.json({

success:true

});


};