import Expense from "../models/expense.model.js";
import xlsx from "xlsx";

export const addExpense = async (req, res) => {
    const userId = req.user._id
    try {
        const { icon, category, amount, date } = req.body
        if (!icon || !category || !amount || !date) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        })
        await newExpense.save()
        res.status(201).json({ message: "Expense added successfully", success: true, expense: newExpense })
    } catch (error) {
        console.log("Internal server error", error.message);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false });
        
    }
}

export const getAllExpense = async (req, res) => { 
    const userId = req.user._id
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 })
        res.status(200).json({ expenses, success: true, message: "Expenses fetched successfully" })
    } catch (error) {
        console.log("Internal server error", error.message);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false });
        
    }
}

export const deleteExpense = async(req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Expense deleted successfully", success: true })
    } catch (error) {
        console.log("Internal server error", error.message);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false });
        
    }
}

export const downloadExpenseExcel = async (req, res) => { 
    const userId = req.user._id
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 })

        //Prepare the data for excel
        const data = expenses.map((item) => ({
            category: item.category,
            amount: item.amount,
            Date: item.date
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "expenses");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    } catch (error) {
        console.log("Internal server error", error.message);
        return res
        .status(500)
        .json({ message: "Internal server error", success: false });
        
    }
}