const UserDb = require("../model/userDb");
const ExpenseDb = require("../model/expenseDb");
const {Sequelize} = require("sequelize");


exports.leaderboard = async (req, res) => {
    try {
        const leaderBoard = await UserDb.findAll({
            attributes: ['name','totalExpense' ],
            order: [['totalExpense', 'DESC']]
        });

        res.status(200).json(leaderBoard);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

exports.report = async (req, res) => {
    const user = req.user; 
    const year = req.query.year;
   

    

    try {
        const userExpenses = await user.getExpenses({
            where: {
                date: {
                    [Sequelize.Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
                },
            },
        });

        if (userExpenses) {
            res.status(200).json(userExpenses);
        }
    } catch (error) {
        console.error("Error retrieving expenses:", error);
        res.status(500).json({ success: false, error: error });
    }
};
