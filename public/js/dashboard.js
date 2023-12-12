

function authentication() {
  const tokenData = JSON.parse(localStorage.getItem('token'));
console.log(tokenData)
  if (tokenData) {
    const { token } = tokenData;
   //  console.log(token)

    // Return the authenticated axios instance
const authaxis= axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
         'Authorization': `${token}`,
      //   'Authorization': `Bearer ${token}`,
        'userName': `souvik`
      }
     
    })
return authaxis;
  } else {
    alert("please Log in frist");
    window.location.href = "http://localhost:8080/login";
  }
}


document.addEventListener("DOMContentLoaded", function () {



   const toke=localStorage.getItem('token');
   const check =parseJwt(toke)
   console.log(check)
 if(check.ispremiumuser){
    document.getElementById("rzp-button1").style.display="none"
  document.getElementById("massage").innerHTML="Prime member"
 }
 
  // Call authentication and use the returned axios instance
  const authenticatedAxios = authentication();
  const expenseForm = document.getElementById("form");
  expenseForm.addEventListener("submit", addExpense);
  const expenseTableBody = document.getElementById("expenseTableBody")
  expenseTableBody.addEventListener("click",deleteExpense)
  
  fetchExpenses();



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
  async function fetchExpenses() {
     try {
        const response = await authenticatedAxios.get("/getExpenses");
        const expenses = response.data;

        // Update the table with fetched expenses
        const expenseTableBody = document.getElementById("expenseTableBody");
        expenseTableBody.innerHTML = "";

        expenses.forEach(expense => {
           const row = document.createElement("tr");
           row.innerHTML = `
              <td>${expense.category}</td>
              <td>${expense.pmethod}</td>
              <td>${expense.amount}</td>
              <td>${expense.date}</td>
            <td><button class="deletebtn" id="${expense.id}">Delete</button></td>
           `;
           expenseTableBody.appendChild(row);
        });
     } catch (error) {
        console.error("Error fetching expenses:", error);
     }
  }








 
});





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



const  rz1=document.getElementById("rzp-button1").onclick = async function (e) {
   console.log("waiting");
   e.preventDefault();
   const authenticatedAxios = await authentication();

   try {

       

       const response = await authenticatedAxios.get("/premiummembership");
       console.log(response);

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
                  
                   alert("Congratulations You are now Premium meember")
                   document.getElementById("rzp-button1").style.display="none"
                   
                   document.getElementById("massage").innerHTML="Prime member"
                   localStorage.setItem("token",res.data.token)
                   


               } catch (error) {
                   console.log(error);
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


