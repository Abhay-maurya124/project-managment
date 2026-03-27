import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { asynchandler } from "../middleware/asyncHandler.js";

export const authHandler = asynchandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this token",
      });
    }
    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.name === "TokenExpiredError" ? "Session Expired" : "Invalid Token",
    });
  }
});