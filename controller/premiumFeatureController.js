const UserDb = require("../model/userDb");
const ExpenseDb = require("../model/expenseDb");
const {Sequelize} = require("sequelize");


            //leaderboard 

exports.leaderboard = async (req, res) => {
    try {
        // Fetch the leaderboard data from the UserDb model
        const leaderBoard = await UserDb.findAll({
            attributes: ['name','totalExpense' ],// Specify the attributes to retrieve
            order: [['totalExpense', 'DESC']]// Order the results by totalExpense in descending order
        });
         // Send the leaderboard data as a JSON response
        res.status(200).json(leaderBoard);
    } catch (error) {
         // Handle errors by sending an appropriate error response
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};


                //report 

exports.report = async (req, res) => {
    const user = req.user; // Retrieve the user from the request object
    const year = req.query.year;// Retrieve the year parameter from the query string


    try {
         // Fetch user expenses for the specified year using Sequelize's getExpenses method
        const userExpenses = await user.getExpenses({
            where: {
                date: {
                    // Filter expenses based on the date range for the specified year
                    [Sequelize.Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
                },
            },
        });


         // Check if user expenses were successfully retrieved
         
        if (userExpenses) {
             // Send the user expenses as a JSON response
            res.status(200).json(userExpenses);
        }
    } catch (error) {
        // Handle errors by logging and sending an appropriate error response
        console.error("Error retrieving expenses:", error);
        res.status(500).json({ success: false, error: error });
    }
};
