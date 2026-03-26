import { asynchandler } from "../middleware/asyncHandler.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const registerUser = asynchandler(async (req, res) => {
  const { name, password, email, role } = req.body;
  if (!name) {
    return res.status(404).json({
      success: false,
      message: "Name is required",
    });
  }
  if (!password) {
    return res.status(404).json({
      success: false,
      message: "Password is required",
    });
  }
  if (!email) {
    return res.status(404).json({
      success: false,
      message: "email is required",
    });
  }

  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return res.status(400).json({
      success: false,
      message: "User Already exist",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createUser = await User.create({
    email,
    name,
    password: hashedPassword,
    role
  });
  const SECRET_KEY = process.env.SECRET_KEY;
  const token = jwt.sign({ createUser }, SECRET_KEY, { expiresIn: "10m" });
  return res.status(201).json({
    success: true,
    message: "User created successful",
    data: createUser,
    token,
  });
});
export const deleteallUser = asynchandler(async (req, res) => {
  const deleteuer = await User.deleteMany({});
  return res.status(200).json({
    success: true,
    message: "User deleted successfull",
    deleteuer,
  });
});
export const allUser = asynchandler(async (req, res) => {
  const FindAll = await User.find({});
  return res.status(200).json({
    success: true,
    message: "User Fetch successfull",
    FindAll,
  });
});

export const loginUser = asynchandler(async (req,res)=>{
    
})
