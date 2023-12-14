
const express = require("express");
const route = express.Router();

const UserDb=require("../model/userDb")
const ExpenseDb=require("../model/expenseDb")
const authController= require("../middleware/authentication")



route.get("/leaderboard",authController.auth, async (req,res)=>{
    try {
        const Users=await UserDb.findAll()
        const expenses=await ExpenseDb.findAll()
        let sepUserandmakeKeyValue={}
      expenses.forEach((expense)=>{
        if(sepUserandmakeKeyValue[expense.UserId]){
            sepUserandmakeKeyValue[expense.UserId]+=expense.amount
            
        }else{
            sepUserandmakeKeyValue[expense.UserId]=expense.amount 
        }
      })
      let UserDetails=[]
      Users.forEach((user)=>{
        UserDetails.push({name:user.name,total_spent:sepUserandmakeKeyValue[user.id]||0})

      })
      UserDetails.sort((a, b) => b.total_spent - a.total_spent);

console.log(UserDetails)
 res.status(200).json(UserDetails)
    } catch (error) {
        res.json({error: error})
    }
})




module.exports=route