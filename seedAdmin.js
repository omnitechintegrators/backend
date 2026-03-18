import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);



const seed=async()=>{

await Admin.deleteMany();



const password=await bcrypt.hash("123456",10);



await Admin.create({

name:"Owner",
email:"owner@humrahi.com",
password,
role:"owner"

});


await Admin.create({

name:"Administrator",
email:"administrator@humrahi.com",
password,
role:"administrator"

});


await Admin.create({

name:"Admin",
email:"admin@humrahi.com",
password,
role:"admin"

});


console.log("Admins Created");

process.exit();

};


seed();