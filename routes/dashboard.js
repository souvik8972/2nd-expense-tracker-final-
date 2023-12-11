const express = require("express");
const route = express.Router();
const Expense = require("../model/expenseDb");
const authorization = require("../middleware/authentication");

// Dashboard route
route.get("/dashboard",(req,res)=>{
   res.sendFile("dashboard.html",{root:"views"})
});

// Add Expense route
route.post("/addExpense", authorization.auth, (req, res) => {
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
});

// Get Expenses route
route.get("/getExpenses", authorization.auth, (req, res) => {
   const user = req.user;

   user.getExpenses()
   .then(result => {
      res.status(200).json(result);
   })
   .catch(err => {
      console.error("Error retrieving expenses:", err);
      res.status(500).json({ success: false, message: "Error retrieving expenses" });
   });
});

// Delete Expense route
route.get("/deleteExpense/:id", authorization.auth, (req, res) => {
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
});
module.exports = route;