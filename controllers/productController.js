const Product=require("../models/Product");
const esc=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
exports.create=async(req,res,next)=>{try{
 const {name,category,price}=req.body;if(!name||!category||price===undefined)return res.status(400).json({message:"name, category and price required"});
 if(!Number.isFinite(Number(price))||Number(price)<0)return res.status(400).json({message:"Invalid price"});
 const product=await Product.create({...req.body,price:Number(price)});res.status(201).json({message:"Product created",product});
}catch(e){next(e);}};
exports.list=async(req,res,next)=>{try{
 const {search,category,minPrice,maxPrice,sort="createdAt",order="desc",page=1,limit=20}=req.query;
 const filter={active:true};
 if(category)filter.category=new RegExp("^"+esc(category)+"$","i");
 if(search){const q=esc(search);filter.$or=[{name:new RegExp(q,"i")},{category:new RegExp(q,"i")},{description:new RegExp(q,"i")}];}
 if(minPrice!==undefined||maxPrice!==undefined){filter.price={};if(minPrice!==undefined)filter.price.$gte=Number(minPrice);if(maxPrice!==undefined)filter.price.$lte=Number(maxPrice);}
 const sortField=["name","price","createdAt","category"].includes(sort)?sort:"createdAt";
 const p=Math.max(1,parseInt(page,10)||1),l=Math.min(100,Math.max(1,parseInt(limit,10)||20));
 const [products,total]=await Promise.all([Product.find(filter).sort({[sortField]:order==="asc"?1:-1}).skip((p-1)*l).limit(l),Product.countDocuments(filter)]);
 res.json({products,pagination:{total,page:p,limit:l,pages:Math.ceil(total/l)}});
}catch(e){next(e);}};
exports.get=async(req,res,next)=>{try{const p=await Product.findOne({_id:req.params.id,active:true});if(!p)return res.status(404).json({message:"Product not found"});res.json({product:p});}catch(e){next(e);}};
exports.update=async(req,res,next)=>{try{
 const allowed=["name","description","category","price","stock","imageUrl","tags","active"],u={};
 for(const k of allowed)if(req.body[k]!==undefined)u[k]=req.body[k];
 if(u.price!==undefined&&(!Number.isFinite(Number(u.price))||Number(u.price)<0))return res.status(400).json({message:"Invalid price"});
 const p=await Product.findByIdAndUpdate(req.params.id,u,{new:true,runValidators:true});if(!p)return res.status(404).json({message:"Product not found"});
 res.json({message:"Product updated",product:p});
}catch(e){next(e);}};
exports.remove=async(req,res,next)=>{try{const p=await Product.findByIdAndDelete(req.params.id);if(!p)return res.status(404).json({message:"Product not found"});res.json({message:"Product deleted"});}catch(e){next(e);}};