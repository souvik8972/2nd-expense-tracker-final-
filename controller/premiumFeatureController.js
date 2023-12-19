const UserDb = require("../model/userDb");
const ExpenseDb = require("../model/expenseDb");


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
