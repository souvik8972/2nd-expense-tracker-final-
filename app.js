const express = require('express');
const app = express();
const cors= require('cors');
const path=require("path")
const sequelize=require("./util/db")
const User=require("./model/userDb")
const Expense=require("./model/expenseDb")
const Order=require("./model/orders")
const bodyParser = require('body-parser')
//
const homeRoute=require("./routes/home")
const userRoute=require("./routes/user")
const dashboardRoute=require("./routes/dashboard")
const primemembership=require("./routes/purchase")
const passwordRoute=require("./routes/forgotPassword")
const premiumFeature=require("./routes/premiumFeature")


//


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))

app.use(cors());
///

app.use(homeRoute)
app.use(userRoute)
app.use(dashboardRoute )
app.use(passwordRoute)
app.use(primemembership)
app.use("/premium",premiumFeature)



//hasmany relations
User.hasMany(Expense)
Expense.belongsTo(User,
    {constraints:true, onDelete:'CASCADE'}
)
User.hasMany(Order)
Order.belongsTo(User)


sequelize.sync().then(()=>{
    app.listen(8080, ()=>{
        console.log(`listen on port http://localhost:8080`)
        console.log('Database and tables synchronized!');
        
    })

}).catch(err=>console.error(err))






