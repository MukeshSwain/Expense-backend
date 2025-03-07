import Income from "../models/income.model.js";
import xlsx from "xlsx";

export const addIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const { icon, source, amount, date } = req.body;
    if (!icon || !source || !amount || !date) {
      return res.status(400).json({ message: "Something is missing" });
    }
    const newIncome = await Income.create({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    if (newIncome) {
      return res
        .status(201)
        .json({ message: "Income added successfully", success: true });
    }
  } catch (error) {
    console.log("Internal server error", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getAllIncome = async (req, res) => {
  const userId = req.user._id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res
      .status(200)
      .json({
        incomes,
        success: true,
        message: "Incomes fetched successfully",
      });
  } catch (error) {
    console.log("Internal server error", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Income deleted successfully", success: true });
  } catch (error) {
    console.log("Internal server error", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    //Prepare the data for excel
    const data = incomes.map((item) => ({
      source: item.source,
      amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Incomes");
    xlsx.writeFile(wb, "Income_detauls.xlsx");
    res.download("Income_detauls.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
