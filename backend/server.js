import app from "./app.js";
import { connectDB } from "./config/db.js";
connectDB();
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  try {
    console.log(`connected to port ${PORT}`);
  } catch (error) {
    console.log(
      `connection error to port ${PORT} with error -: ${error}`,
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
