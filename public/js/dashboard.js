

function authentication() {
  const tokenData = JSON.parse(localStorage.getItem('token'));

  if (tokenData) {
    const { token, name } = tokenData;
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

//   async function razorpayFun(e) {
  

//    try {
//        const response = await authenticatedAxios.get("/premiummembership");
//        console.log("Response from /primemembership:", response.data);

//        const { name, email } = response.data;

//        var options = {
//            "key": response.data.key_id,
//            "order_id": response.data.order_id,
//            "handler": async function (response) {
//                await authenticatedAxios.post("/updatetransactionstatus", {
//                    order_id: options.order_id,
//                    payment_id: response.razorpay_payment_id
//                });
//                alert("YOHOOO");
//            }
//        }

//        var rzp1 = new Razorpay(options);
//        rzp1.open();

//        e.preventDefault();

//        rzp1.on("payment_failed", (response) => {
//            console.log(response);
//            alert("payment_failed");
//        });
//    } catch (error) {
//        console.error("Error in razorpayFun:", error);
//    }
// }





 
});
document.getElementById("logout").addEventListener("click",logout)
function logout(){
   localStorage.removeItem("token")
   window.location.href = "http://localhost:8080";
   
}


// document.getElementById("rzp-button1").onclick =async function(e){
//    try {
//       console.log("clicked")
//       const authaxios=await authentication()
//       const response=await authaxios.get("/premiummembership")
//       console.log(response)
//       var options={
//          "key":response.data.key_id,
//          "order_id":response.data.order_id,
//          "handler":async function(response){
//             await axios.post("/updatetransactionstatus",{
//                order_id:options.order_id,
//                payment_id:response.data.payment_id
//             })
//             alert("Yoho primemember successfully")
//          }
//       }
//       const rzp1=new Razorpay(options)
//       rzp1.open()
//       e.preventDefault()
// rzp1.on("payment.field",(response)=>{
//    alert("nehi hua paisa dal re")
// })
     

//    } catch (error) {
      
//    }
// }




// async function purchasepremium() {

//    try {
//        const authenticatedAxios=authentication();
//        const response = await authenticatedAxios.get("/premiummembership");
//        console.log("1")
//        const { key_id, order_id } = response.data;
//        const { name, email } = response.data.user;
//        var options = {
//            "key": key_id,
//            "order_id": order_id,
//            "description": "expense tracker",
//            "handler": async function (response) {
//                const premiumstatus = await authenticatedAxios.put("purchase/updatetransactionstatus", {
//                    order_id: response.razorpay_order_id,
//                    payment_id: response.razorpay_payment_id
//                });
//                alert(premiumstatus.data.message);
//                window.location.href = "user";
//            },
//            "prefill": {
//                "name": name,
//                "email": email
//            },
//            "notes": {
//                "address": "souvik Pvt.ltd Corporate Office"
//            },
//        };
//        var rzp1 = new Razorpay(options);
//        rzp1.on('payment.failed', function (response) {
//            console.log(response);
//            alert('Something went wrong Transaction failed');

//        });
//        document.getElementById('rzp-button1').onclick = function (e) {
//            rzp1.open();
//            e.preventDefault();
//        }
//    } catch (error) {
//        console.log(error);
//    }
// }



document.getElementById("rzp-button1").onclick = async function (e) {
   console.log("waiting");
   e.preventDefault();
   const authenticatedAxios = authentication();

   try {
       const storedTokenWithBearer = localStorage.getItem("token");
       const token = storedTokenWithBearer.substring("Bearer ".length);

       const response = await authenticatedAxios.post("/premiummembership");
       console.log(response);

       var options = {
           key: response.data.key_id, 
           order_id: response.data.order_id,
           handler: async function (response) {
               try {
                   // Use options.order_id outside the options object
                   await authenticatedAxios.post("/updatetransactionstatus", {
                       order_id: options.order_id,
                       payment_id: response.razorpay_payment_id,
                   });
               } catch (error) {
                   console.log(error);
               }
           },
       };

       const rzp1 = new Razorpay(options);
       rzp1.open();
       e.preventDefault();

       rzp1.on("payment.failed", (response, err) => {
           alert("failed");
           console.log(response);
       });
   } catch (error) {
       console.log(error);
   }
};

