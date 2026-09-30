const mongoose=require("mongoose");
const item=new mongoose.Schema({product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
 name:{type:String,required:true},quantity:{type:Number,required:true,min:1},
 unitPrice:{type:Number,required:true,min:0}},{_id:false});
const schema=new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 items:{type:[item],required:true,validate:v=>v.length>0},
 totalAmount:{type:Number,required:true,min:0},
 status:{type:String,enum:["pending","paid","shipped","delivered","cancelled"],default:"pending"},
 shippingAddress:{type:String,required:true,trim:true}
},{timestamps:true});
module.exports=mongoose.model("Order",schema);