const Product=require("../models/Product");
exports.recommendations=async(req,res,next)=>{try{
 const limit=Math.min(20,Math.max(1,Number(req.query.limit)||5)),endpoint=process.env.RAPIDMINER_ENDPOINT;
 if(endpoint){try{
  const headers={"Content-Type":"application/json"};if(process.env.RAPIDMINER_API_KEY)headers.Authorization=`Bearer ${process.env.RAPIDMINER_API_KEY}`;
  const r=await fetch(endpoint,{method:"POST",headers,body:JSON.stringify({userId:req.user._id.toString(),limit})});
  if(!r.ok)throw new Error(`RapidMiner HTTP ${r.status}`);
  const data=await r.json();return res.json({source:"rapidminer",recommendations:data.recommendations||data});
 }catch(e){console.error("RapidMiner failed:",e.message);}}
 const recommendations=await Product.find({active:true}).sort({createdAt:-1}).limit(limit);
 res.json({source:"fallback",note:"Set RAPIDMINER_ENDPOINT to use a deployed RapidMiner process; this fallback is not predictive.",recommendations});
}catch(e){next(e);}};