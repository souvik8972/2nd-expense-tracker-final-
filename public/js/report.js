
function authentication() {
   const tokenData = JSON.parse(localStorage.getItem('token'));
   console.log('Token Data:', tokenData);

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
       
         headers: {
            'Authorization': `Bearer ${token}`,
         },
      });

      return authaxis;
   } else {
      alert("Please log in first");
      window.location.href = "/login";
   }
}

////////////////////////////////////////////////////////////////
const authenticatedAxios = authentication();
 const togglebtn=document.getElementById("toggle")
 document.getElementById("logout").addEventListener("click",logout)
 const nav =document.querySelector(".nav")
 //toggle nav////////////////////////////////
togglebtn.addEventListener("click",()=>{
    togglebtn.classList.toggle("ri-xrp-fill")
   nav.classList.toggle("active")
      
  })
 
  function logout(){
    localStorage.removeItem("token")
    window.location.href = "/";
    
 }
 
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
      //  console.log(response.data);
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
    async function getExpenseReport() {
       const yearInput = document.getElementById('year');
       const year = yearInput.value;
      //  console.log(year)
    
       if (!year) {
           alert('Please enter a year');
           return;
       }
    
       try {
           const response = await authenticatedAxios.get(`/premium/report?year=${year}`);
         //   console.log(response.data)
           displayReport(response.data);
       } catch (error) {
           console.error('Error fetching expense report:', error);
           alert('Error fetching expense report. Please check the console for details.');
       }
    }
    
 
    
    //display report////////////////////////////////////////////////////////////////
    function displayReport(data) {
       const reportResult = document.getElementById('reportTable');
       reportResult.innerHTML = '';
    
       if (data.length === 0) {
           reportResult.innerHTML = 'No expenses found for the specified year.';
           return;
       }
    
       data.forEach(expense => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td>${expense.date}</td>
             <td>${expense.category}</td>
             <td>${expense.pmethod}</td>
             <td>${expense.amount}<span> Rs.</span></td>
             
          
          `;
          reportResult.appendChild(row);
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
 