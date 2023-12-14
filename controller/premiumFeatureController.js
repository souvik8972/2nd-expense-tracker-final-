

const UserDb=require("../model/userDb")
const ExpenseDb=require("../model/expenseDb")
const sequelize = require("../util/db")

exports.leaderboard= async (req,res)=>{
    try {
        const leaderBoard=await UserDb.findAll(
            {
                attributes:["id","name", [
                    sequelize.fn("COALESCE", sequelize.fn("sum", sequelize.col("expenses.amount")), 0.00),
                    "total_spent",
                  ],  ],
                include:[
                    {
                        model:ExpenseDb,
                        attributes:[]
                    }
                ],
                group:["user.id"],
                order:[['total_spent','DESC']]
            }
        )



 res.status(200).json(leaderBoard)
    } catch (error) {
        res.json({error: error})
    }
}