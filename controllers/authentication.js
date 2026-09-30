const bcrypt=require("bcryptjs"),jwt=require("jsonwebtoken"),User=require("../models/User");
const tokenFor=u=>jwt.sign({id:u._id.toString(),role:u.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||"1d"});
exports.register=async(req,res,next)=>{try{
 const {name,email,password}=req.body;
 if(!name||!email||!password)return res.status(400).json({message:"name, email and password required"});
 if(String(password).length<8)return res.status(400).json({message:"Password must be at least 8 characters"});
 const normalized=String(email).trim().toLowerCase();
 if(await User.findOne({email:normalized}))return res.status(409).json({message:"Email already registered"});
 const user=await User.create({name,email:normalized,password:await bcrypt.hash(password,12),role:"user"});
 res.status(201).json({message:"Registered",token:tokenFor(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}});
}catch(e){next(e);}};
exports.login=async(req,res,next)=>{try{
 const {email,password}=req.body;if(!email||!password)return res.status(400).json({message:"Email and password required"});
 const user=await User.findOne({email:String(email).trim().toLowerCase()}).select("+password");
 if(!user||!await bcrypt.compare(password,user.password))return res.status(401).json({message:"Invalid email or password"});
 res.json({message:"Login successful",token:tokenFor(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}});
}catch(e){next(e);}};
exports.me=(req,res)=>res.json({user:{id:req.user._id,name:req.user.name,email:req.user.email,role:req.user.role}});