import { connections } from "mongoose";
import { Job } from "../models/job.model.js";
// for admin
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      jobType,
      experience,
      location,
      position,
      companyId,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !jobType ||
      !experience ||
      !location ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "every field is required",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      jobType,
      experienceLevel: experience,
      location: location,
      positions: position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: "new job post created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// for student
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//  for student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// for admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = Job.findById({ created_by: adminId });
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: true,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
