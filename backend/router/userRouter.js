import express from "express";
import { allUser, deleteallUser, registerUser } from "../controller/authController.js";
export const router = express.Router();

router.post("/register", registerUser);
router.post("/deleteallUser", deleteallUser);
router.get("/allUser", allUser);
