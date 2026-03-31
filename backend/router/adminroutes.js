import express from "express";
import {
  createStudent,
  deleteStudent,
  updateStudent,
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
