const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 name:{type:String,required:true,trim:true,minlength:2,maxlength:120},
 description:{type:String,default:"",maxlength:2000},category:{type:String,required:true,trim:true},
 price:{type:Number,required:true,min:0},stock:{type:Number,default:0,min:0},
 imageUrl:{type:String,default:""},tags:[{type:String,lowercase:true,trim:true}],
 active:{type:Boolean,default:true}
},{timestamps:true});
schema.index({name:"text",category:"text",description:"text"});
module.exports=mongoose.model("Product",schema);