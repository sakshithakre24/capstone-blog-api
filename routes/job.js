const express = require('express');
const router = express.Router();
const Job = require("../schema/job.schema");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth")
dotenv.config();

//read
router.get("/",async (req,res)=>{
    const jobs = await Job.find();
    res.status(200).json(jobs)
})
//read by id
router.get("/:id",async (req,res)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return res.status(404).json({message:"job not found"});
    }
    res.status(200).json(job);
})
//delete
router.delete("/:id",authMiddleware,async (req,res)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    const userid = req.user.id;
    if(!job){
        return res.status(404).json({message:"job not found"});
    }
    if (userid !==job.user.toString()){ // check if the user is owner of the job
        return res.status(401).json({message:"you are not authorized to delete this job"})
    }
    await Job.deleteOne({_id:id});
    res.status(200).json({message:"job deleted"});
})
// create
router.post("/", authMiddleware, async (req,res)=>{
    const {companyName, jobPosition, salary,jobType}=req.body;

    if(!companyName ||!jobPosition ||  !salary || !jobType){
        return res.status(400).json({message:"missing required fields"});
    }
    try{
     const user = req.user;//middleware
     const job = await Job.create({
        companyName,
        jobPosition,
        salary,
        jobType,
        user: user.id, //middleware

    });
    res.status(200).json(job);
  }catch(err){
    console.log(err);
    res.status(500).json({message:"error in creating job"})
  }
})
//update
router.put("/id", authMiddleware, async (req,res)=>{
    const {id} = req.params;
    const {companyName, jobPosition, salary,jobType}=req.body;
    const job = await Job.findById(id);

    if(!job){
        return res.status(400).json({message:"job not found"});
    }
    if(job.user.toString() !== req.user.id){
        return res.status(401).json({message:"you are not authorized to update this job"});
    }
    try{
      await Job.findByIdAndUpdate(id,{
        companyName,
        jobPosition,
        salary,
        jobType,
        
    });
    res.status(200).json({message:"job updated"});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"error in updating job"});
  }
})
module.exports = router;

