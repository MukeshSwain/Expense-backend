import express from "express";
import {
  addExpense,
  deleteExpense,
  downloadExpenseExcel,
  getAllExpense,
} from "../controller/expense.controller.js";
import { protect } from "../middleware/protect.js";


const router = express.Router();
router.route('/addexpense').post(protect, addExpense);
router.route('/getallexpense').get(protect, getAllExpense);
router.route('/delete/:id').delete(protect, deleteExpense);
router.route('/downloadexcel').get(protect, downloadExpenseExcel);


export default router