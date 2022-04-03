require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors =require("cors");
const cookieParser = require("cookie-parser");
const env = require('dotenv').config();

const authRoutes= require("./routes/auth");
const itemRouter= require("./routes/item");
const notificationRoutes = require("./routes/notification");
const complaintRoutes = require("./routes/complaint");
const certRoutes = require("./routes/certificate");
const foodItemRoutes = require("./routes/fooditem");
const razorpayRoutes = require("./routes/razorpay");
const orderRoutes=require("./routes/order")


// mongoose.connect(process.env.MongoUri,{
// mongoose.connect("mongodb+srv://auth:nK81ceBSXNTi4GW9@cluster0.j5smh.mongodb.net/mySecondDatabase?retryWrites=true&w=majority",{
     mongoose.connect("mongodb://localhost:27017/test",{   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, 
})
.then(()=>{
    console.log("DB connected");
})
.catch((e)=>{
    console.log(e,"Error Occurred While connecting to database");
})


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// app.get("/",(req,res)=>{
//     console.log("hello");
// })

app.use("/api/auth",authRoutes);
app.use("/api/item",itemRouter);
app.use("/api/notification", notificationRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/certificate", certRoutes);
app.use("/api/fooditem", foodItemRoutes);
app.use("/api/rpay", razorpayRoutes);
app.use("/api/order", orderRoutes);



const port = process.env.PORT||8000;
app.listen(port,()=>{
    console.log(`app is running on ${port}`);
});