import { asynchandler } from "../middleware/asyncHandler.js";
import { User } from "../models/user.js";
import * as userServices from "../serrvices/userServices.js";
export const createStudent = asynchandler(async (req, res) => {
  const { name, password, email, department } = req.body;
  if (!name) {
    return res.status(400).json({
      status: false,
      message: "Name is required",
    });
  }
  if (!email) {
    return res.status(400).json({
      status: false,
      message: "Email is required",
    });
  }
  if ( !password ) {
    return res.status(400).json({
      status: false,
      message: "password is required",
    });
  }
  if ( !department) {
    return res.status(400).json({
      status: false,
      message: "department is required",
    });
  }
  const studentdata = {
    name,
    password,
    email,
    department,
    role: "Student",
  };
  const user = await userServices.createUser(studentdata);
  return res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: { user },
  });
});
export const updateStudent = asynchandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.role;

  const user = await userServices.updateStudentData(id, updateData);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Student updatend successfully",
    data: { user },
  });
});
export const deleteStudent = asynchandler(async (req, res) => {
  const { id } = req.params;
  const user = await userServices.getUserById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }
  if (user.role !== "Student") {
    return res.status(400).json({
      success: false,
      message: "User is not a Student",
    });
  }
  await userServices.deleteUser(id);
  res.status(200).json({
    success: false,
    message: "Student delete Succesfully",
  });
});
export const createTeacher = asynchandler(async (req, res) => {
  const { name, password, email, department, experties, maxStudents } =
    req.body;
  if (
    !name ||
    !password ||
    !email ||
    !department ||
    !experties ||
    !maxStudents
  ) {
    return res.status(400).json({
      status: false,
      message: "Credientials not found name, password, email or department",
    });
  }
  const Teacherdata = {
    name,
    password,
    email,
    department,
    experties: Array.isArray(experties)
      ? experties
      : typeof experties === "string" && experties.trim() !== ""
        ? experties.split(",").map((s) => s.trim())
        : [],
    maxStudents,
    role: "Teacher",
  };
  const user = await userServices.createUser(Teacherdata);
  return res.status(201).json({
    success: true,
    message: "Teacher created successfully",
    data: { user },
  });
});
export const updateTeacher = asynchandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.role;

  const user = await userServices.updateTeacherData(id, updateData);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Teacher not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Teacher updatend successfully",
    data: { user },
  });
});
export const deleteTeacher = asynchandler(async (req, res) => {
  const { id } = req.params;
  const user = await userServices.getUserById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Teacher not found",
    });
  }
  if (user.role !== "Teacher") {
    return res.status(400).json({
      success: false,
      message: "User is not a Teacher",
    });
  }
  await userServices.deleteUser(id);
  res.status(200).json({
    success: true,
    message: "Teacher delete Succesfully",
  });
});
export const allUser = asynchandler(async (req, res) => {
  const query = { role: { $ne: "Admin" } };
  const Alluser = await User.find(query)
    .select("-password -resetpasswordToken -resetPasswordExpires")
    .sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message: "User Fetch successfull",
    Alluser,
  });
});
