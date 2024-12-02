const express = require("express");
const app = express();
const path=  require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 3000




app.use(express.static(path.join(__dirname,"public")));
//home route is the root of your project
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","try.html"))
});

app.listen(PORT,()=>{
    console.log("server is running on port 3000");
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{
        console.log("DB is connected");
    }).catch((err)=>{
        console.log(err);
    });
});
