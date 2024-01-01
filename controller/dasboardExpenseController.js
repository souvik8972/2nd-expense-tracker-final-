
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
  //creating a transaction with sequelize transaction for checking every operation should be done
  const t = await sequelize.transaction();
  //getting user information from authorized middleware
  const user = req.user;

  try {
    //getting all details of expense information
    const { category, pmethod, amount, date } = req.body;
    // Create the expense
    const createdExpense = await user.createExpense(
      {
        category,
        pmethod,
        amount,
        date,
      },
      //checking transaction details
      { transaction: t }
    );

  

    // Update the user's totalExpense using the newly created expense
    var total = Number(user.totalExpense) + Number(amount);
    //update total expense in totalexpense Db
    await user.update(
      { totalExpense: total },
      { transaction: t }
    );

    //checking transaction details all transactions operations done or not if done ==>
    await t.commit();
    

    res.status(201).json({ success: true, message: "Expense added successfully", expense: createdExpense });
  } catch (error) {
    //if one or more transaction opertations was not done ==>
    await t.rollback();
  
    res.status(500).json({ success: false, message: "Error adding expense", error: error.message });
  }
};

                            //get expense 


exports.getExpenses = async (req, res) => {
   //getting user information from authorized middleware
  const user = req.user;
  try {
    //getting page information
   const page=parseInt(req.query.page)
   const limit =parseInt(req.query.limit)

//skip the expense for that seeting offset
    const offset=(page-1)*limit
    //getting user expense
    const userexpense= await user.getExpenses(
      {
        offset: offset,
        limit: limit
      }
      
    );
    //getting total expense of user from tolatexpense db
    const total = await User.findOne({
      attributes: ['totalExpense' ],
      where: {
        id: user.id,
      },
     
  })
    const totalexpensdeltails=await user.getExpenses()
    const totalpages=Math.ceil(totalexpensdeltails.length/limit);
    //sending exepnses and total expenses
    if (userexpense) {
      res.status(200).json({userexpense,totalpages,total});
    }
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    //if server error
    res
      .status(500)
      .json({ success: false, message: "Error retrieving expenses" });
  }
};


                      //delete expense///

exports.deleteExpenses = async (req, res) => {
  //creating transaction
  const t = await sequelize.transaction();
//getting user information from authorized middleware
  const user = req.user;
  //getting expense id from param 
  const expenseId = req.params.id;
  try {

    //finding expense ammount for update in total expense
    const expense = await Expense.findOne({
      attributes: ['amount'], 
      where: { id: expenseId },
    });

//delete expense using id of expense and user id 
    await Expense.destroy({
      where: {
        id: expenseId,
        userId: user.id,
      }
    },
    { transaction: t }
    )
    
    //subtract the amount from total
    const total = Number(user.totalExpense) - Number(expense.amount);
    //upate the total amountfor the user account
    await user.update(
      { totalExpense: total },
      { transaction: t }
     
    );
    //transaction is complete
    await t.commit();
    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    //transaction is not complete
    await t.rollback();
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, message: "Error deleting expense" });
  }
};





                    //download history of expense details

                    
exports.downloadexpense=async(req,res)=>{

try {
  
  const expenses= await req.user.getExpenses()
  // console.log(expenses)
  const  stringify= JSON.stringify(expenses)
  //file name wiil be =>
  const filename="Expenses.txt"
  //uploading to s3
  const fileURL= await uploadToS3(stringify,filename)
  // console.log(fileURL)
  res.status(200).json({fileURL,success:true})
  
} catch (error) {
  console.log(error)
  
}


}

                  //function for upload to s3

                  
function uploadToS3(data, filename) {
  // Creating a new Promise to handle the asynchronous nature of AWS S3 operations
  return new Promise((resolve, reject) => {
        // Retrieve AWS S3 credentials from environment variables
    const BUCKET_NAME = process.env.BUCKET_NAME
    const IAM_USER_KEY = process.env.IAM_USER_KEY
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET

        // Create a new instance of the AWS S3 service

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });
      // Create an S3 bucket 
    s3bucket.createBucket(() => {
      var params = {
          // Set up parameters for the S3 upload
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
      };
  // Upload the data to the specified S3 bucket and file key
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          // Log the error and reject the promise
          console.log(err);
          reject(err);
        } else {
        
          // Resolve with the file URL
          resolve(s3response.Location);
        }
      });
    });
  });
}
