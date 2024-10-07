import { User } from "../models/user.model";
import bcrypt from "bcrypt.js";

// register endpoint

export const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, role } = req.body;
    if (!fullname || !email || !phonenumber || !password || !role) {
      return res.status(400).json({
        message: "every field is required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already exist with this email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phonenumber,
      password: hashedPassword,
      role,
    });
  } catch (error) {}
};

// login end point

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "every field is required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message:"user doesnt exist with current role",
        success:false 
      })
    }
  } catch (error) {}
};
