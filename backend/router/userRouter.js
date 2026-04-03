import express from "express";
import {
  deleteallUser,
  forgetpassword,
  loginUser,
  logout,
  registerUser,
  resetpassword,
  singleuser,
} from "../controller/authController.js";
import { authHandler } from "../middleware/authHandler.js";
export const router = express.Router();

router.post("/register", registerUser);
router.post("/deleteallUser", deleteallUser);
router.post("/loginUser", loginUser);
router.get("/checkAuth", authHandler, singleuser);
router.post("/logout", authHandler, logout);
router.post("/resetpassword", resetpassword);
router.put("/forgetpassword/:token",forgetpassword);
