const Expense = require("../model/expenseDb");



//get dashboard
exports.getDashboard=(req,res)=>{
    res.sendFile("dashboard.html",{root:"views"})
 }
 //add expense
 exports.addExpense=(req, res) => {
    const user = req.user;
    const { category, pmethod, amount, date } = req.body;
 
    user.createExpense({
       category,
       pmethod,
       amount,
       date
    })
    .then(() => {
       res.status(201).json({ success: true, message: "Expense added successfully" });
    })
    .catch(err => {
       console.error("Error adding expense:", err);
       res.status(500).json({ success: false, message: "Error adding expense" });
    });
 }
 //get expense
 exports.getExpenses=(req, res) => {
    const user = req.user;
 
    user.getExpenses()
    .then(result => {
       res.status(200).json(result);
    })
    .catch(err => {
       console.error("Error retrieving expenses:", err);
       res.status(500).json({ success: false, message: "Error retrieving expenses",});
    });
 }
 //delete expense 
 exports.deleteExpenses=(req, res) => {
    const user = req.user;
    const expenseId = req.params.id;
 
    Expense.destroy({
       where: {
          id: expenseId,
          userId: user.id 
       }
    })
    .then(() => {
       res.status(200).json({ success: true, message: "Expense deleted successfully" });
    })
    .catch(err => {
       console.error("Error deleting expense:", err);
       res.status(500).json({ success: false, message: "Error deleting expense" });
    });
 }