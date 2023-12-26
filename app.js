const express = require('express');
const fs= require('fs');
const app = express();
const cors= require('cors');
const path=require("path")
const sequelize=require("./util/db")
const User=require("./model/userDb")
const Expense=require("./model/expenseDb")
const Order=require("./model/orders")
const Forgotpassword=require("./model/forgotpasswordDb")
const bodyParser = require('body-parser')
const helmet=require("helmet")
const compression=require("compression")
// const morgan = require("morgan")
require("dotenv").config()
const PORT=process.env.PORT || 8080
//

const homeRoute=require("./routes/home")
const userRoute=require("./routes/user")
const dashboardRoute=require("./routes/dashboard")
const primemembership=require("./routes/purchase")
const passwordRoute=require("./routes/forgotPassword")
const premiumFeature=require("./routes/premiumFeature")


// const accessLogSteram=fs.createWriteStream(path.join(__dirname,"access.log"),{flags:"a"})
//


app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))

app.use(cors());
// app.use(morgan(("combined",{stream:accessLogSteram})))
////////

app.use(homeRoute)
app.use(userRoute)
app.use(dashboardRoute )
app.use(passwordRoute)
app.use(primemembership)
app.use("/premium",premiumFeature)


app.get("*",(req, res) => {
    res.sendFile("404.html", { root: "views" });
})

//hasmany relations
User.hasMany(Expense)
Expense.belongsTo(User,
    {constraints:true, onDelete:'CASCADE'}
)
User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`listen on port http://localhost:${PORT}`)
        console.log('Database and tables synchronized!');
        
    })

}).catch(err=>console.error(err))




//test jenkins

