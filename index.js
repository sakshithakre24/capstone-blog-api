const express = require("express");
const app = express();
const path=  require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const jobRoute = require("./routes/job");
const cors = require ("cors");
dotenv.config();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,"public")));
//home route is the root of your project
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","try.html"));
});



app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/api/user",userRoute);
app.use("/api/job",jobRoute);
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
