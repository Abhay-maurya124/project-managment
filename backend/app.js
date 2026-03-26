import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.js";
import { router } from "./router/userRouter.js";
config();
const app = express();
app.use(
  cors({
    origin: [process.env.FRONT_URL],
    method: ["GET", "PUT", "DELET", "POST"],
    Credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);
app.use("/user", router);
export default app;
