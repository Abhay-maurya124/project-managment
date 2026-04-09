import express from "express";
import {
  deleteNotification,
  getNotifications,
  markAllReadmsg,
  markAsReadmsg,
} from "../controller/notificationcontroller.js";
import { authHandler, isAuthorised } from "../middleware/authHandler.js";
export const notificationrouter = express.Router();

notificationrouter.get("/", authHandler, getNotifications);
notificationrouter.put("/:id/read", authHandler, markAsReadmsg);
notificationrouter.put("/read-all", authHandler, markAllReadmsg);
notificationrouter.delete("/:id/delete", authHandler, deleteNotification);
