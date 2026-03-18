import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



/* ================= LOGIN ================= */

export const loginAdmin=async(req,res)=>{

try{

const {email,password}=req.body;

const admin=await Admin.findOne({email});

if(!admin){

return res.status(400).json({
success:false,
message:"Admin not found"
});

}


const isMatch=await bcrypt.compare(password,admin.password);

if(!isMatch){

return res.status(400).json({
success:false,
message:"Invalid password"
});

}


const token=jwt.sign(

{
id:admin._id,
role:admin.role,
email:admin.email,
name:admin.name
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);


res.json({

success:true,
token,
role:admin.role,
name:admin.name,
email:admin.email

});


}catch{

res.status(500).json({
success:false
});

}

};