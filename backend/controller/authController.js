import { asynchandler } from "../middleware/asyncHandler.js";
import { User } from "../models/user.js";
import { generateToken } from "../utiles/genratetoken.js";
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
export const allUser = asynchandler(async (req, res) => {
  const FindAll = await User.find({});
  return res.status(200).json({
    success: true,
    message: "User Fetch successfull",
    FindAll,
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
  return res.status(200).json({
    success: true,
    message: "login Successful",
    user: {
      id: finduser._id,
      name: finduser.name,
      email: finduser.email,
      password: correctpassword,
    },
  });
});
export const singleuser = asynchandler(async (req, res) => {
  const userId = req.userid;
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
