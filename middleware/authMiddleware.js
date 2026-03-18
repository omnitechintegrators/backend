import jwt from "jsonwebtoken";



export const verifyToken=(req,res,next)=>{

try{

const token=req.headers.authorization?.split(" ")[1];

if(!token){

return res.status(401).json({
message:"Unauthorized"
});

}


const decoded=jwt.verify(token,process.env.JWT_SECRET);

req.admin=decoded;

next();

}catch{

res.status(401).json({
message:"Invalid Token"
});

}

};



/* ================= ROLE CHECK ================= */

export const allowRoles=(...roles)=>{

return(req,res,next)=>{

if(!roles.includes(req.admin.role)){

return res.status(403).json({
message:"Access Denied"
});

}

next();

};

};