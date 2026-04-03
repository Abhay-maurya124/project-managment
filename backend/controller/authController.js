import { asynchandler } from "../middleware/asyncHandler.js";
import { User } from "../models/user.js";
import { sendemail } from "../serrvices/emailservice.js";
import { GenerateForgetPasswordEmailTemplate } from "../utiles/generateForgetPasswordEmailTemplate.js";
import { generateToken } from "../utiles/genratetoken.js";
import crypto from "crypto";
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
  const createUser = await User.create({
    email,
    name,
    password,
    role,
  });
  // const SECRET_KEY = process.env.SECRET_KEY;
  // const token = jwt.sign({ createUser }, SECRET_KEY, { expiresIn: "10m" });
  // return res.status(201).json({
  //   success: true,
  //   message: "User created successful",
  //   data: createUser,
  //   token,
  // });
  generateToken(createUser, 201, "user is registered successfully", res);
});
export const deleteallUser = asynchandler(async (req, res) => {
  const deleteuer = await User.deleteMany({});
  return res.status(200).json({
    success: true,
    message: "User deleted successfull",
    deleteuer,
  });
});

export const loginUser = asynchandler(async (req, res) => {
  const { email, password, role } = req.body;
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
  if (!role) {
    return res.status(404).json({
      success: false,
      message: "role is required",
    });
  }

  const finduser = await User.findOne({ email, role }).select("+password");
  if (!finduser) {
    return res.status(401).json({
      success: false,
      message: "This creditials not found check the email,role and password",
    });
  }
  const correctpassword = await finduser.comparepassword(password);
  if (!correctpassword) {
    return res.status(400).json({
      success: false,
      message: "incorrect password",
    });
  }
  return generateToken(finduser, 200, "Login Successful", res);
  return res.status(200).json({
    success: true,
    message: "login Successful",
    user: {
      id: finduser._id,
      name: finduser.name,
      email: finduser.email,
      password: correctpassword,
      role: finduser.role,
    },
  });
});
export const singleuser = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "User fetch successfully",
    user,
  });
});
export const logout = asynchandler(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      status: true,
      message: "logout successfull",
    });
});
export const resetpassword = asynchandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const resetToken = await user.getresetpasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordurl = `${process.env.FRONT_URL}/resetpassword/${resetToken}`;
  const message = GenerateForgetPasswordEmailTemplate(
    resetPasswordurl,
    user.name,
  );

  try {
    await sendemail({
      to: user.email,
      subject: "Password Reset Request",
      message,
    });
    res
      .status(200)
      .json({ success: true, message: `Email sent to ${user.email}` });
  } catch (error) {
    user.resetpasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res
      .status(500)
      .json({ success: false, message: "Email could not be sent" });
  }
});
export const forgetpassword = asynchandler(async (req, res) => {
  const { token } = req.params;
  const resetpasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetpasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  if (!req.body.password || !req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password and confimePassword not match",
    });
  }
  user.password = req.body.password;
  user.resetpasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  generateToken(user, 200, "password reset succesfully", res);
});
