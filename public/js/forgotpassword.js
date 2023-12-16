const form = document.getElementById("form");
form.addEventListener("submit",async (e)=>{
    e.preventDefault();
  try {
    const email=document.getElementById("email")
    const data={
        email: email.value
    }
    const response=await axios.post("http://localhost:8080/forgot-password",data) 
if (response.status==200){
    alert("link sent successfully please check your mail..")
}
    
  } catch (error) {
    console.log(error)
    alert("error")}
   
})