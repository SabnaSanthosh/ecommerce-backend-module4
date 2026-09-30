const jwt=require("jsonwebtoken"),User=require("../models/User");
async function authenticate(req,res,next){
 try{
  const [scheme,token]=(req.headers.authorization||"").split(" ");
  if(scheme!=="Bearer"||!token)return res.status(401).json({message:"Bearer token required"});
  const decoded=jwt.verify(token,process.env.JWT_SECRET);
  const user=await User.findById(decoded.id).select("name email role");
  if(!user)return res.status(401).json({message:"User no longer exists"});
  req.user=user;next();
 }catch(e){return res.status(401).json({message:"Invalid or expired token"});}
}
function authorize(...roles){return(req,res,next)=>{
 if(!req.user)return res.status(401).json({message:"Authentication required"});
 if(!roles.includes(req.user.role))return res.status(403).json({message:"Permission denied"});
 next();
};}
module.exports={authenticate,authorize};