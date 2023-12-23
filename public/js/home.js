const togglebtn=document.getElementById("toggle")
const body=document.body
const option=document.getElementsByClassName("option")[0];
togglebtn.addEventListener("click",()=>{
  togglebtn.classList.toggle("ri-xrp-fill")
 
    option.classList.toggle("active");
})
