import express from "express";
import {
  allUser,
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
router.get("/allUser", allUser);
router.post("/loginUser", loginUser);
router.get("/singleuser", authHandler, singleuser);
router.get("/logout", authHandler, logout);
router.post("/resetpassword",authHandler, resetpassword);
router.put("/forgetpassword/:token",forgetpassword);
