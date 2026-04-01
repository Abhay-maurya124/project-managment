import express from "express";
import {
  allUser,
  createStudent,
  createTeacher,
  deleteStudent,
  deleteTeacher,
  updateStudent,
  updateTeacher,
} from "../controller/adminController.js";
import { authHandler, isAuthorised } from "../middleware/authHandler.js";
export const adminrouter = express.Router();

adminrouter.post(
  "/createStudent",
  authHandler, 
  isAuthorised("Admin"),
  createStudent,
);
adminrouter.put(
  "/updateStudent/:id",
  authHandler,
  isAuthorised("Admin"),
  updateStudent,
);
adminrouter.delete(
  "/deleteStudent/:id",
  authHandler,
  isAuthorised("Admin"),
  deleteStudent,
);
adminrouter.post(
  "/createTeacher",
  authHandler, 
  isAuthorised("Admin"),
  createTeacher,
);
adminrouter.put(
  "/updateTeacher/:id",
  authHandler,
  isAuthorised("Admin"),
  updateTeacher,
);
adminrouter.delete(
  "/deleteTeacher/:id",
  authHandler,
  isAuthorised("Admin"),
  deleteTeacher,
);

adminrouter.get(
 "/allUser",
  authHandler, 
  isAuthorised("Admin"),
  allUser
);