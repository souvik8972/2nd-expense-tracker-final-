const form = document.getElementById("form");
form.addEventListener("submit", onSignup);

async function onSignup(e) {
    const Smessage=document.getElementById("success");
    const Emessage=document.getElementById("error")
  try {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm_password = e.target.confirm_password.value;

    if (password !== confirm_password) {
        
        Emessage.classList.add("danger")
        setTimeout(()=>{
            Emessage.classList.remove("danger")
        },3000)
    }else{

        const data={
            name,
            email,
            password
        }
        const response=await axios.post("/signup",data)
        Smessage.classList.add("success")
        setTimeout(()=> {Smessage.classList.remove("success")
        window.location.href="/login"
    },1000)
        

    }

    

  } catch (error) {
    if(error.response.status===401){
      e.preventDefault()
      const allmessage=document.getElementById("emailAlreadyPresent")
      allmessage.classList.add("danger")
      setTimeout(()=>{
          allmessage.classList.remove("danger")
      },2000)

    }
    else{
      console.log("error")
    }
  }
}
const togglebtn=document.getElementById("toggle")
const body=document.body
const option=document.getElementsByClassName("option")[0];
togglebtn.addEventListener("click",()=>{
  togglebtn.classList.toggle("ri-xrp-fill")
 
    option.classList.toggle("active");
})
