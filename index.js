require("dotenv").config();
const express=require("express"), cors=require("cors"), helmet=require("helmet");
const mongoSanitize=require("express-mongo-sanitize");
const connectDB=require("./config/dbConnection");
const {notFound,errorHandler}=require("./middleware/errorHandler");
const app=express();
app.use(helmet()); app.use(cors({origin:process.env.CLIENT_URL||"*"}));
app.use(express.json({limit:"1mb"})); app.use(mongoSanitize());
app.get("/api/health",(req,res)=>res.json({status:"ok",service:"ecommerce-backend"}));
app.use("/api/auth",require("./routes/authenticationRoutes"));
app.use("/api/users",require("./routes/userProfileRoutes"));
app.use("/api/products",require("./routes/productRoutes"));
app.use("/api/orders",require("./routes/orderRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"));
app.use(notFound); app.use(errorHandler);
const PORT=process.env.PORT||5000;
connectDB().then(()=>app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`)))
.catch(e=>{console.error("Could not start server:",e.message);process.exit(1);});
