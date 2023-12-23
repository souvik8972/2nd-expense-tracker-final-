togglebtn.addEventListener("click",()=>{
    togglebtn.classList.toggle("ri-xrp-fill")
   nav.classList.toggle("active")
      
  })
  
 
  function authentication() {
    const tokenData = JSON.parse(localStorage.getItem('token'));
    console.log('Token Data:', tokenData);
 
    if (tokenData) {
       const { token } = tokenData;
 
       // Return the authenticated axios instance
       const authaxis =  axios.create({
          baseURL: 'http://localhost:8080',
          headers: {
             'Authorization': `Bearer ${token}`,
             
          },
       });
 
       return authaxis;
    } else {
       alert("Please log in first");
       window.location.href = "http://localhost:8080/login";
    }
 }


 const authenticatedAxios = authentication();
//show leaderboard //////////////////////////////////////////////////////////////////

// async function showLeaderboard(){
//     const leaderboardBtn=document.getElementById("leaderboard")
//     leaderboardBtn.style.display="block"
//  leaderboardBtn.addEventListener("click",showingLeaderboard)
 
//  }
 showLeaderboard()
 async function showingLeaderboard(){
 
    try {
       const toke=localStorage.getItem('token');
       const check =parseJwt(toke)
       if(check.ispremiumuser) { const response=await authenticatedAxios.get("premium/leaderboard")
       const data=response.data
 console.log(data)
 const leaderboardTableBody=document.getElementById("leaderboardTableBody")
 leaderboardTableBody.innerHTML=""
       data.forEach(userData=>{
 const row =document.createElement("tr")
 row.innerHTML=`           
 <td>${userData.name}</td>
 <td id="totalrs">${userData.totalExpense}  </td>
 
 `;
 
 leaderboardTableBody.appendChild(row)   })}
 else(
    alert("please buy a subscription")
 )
     
    } catch (error) {
       console.log(error)
 
 }}
 