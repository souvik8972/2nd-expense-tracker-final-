const Expense = require("../model/expenseDb");

const User = require("../model/userDb");
const sequelize = require("../util/db");

//get dashboard
exports.getDashboard = (req, res) => {
  res.sendFile("dashboard.html", { root: "views" });
};
//add expense
exports.addExpense = async (req, res) => {
  
  const t = await sequelize.transaction();
  const user = req.user;

  try {
    
    const { category, pmethod, amount, date } = req.body;
    // Create the expense
    const createdExpense = await user.createExpense(
      {
        category,
        pmethod,
        amount,
        date,
      },
      { transaction: t }
    );

  

    // Update the user's totalExpense using the newly created expense
    const total = Number(user.totalExpense) + Number(amount);
    await user.update(
      { totalExpense: total },
      { transaction: t }
    );

    
    await t.commit();
    

    res.status(201).json({ success: true, message: "Expense added successfully", expense: createdExpense });
  } catch (error) {
 
    await t.rollback();
  
    res.status(500).json({ success: false, message: "Error adding expense", error: error.message });
  }
};

//get expense
exports.getExpenses = async (req, res) => {
  const user = req.user;
  try {
    const userexpense = await user.getExpenses();
    if (userexpense) {
      res.status(200).json(userexpense);
    }
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving expenses" });
  }
};
//delete expense
exports.deleteExpenses = async (req, res) => {
  const t = await sequelize.transaction();

  const user = req.user;
  const expenseId = req.params.id;
  try {
    const expense = await Expense.findOne({
      attributes: ['amount'], 
      where: { id: expenseId },
    });


    await Expense.destroy({
      where: {
        id: expenseId,
        userId: user.id,
      }
    },
    { transaction: t }
    )
    
  
    const total = Number(user.totalExpense) - Number(expense.amount);

    await user.update(
      { totalExpense: total },
      { transaction: t }
     
    );
    await t.commit();
    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, message: "Error deleting expense" });
  }
};
