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

const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.get("/", (req, res) => {
  res.send("hello world");
})
app.use("/api/auth", authRoute);
app.use("/api/income", incomeRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/dashboard", dashboardRoute);
app.listen(port, () => {
  connectDB();
  console.log(`server is running on http://localhost:${port}`);
});

export default app