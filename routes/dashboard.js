const express = require("express");
const route = express.Router();
const controller=require("../controller/dasboardExpenseController")
const authorization = require("../middleware/authentication");
// Dashboard route
route.get("/dashboard",controller.getDashboard);

// Add Expense route
route.post("/addExpense",authorization.auth,  controller.addExpense);

// Get Expenses route
route.get("/getExpenses",authorization.auth,controller.getExpenses  );

// Delete Expense route
route.get("/deleteExpense/:id", authorization.auth, controller.deleteExpenses);





module.exports = route;