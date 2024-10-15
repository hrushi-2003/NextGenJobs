import { Application } from "../models/application.model.js";

export const applyJob = async(req,res)=>{
  try {
    const userId=req.id;
    const jobId=req.params.id;
    if(!jobId){
      return res.status(400).json({
        message:"job id is required",
        success:false
      })
    }
    const existingApplication = await Application.findOne(jobId)
  } catch (error) {
    console.log(error);
  }
}