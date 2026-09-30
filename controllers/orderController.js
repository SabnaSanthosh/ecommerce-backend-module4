const Order=require("../models/Order"),Product=require("../models/Product");
exports.create=async(req,res,next)=>{try{
 const {items,shippingAddress}=req.body;
 if(!Array.isArray(items)||!items.length||!shippingAddress)return res.status(400).json({message:"items and shippingAddress required"});
 const orderItems=[];let totalAmount=0;
 for(const item of items){
  const quantity=Number(item.quantity);
  if(!item.productId||!Number.isInteger(quantity)||quantity<1)return res.status(400).json({message:"Each item needs productId and positive integer quantity"});
  const p=await Product.findOne({_id:item.productId,active:true});if(!p)return res.status(404).json({message:"Product not found"});
  if(p.stock<quantity)return res.status(400).json({message:`Insufficient stock for ${p.name}`});
  p.stock-=quantity;await p.save();orderItems.push({product:p._id,name:p.name,quantity,unitPrice:p.price});totalAmount+=p.price*quantity;
 }
 const order=await Order.create({user:req.user._id,items:orderItems,totalAmount,shippingAddress});
 res.status(201).json({message:"Order created",order});
}catch(e){next(e);}};
exports.list=async(req,res,next)=>{try{const f=req.user.role==="admin"?{}:{user:req.user._id};const orders=await Order.find(f).populate("user","name email").sort({createdAt:-1});res.json({count:orders.length,orders});}catch(e){next(e);}};
exports.get=async(req,res,next)=>{try{
 const o=await Order.findById(req.params.id).populate("user","name email");if(!o)return res.status(404).json({message:"Order not found"});
 if(req.user.role!=="admin"&&o.user._id.toString()!==req.user._id.toString())return res.status(403).json({message:"Forbidden"});
 res.json({order:o});
}catch(e){next(e);}};
exports.status=async(req,res,next)=>{try{
 if(!["pending","paid","shipped","delivered","cancelled"].includes(req.body.status))return res.status(400).json({message:"Invalid status"});
 const o=await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true});
 if(!o)return res.status(404).json({message:"Order not found"});res.json({message:"Status updated",order:o});
}catch(e){next(e);}};
exports.remove=async(req,res,next)=>{try{
 const o=await Order.findById(req.params.id);if(!o)return res.status(404).json({message:"Order not found"});
 if(req.user.role!=="admin"&&o.user.toString()!==req.user._id.toString())return res.status(403).json({message:"Forbidden"});
 if(o.status!=="pending")return res.status(400).json({message:"Only pending orders can be cancelled"});
 o.status="cancelled";await o.save();res.json({message:"Order cancelled",order:o});
}catch(e){next(e);}};