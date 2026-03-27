import express from "express";
import { allUser, deleteallUser, loginUser, logout, registerUser } from "../controller/authController.js";
import { authHandler } from "../middleware/authHandler.js";
export const router = express.Router();

router.post("/register", registerUser);
router.post("/deleteallUser", deleteallUser);
router.get("/allUser", allUser);
router.get("/loginUser", loginUser);
router.get("/logout",authHandler, logout);
