

// function authentication() {
//   const tokenData = JSON.parse(localStorage.getItem('token'));
//    console.log(tokenData)
//   if (tokenData) {
//     const { token } = tokenData;
  

//     // Return the authenticated axios instance
// const authaxis= axios.create({
//       baseURL: 'http://localhost:8080',
//       headers: {
//          'Authorization': `${token}`,
//       //   'Authorization': `Bearer ${token}`,
//         'userName': `souvik`
//       }
     
//     })
// return authaxis;
//   } else {
//     alert("please Log in frist");
//     window.location.href = "http://localhost:8080/login";
//   }
// }
function authentication() {
   const tokenData = JSON.parse(localStorage.getItem('token'));
   console.log('Token Data:', tokenData);

   if (tokenData) {
      const { token } = tokenData;

      // Return the authenticated axios instance
      const authaxis = axios.create({
         baseURL: 'http://localhost:8080',
         headers: {
            'Authorization': `Bearer ${token}`,
            'userName': 'souvik',
         },
      });

      return authaxis;
   } else {
      alert("Please log in first");
      window.location.href = "http://localhost:8080/login";
   }
}


const authenticatedAxios = authentication();
const expenseForm = document.getElementById("form");
expenseForm.addEventListener("submit", addExpense);
const expenseTableBody = document.getElementById("expenseTableBody")
expenseTableBody.addEventListener("click",deleteExpense)




document.addEventListener("DOMContentLoaded", function () {



   const toke=localStorage.getItem('token');
   const check =parseJwt(toke) 
 if(check.ispremiumuser){
    document.getElementById("rzp-button1").style.display="none"
  document.getElementById("massage").innerHTML="Prime member"
  showLeaderboard()
//   showLeaderboard()
 }
 
  // Call authentication and use the returned axios instance
 
  
  fetchExpenses();



 








 
});



async function addExpense(e) {
   e.preventDefault();

   try {
      const category = e.target.elements.options.value;
      const pmethod = e.target.elements.pmethod.value;
      const amount = e.target.elements.amount.value;
      const date = e.target.elements.date.value;

      const data = {
         category,
         pmethod,
         amount,
         date
      };

     
      const response = await authenticatedAxios.post("/addExpense", data);
      e.target.reset()
      alert("data added successfully")
      // Refresh 
      fetchExpenses();
   } catch (error) {
      console.error("Error adding expense:", error);
   }
}


async function fetchExpenses() {

   try {
      const authenticatedAxios = authentication();
      const response = await authenticatedAxios.get("/getExpenses");
      const expenses = response.data;
      const totalshow=document.getElementById("total")

      // Update the table with fetched expenses
      const expenseTableBody = document.getElementById("expenseTableBody");
      expenseTableBody.innerHTML = "";
    let total=0;
      expenses.forEach(expense => {
       total+=expense.amount
         const row = document.createElement("tr");
         row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.pmethod}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
          <td><button class="deletebtn" id="${expense.id}">Delete</button></td>
         `;
         expenseTableBody.appendChild(row);
      }
      
      
      );
      totalshow.innerHTML=`total: ${total}`
   } catch (error) {
      console.error("Error fetching expenses:", error);
   }
}


async function deleteExpense(e) {
   try {
      const id=e.target.id;
      const response = await authenticatedAxios.get(`/deleteExpense/${id}`);
      fetchExpenses();
      console.log("Expense deleted successfully");

      // Refresh the expenses after deletion
     
   } catch (error) {
      console.error("Error deleting expense:", error);
   }
}



document.getElementById("logout").addEventListener("click",logout)
function logout(){
   localStorage.removeItem("token")
   window.location.href = "http://localhost:8080";
   
}

function parseJwt (token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));

   return JSON.parse(jsonPayload);
}


//purchas Prime
const  rz1=document.getElementById("rzp-button1").onclick = async function (e) {
   console.log("waiting");
   e.preventDefault();
   const authenticatedAxios = await authentication();

   try {

       

       const response = await authenticatedAxios.get("/premiummembership");
      //  console.log(response);

       var options = {
           key: response.data.key_id, 
           order_id: response.data.order_id,
           handler: async function (response) {
               try {
                   // Use options.order_id outside the options object
                 const res=  await authenticatedAxios.post("/updatetransactionstatus", {
                       order_id: options.order_id,
                       payment_id: response.razorpay_payment_id,
                   });
                   const  rz1=document.getElementById("rzp-button1").innerText="prime member"
                   rz1.disabled = true
                  
                   alert("Congratulations You are now Premium member please login")
                   document.getElementById("rzp-button1").style.display="none"
                   
                   document.getElementById("massage").innerHTML="Prime member"
                  localStorage.setItem("token",JSON.stringify(res.data.token))
                  authentication()
                  
                  window.location.href="http://localhost:8080/dashboard"


                   
               } catch (error) {
                   console.log(error,"in razor pay");
               }
           },
       };

       const rzp1 = new Razorpay(options);
       rzp1.open();
       
       rzp1.on("payment.failed", (response, err) => {
           alert("failed");
           console.log(response);
       });
   } catch (error) {
       console.log(error);
   }
};


 
 
 

async function showLeaderboard(){
   const leaderboardBtn=document.getElementById("leaderboard")
   leaderboardBtn.style.display="block"
leaderboardBtn.addEventListener("click",showingLeaderboard)

}
async function showingLeaderboard(){

   try {
      
      const response=await authenticatedAxios.get("premium/leaderboard")
      const data=response.data
console.log(data)
const leaderboardTableBody=document.getElementById("leaderboardTableBody")
leaderboardTableBody.innerHTML=""
      data.forEach(userData=>{
const row =document.createElement("tr")
row.innerHTML=`
                  
<td>${userData.name}</td>
<td>${userData.total_spent} <span>Rs.</span></td>


`;
leaderboardTableBody.appendChild(row)


      })
      
   } catch (error) {
      console.log(error)

}}