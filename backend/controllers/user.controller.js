import { User } from "../models/user.model";
import bcrypt from "bcrypt.js";
import jwt from "jsonwebtoken";
// register endpoint

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
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
      phoneNumber,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
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
    let user = await User.findOne({ email });
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
        message: "user doesnt exist with current role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// logout endpoint

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "logged out succesfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

//update profile endpoint

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file= req.file;
    if (!fullname || !email || !phonenumber || !bio || !skills) {
      return res.status(400).json({
        message: "every field is required",
        success: false,
      });
    };

    // cloudinary  


    const skillsArray = skills.split(',')
    const userId =req.id;
    const user = await User.findById(userId);

    //updating data 
    user.fullname=fullname;
    user.email=email;
    user.phoneNumber=phoneNumber;
    user.profile.bio=bio;
    user.profile.skills=skills;
    // resume comes here later

    await user.save();

    user = {
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message:"profile updated succesfully",
      user,
      success:true
    })

  } catch (error) {
    console.log(error);
  }
};
