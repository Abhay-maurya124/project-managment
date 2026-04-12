import express from "express";
import {
  allProjects,
  allUser,
  approveProject,
  assignSupervisor,
  createStudent,
  createTeacher,
  deleteStudent,
  deleteTeacher,
  getAdminDashboardStats,
  updateStudent,
  updateTeacher,
} from "../controller/adminController.js";
import { authHandler, isAuthorised } from "../middleware/authHandler.js";

export const adminrouter = express.Router();

adminrouter.post(
  "/createStudent",
  authHandler,
  isAuthorised("Admin"),
  createStudent
);
adminrouter.put(
  "/updateStudent/:id",
  authHandler,
  isAuthorised("Admin"),
  updateStudent
);
adminrouter.delete(
  "/deleteStudent/:id",
  authHandler,
  isAuthorised("Admin"),
  deleteStudent
);
adminrouter.post(
  "/createTeacher",
  authHandler,
  isAuthorised("Admin"),
  createTeacher
);
adminrouter.put(
  "/updateTeacher/:id",
  authHandler,
  isAuthorised("Admin"),
  updateTeacher
);
adminrouter.delete(
  "/deleteTeacher/:id",
  authHandler,
  isAuthorised("Admin"),
  deleteTeacher
);

adminrouter.get("/allUser", authHandler, isAuthorised("Admin"), allUser);

adminrouter.get(
  "/fetch-dashboard-stats",
  authHandler,
  isAuthorised("Admin"),
  getAdminDashboardStats
);

adminrouter.post(
  "/assign-supervisor",
  authHandler,
  isAuthorised("Admin"),
  assignSupervisor
);

adminrouter.get(
  "/all-projects",
  authHandler,
  isAuthorised("Admin"),
  allProjects
);

adminrouter.put(
  "/approve-project/:id",
  authHandler,
  isAuthorised("Admin"),
  approveProject
);