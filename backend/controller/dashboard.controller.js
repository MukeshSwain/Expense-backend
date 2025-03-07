import Expense from "../models/expense.model.js";
import Income from "../models/income.model.js";

import { isValidObjectId, Types } from "mongoose";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new Types.ObjectId(String(userId));

    //Fetch total expenses and incomes

    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    

    const totalIncomes = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    

    //get income transactions in  last 60 days

    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() -60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //get total income in last 60 days
    const incomeInLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //get expense transactions in last 30 days

    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 60 * 60 * 24 * 1000) },
    }).sort({ date: -1 });

    //get total expense in last 30 days
    const expenseInLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
      
      // fetch last 5 expenses and incomes

      const lastTransactions = [
          ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map((tnx) => ({
              ...tnx.toObject(),
              type: "income",
          })),
          ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map((tnx) => ({
              ...tnx.toObject(),
              type: "expense",
          })),
      ].sort((a, b) => b.date - a.date);//sort latest to oldest

      //final response

      res.status(200).json({success: true,message: "Dashboard data fetched successfully",
          totalBalance: (totalIncomes[0]?.total || 0) - (totalExpenses[0]?.total || 0),
          totalIncomes: totalIncomes[0]?.total || 0,
          totalExpenses: totalExpenses[0]?.total || 0,
          last30DaysExpenses: {
              total: expenseInLast30Days,
              transactions: last30DaysExpenseTransactions,
          },
          last60DaysIncomes: {
              total: incomeInLast60Days,
              transactions: last60DaysIncomeTransactions,
          },
          recentTransactions: lastTransactions
      })
  } catch (error) {
      console.log("Internal server error", error.message);
      return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
