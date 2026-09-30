const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 name:{type:String,required:true,trim:true,minlength:2,maxlength:80},
 email:{type:String,required:true,unique:true,lowercase:true,trim:true},
 password:{type:String,required:true,select:false},
 role:{type:String,enum:["admin","user","guest"],default:"user"},
 phone:{type:String,trim:true,default:""},address:{type:String,trim:true,default:""}
},{timestamps:true});
module.exports=mongoose.model("User",schema);