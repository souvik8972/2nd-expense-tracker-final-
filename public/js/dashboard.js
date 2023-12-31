

function authentication() {
   const tokenData = JSON.parse(localStorage.getItem('token'));
   // console.log('Token Data:', tokenData);

   let token;

   if (tokenData) {
      if (typeof tokenData === 'object') {
         token = tokenData.token;
      } else {
         // If tokenData is not an object, assume it's the actual token value
         token = tokenData;
      }

      // console.log(token, "ttttt");

      // Return the authenticated axios instance
      const authaxis = axios.create({
         // baseURL: 'http://localhost:8080',
         headers: {
            'Authorization': `Bearer ${token}`,
         },
      });

      return authaxis;
   } else {
      window.location.href = "/login";
      alert("Please log in first");
      
   }
}


////////////////////////////////////////////////////////////////
const authenticatedAxios = authentication();
const expenseForm = document.getElementById("form");
expenseForm.addEventListener("submit", addExpense);
const expenseTableBody = document.getElementById("expenseTableBody")
expenseTableBody.addEventListener("click",deleteExpense)
document.getElementById("logout").addEventListener("click",logout)
const togglebtn=document.getElementById("toggle")
const body=document.body
const nav =document.querySelector(".nav")
let page=1


//toggle nav////////////////////////////////
togglebtn.addEventListener("click",()=>{
   togglebtn.classList.toggle("ri-xrp-fill")
  nav.classList.toggle("active")
     
 })


document.addEventListener("DOMContentLoaded", function () {



   const token=localStorage.getItem('token');
   // console.log("tokrnnnnn",token)
   const check =parseJwt(token) 
 if(check.ispremiumuser){
    document.getElementById("rzp-button1").style.display="none"
  document.getElementById("massage").innerHTML="Prime member"

 }
 showpage()
fetchExpenses();

 
});
//add Expense //////////////////////////////////////////////////////////////////

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
      // Refresh 
      fetchExpenses();
      alert("data added successfully")
      
   
   } catch (error) {
      console.error("Error adding expense:", error);
   }
}





//delete expense////////////////////////////////
async function deleteExpense(e) {
   try {
      const id=e.target.id;
      const response = await authenticatedAxios.get(`/deleteExpense/${id}`);
      // Refresh the expenses after deletion
     
      fetchExpenses();
      console.log("Expense deleted successfully");

      
   } catch (error) {
      console.error("Error deleting expense:", error);
   }
}


//logout //////////////////////////////////////////////////////////////////
function logout(){
   localStorage.removeItem("token")
   window.location.href = "/";
   
}



//decode jwt token//////////////////////////////////////////////////////////////////
function parseJwt (token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));

   return JSON.parse(jsonPayload);
}


//purchas Prime////////////////////////////////
const  rz1=document.getElementById("rzp-button1").onclick = async function (e) {
   // console.log("waiting");
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
                   
                   localStorage.setItem("token",JSON.stringify(res.data.token))
                   
                  // console.log(localStorage.getItem("token"))
                   alert("Congratulations You are now Premium member ")
                   document.getElementById("rzp-button1").style.display="none"
                   document.getElementById("massage").innerHTML="Prime member"
                   
                 
             
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


 
 
//show leaderboard //////////////////////////////////////////////////////////////////

async function showLeaderboard(){
   const leaderboardBtn=document.getElementById("leaderboard")
  
   leaderboardBtn.style.display="block"

leaderboardBtn.addEventListener("click",showingLeaderboard)

}
async function showingLeaderboard(){

   try {
      const leaderboard=document.getElementById("leaderboard1")
      leaderboard.style.display="block"
      const toke=localStorage.getItem('token');
      const check =parseJwt(toke)
      if(check.ispremiumuser) { const response=await authenticatedAxios.get("premium/leaderboard")
      const data=response.data

const leaderboardTableBody=document.getElementById("leaderboardTableBody")
leaderboardTableBody.innerHTML=""
      data.forEach(userData=>{
const row =document.createElement("tr")
row.innerHTML=`           
<td>${userData.name}</td>
<td>${userData.totalExpense}</td>

`;
// console.log(userData.name,userData.totalExpense)
leaderboardTableBody.appendChild(row)   })}
else(
   alert("please buy a subscription")
)
    
   } catch (error) {
      console.log(error)

}}




//report //////////////////////////////////////////////////////////////////
function report(){

   const repotbtn = document.getElementById("report");
   
   repotbtn.addEventListener("click", async () => {
      try {
         const toke=localStorage.getItem('token');
         const authenticatedAxios = authentication();
   const check =parseJwt(toke) 
   if (check.ispremiumuser){
      const response = await authenticatedAxios.get("premium/report");
      // console.log(response.data);
      window.location.href='/premium/reports'}
      else{
         alert("please buy a subscription")
      }
         
         // Handle the response or redirect to the report page
      } catch (error) {
         console.error("Error fetching report:", error);
      }
   });
   }
   


report()
 showLeaderboard()




   //download report////////////////////////////////////////////////////////////////

   async function download(){
      try {
         const linkdiv=document.getElementById("downloadexpense")
         const response = await authenticatedAxios.get("/download");
         if(response){
            const link=response.data.fileURL
            console.log(response.data.fileURL)
            const linkElement = document.createElement("a");
            linkElement.href = link
           linkElement.download = "Expense.txt"
            linkElement.click()
            linkdiv.appendChild(linkElement);
         }
         
        } catch (error) {
         
        }
   

   }


//get Expenses////////////////////////////////
async function fetchExpenses() {

   try {
      
     
      const authenticatedAxios = authentication();
      const limit=parseInt(limitBtn.value)
      const response = await authenticatedAxios.get(`/getExpenses?page=${page}&limit=${limit}`);
      const expenses = response.data.userexpense;
      console.log(response.data)
      const totalshow=document.getElementById("total")

      // Update the table with fetched expenses
      const expenseTableBody = document.getElementById("expenseTableBody");
      expenseTableBody.innerHTML = "";
    let total=response.data.total.totalExpense
      expenses.forEach(expense => {
       
         const row = document.createElement("tr");
         row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.pmethod}</td>
            <td>${expense.amount}<span> Rs.</span></td>
            <td>${expense.date}</td>
          <td><button class="deletebtn" id="${expense.id}">x</button></td>
         `;
         expenseTableBody.appendChild(row);
      }
      
      
      );
      showpage()
      totalshow.innerHTML=`total: ${total}<span> Rs.</span>`
   } catch (error) {
      console.error("Error fetching expenses:", error);
   }
}






const limitBtn=document.getElementById("limit");

limitBtn.addEventListener("change",(e)=>{
   page=1
   fetchExpenses()
   showpage()
})

   async function showpage(){
    
     try {
      const limit=parseInt(limitBtn.value)
       const response = await authenticatedAxios.get(`/getExpenses?page=${page}&limit=${limit}`);
      console.log(response.data.totalpages)
      button=""
      for (let i=1; i<response.data.totalpages+1;i++){
         button+=` <li class="pbutton"><a onclick=pagenum(${i}) href=javascript:void(0)">${i}</a></li>`}


      document.getElementById("pagination").innerHTML=button 

     } catch (error) {
      console.log(error)
      
     }

   }


   

   //page number
   function pagenum (index){
      const pageno=document.getElementById("pageno")
      pageno.innerHTML=`page:${index}`
      page=parseInt(index)
      fetchExpenses()

   }
  



  //dark mode
   const hero =document.querySelector(".hero")
   const labels =document.querySelectorAll(".label")
   const page1=document.querySelector(".pagination-container")
   const massage=document.querySelector("#massage")
   const bodyy=document.body
   const header=document.querySelector(".header")
  
     const theme=document.getElementById("theme")
     console.log(theme)
     theme.addEventListener("click",()=>{
   
       theme.classList.toggle("ri-sun-fill")
       theme.classList.toggle("light")
       nav.classList.toggle("nav-dark")
       hero.classList.toggle("hero-dark")
       massage.classList.toggle("light")
       bodyy.classList.toggle("darkbody")
       header.classList.toggle("headerdark")
       
       page1.classList.toggle("pagedark")
       labels.forEach(label => {
                   label.classList.toggle("light");
               });
   
     })  
     