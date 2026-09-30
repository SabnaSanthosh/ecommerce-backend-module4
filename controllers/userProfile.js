const User=require("../models/User");
exports.getMe=async(req,res,next)=>{try{res.json({user:await User.findById(req.user._id).select("name email role phone address createdAt")});}catch(e){next(e);}};
exports.updateMe=async(req,res,next)=>{try{
 const updates={};for(const k of ["name","phone","address"])if(req.body[k]!==undefined)updates[k]=req.body[k];
 const user=await User.findByIdAndUpdate(req.user._id,updates,{new:true,runValidators:true}).select("name email role phone address");
 res.json({message:"Profile updated",user});
}catch(e){next(e);}};
exports.list=async(req,res,next)=>{try{const users=await User.find().select("name email role phone address createdAt");res.json({count:users.length,users});}catch(e){next(e);}};
exports.role=async(req,res,next)=>{try{
 if(!["admin","user","guest"].includes(req.body.role))return res.status(400).json({message:"role must be admin, user, or guest"});
 const user=await User.findByIdAndUpdate(req.params.id,{role:req.body.role},{new:true,runValidators:true}).select("name email role");
 if(!user)return res.status(404).json({message:"User not found"});res.json({message:"Role updated",user});
}catch(e){next(e);}};
exports.remove=async(req,res,next)=>{try{
 if(req.params.id===req.user._id.toString())return res.status(400).json({message:"Cannot delete your own account"});
 const u=await User.findByIdAndDelete(req.params.id);if(!u)return res.status(404).json({message:"User not found"});
 res.json({message:"User deleted"});
}catch(e){next(e);}};