import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors"
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
export default app;
