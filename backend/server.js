require("dotenv").config();
const express=require("express");
const morgan=require("morgan");
const connectDB=require("./database/db");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const path = require('path');
connectDB();
const app=express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(cookieParser());
const authRouter=require("./routes/authRoutes");
app.use("/app/auth",authRouter);
const bountiesRouter=require("./routes/bountiesRoutes");
app.use("/app/bounties",bountiesRouter);
app.listen(3000);