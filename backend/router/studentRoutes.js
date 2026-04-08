import express from "express";
import {
    getAvailablesupervisor,
  getStudentProject,
  requestSupervisor,
  submitProposal,
  uploadFiles,
} from "../controller/studentcontroller.js";
import { authHandler, isAuthorised } from "../middleware/authHandler.js";
import { handleuploadError,upload} from "../middleware/upload.js";
export const Studentrouter = express.Router();

Studentrouter.get(
  "/project",
  authHandler,
  isAuthorised("Student"),
  getStudentProject,
);
Studentrouter.get(
  "/fetch-Supervisor", 
  authHandler,
  isAuthorised("Student"),
  getAvailablesupervisor
);
Studentrouter.post(
  "/proposal",
  authHandler,
  isAuthorised("Student"),
  submitProposal,
);
Studentrouter.post(
  "/upload/:projectId",
  authHandler,
  isAuthorised("Student"),
  upload.array("files", 10),
  handleuploadError,
  uploadFiles,
);
Studentrouter.post(
  "/request-supervisor", 
  authHandler, 
  isAuthorised("Student"), 
  requestSupervisor
);