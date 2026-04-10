import express from "express";
import { authHandler, isAuthorised } from "../middleware/authHandler.js";
import { getTeacherDashBoardStats } from "../controller/teachercontroller.js";
export const Teacherrouter = express.Router();
Teacherrouter.get(
  "/getDashboardStats",
  authHandler,
  isAuthorised("Teacher"),
  getTeacherDashBoardStats,
);
