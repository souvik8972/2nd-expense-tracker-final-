
const Expense = require("../model/expenseDb");

const User = require("../model/userDb");
const sequelize = require("../util/db");
const AWS=require("aws-sdk")
require ("dotenv").config()

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
    var total = Number(user.totalExpense) + Number(amount);
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
   const page=req.query.page
   const limit =5


    const offset=(page-1)*limit
    
    const userexpense= await user.getExpenses(
      {
        offset: offset,
        limit: limit
      }
      
    );
    const total = await User.findOne({
      attributes: ['totalExpense' ],
      where: {
        id: user.id,
      },
     
  })
    const totalexpensdeltails=await user.getExpenses()
    const totalpages=Math.ceil(totalexpensdeltails.length/limit);
    if (userexpense) {
      res.status(200).json({userexpense,totalpages,total});
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

exports.downloadexpense=async(req,res)=>{

try {
  
  const expenses= await req.user.getExpenses()
  // console.log(expenses)
  const  stringify= JSON.stringify(expenses)
  const filename="Expenses.txt"
  const fileURL= await uploadToS3(stringify,filename)
  // console.log(fileURL)
  res.status(200).json({fileURL,success:true})
  
} catch (error) {
  console.log(error)
  
}


}


function uploadToS3(data, filename) {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const IAM_USER_KEY = process.env.IAM_USER_KEY
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    s3bucket.createBucket(() => {
      var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
      };

      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log(err);
          // console.log(process.env.IAM_USER_KEY)
          reject(err);
        } else {
          // console.log("Success", s3response);
          // Resolve with the file URL
          resolve(s3response.Location);
        }
      });
    });
  });
}
