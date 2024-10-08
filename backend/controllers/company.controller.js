import { Company } from "../models/company.model.js";


//registering Company 
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "company name is required",
        success: false,
      });
    }
    let company = await Company.findOne({ companyName });
    if (company) {
      return res.status(400).json({
        message: "company already registered",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return(
      res.status(201).json({
        message:"Company registered Succesfully",
        company,
        success:true
      })
    )
  } catch (error) {
    console.log(error);
  }
};
 