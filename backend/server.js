import app from "./app.js";
import { connectDB } from "./config/db.js";

connectDB();
const server = app.listen(process.env.PORT, () => {
  try {
    console.log(`connected to port ${process.env.PORT}`);
  } catch (error) {
    console.log(
      `connection error to port ${process.env.PORT} with error -: ${error}`,
    );
  }
});

//error handling

process.on("unhandledRejection", (err) => {
  console.log(`unhandled Rejection ${err.message}`);
  server.close(() => process.exit(1));
});
process.on("uncaughtException", (err) => {
  console.log(`uncaught Exception ${err.message}`);
  process.exit(1);
});
