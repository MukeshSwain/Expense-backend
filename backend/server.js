import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

import authRoute from "./route/auth.route.js";
import incomeRoute from "./route/income.route.js";
import expenseRoute from "./route/expense.route.js";
import dashboardRoute from "./route/dashboard.route.js";

// Connect to Database (Only once)
try {
  await connectDB();
} catch (error) {
  console.log("Failed to connect to database ", error.message);
  
}
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world from Vercel!");
});

app.use("/api/auth", authRoute);
app.use("/api/income", incomeRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/dashboard", dashboardRoute);

export default app; // No app.listen()
