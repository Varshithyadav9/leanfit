import jwt from "jsonwebtoken";
export default function authMiddleware(req,res,next){
 const header=req.headers.authorization||""; const token=header.startsWith("Bearer ")?header.slice(7):"";
 if(!token)return res.status(401).json({success:false,message:"Login required"});
 try{req.customerAuth=jwt.verify(token,process.env.JWT_SECRET);next();}catch{return res.status(401).json({success:false,message:"Session expired. Please login again."});}
}
