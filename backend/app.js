import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.js";
import { router } from "./router/userRouter.js";
import { adminrouter } from "./router/adminroutes.js";
import { Studentrouter } from "./router/studentRoutes.js";
import { notificationrouter } from "./router/notificationroutes.js";
import { projectRoutes } from "./router/projectsroutes.js";
import { deadlinerouter } from "./router/deadlineroutes.js";
import { Teacherrouter } from "./router/teacherrroutes.js";

config();

const app = express();
app.use(
  cors({
    origin: [process.env.FRONT_URL, "https://projectmanagementabhay.netlify.app", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", router);
app.use("/admin", adminrouter);
app.use("/student", Studentrouter);
app.use("/teacher", Teacherrouter);
app.use("/notification", notificationrouter);
app.use("/project", projectRoutes);
app.use("/deadline", deadlinerouter);
app.get("/", (req, res) => {
  res.send("Server is Running Smoothly");
});

app.use(errorMiddleware);

export default app;