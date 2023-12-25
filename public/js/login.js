const form = document.getElementById("form");
const Smessage=document.getElementById("success");
    const Emessage=document.getElementById("error");
    const allmessage=document.getElementById("emailNotPresent")


form.addEventListener("submit", login);

async function login(e) {
    e.preventDefault();
    try {
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
        };
        const response = await axios.post("/login", data);

        if (response.status === 200) {
            
            localStorage.setItem("token", JSON.stringify({ name:response.data.name,token: response.data.token }));
            Smessage.classList.add("success")
        setTimeout(()=> {Smessage.classList.remove("success")
        window.location.href="/dashboard"
    },1000)
        }
    } catch (error) {
        if (error.response.status === 404) {
            allmessage.classList.add("danger")
      setTimeout(()=>{
          allmessage.classList.remove("danger")
      },2000)
        } else if (error.response.status === 401) {
           Emessage.classList.add("danger")
        setTimeout(()=>{
            Emessage.classList.remove("danger")
        },3000)
        } else {
            console.error(error);
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

