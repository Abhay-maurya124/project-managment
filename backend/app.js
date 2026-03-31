import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.js";
import { router } from "./router/userRouter.js";
import { adminrouter } from "./router/adminroutes.js";
config();
const app = express();
app.use(
  cors({
    origin: [process.env.FRONT_URL],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", router);
app.use("/admin", adminrouter);
app.use(errorMiddleware);
export default app;
