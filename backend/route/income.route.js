import express from "express";
import { protect } from "../middleware/protect.js";
import { addIncome, deleteIncome, downloadIncomeExcel, getAllIncome } from "../controller/income.controller.js";
import { get } from "mongoose";

const router = express.Router();

router.route("/addincome").post(protect, addIncome);
router.route("/getallincome").get(protect, getAllIncome);
router.route("/delete/:id").delete(protect, deleteIncome);
router.route("/downloadexcel").get(protect, downloadIncomeExcel);

export default router;