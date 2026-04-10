import express from "express";
import { authHandler, isAuthorised } from "../middleware/authHandler.js";
import {
  getAllProjects,
  downloadFilesfromAdmin,
} from "../controller/projectController.js";
export const projectRoutes = express.Router();
projectRoutes.get("/", authHandler, isAuthorised("Admin"), getAllProjects);
projectRoutes.get(
  "/:projectId/files/:fileId/download",
  authHandler,
  isAuthorised("Admin"),
  downloadFilesfromAdmin,
);
