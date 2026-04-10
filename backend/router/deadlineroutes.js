import express from "express";
import { authHandler, isAuthorised } from "../middleware/authHandler.js";
import { createDeadline } from "../controller/deadlinecontroller.js";
export const deadlinerouter = express.Router();

deadlinerouter.post(
  "/create/:id",
  authHandler,
  isAuthorised("Admin"),
  createDeadline,
);
