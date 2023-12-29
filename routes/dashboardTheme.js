const togglebtn=document.getElementById("toggle")
const nav =document.querySelector(".nav")
const hero =document.querySelector(".hero")
const labels =document.querySelectorAll(".label")
const page=document.querySelector(".pagination-container")
togglebtn.addEventListener("click",()=>{
    togglebtn.classList.toggle("ri-xrp-fill")
   nav.classList.toggle("active")
      
  })
  
  const theme=document.getElementById("theme")
  console.log(theme)
  theme.addEventListener("click",()=>{

    theme.classList.toggle("ri-sun-fill")
    theme.classList.toggle("light")
    nav.classList.toggle("nav-dark")
    hero.classList.toggle("hero-dark")
   
    page.classList.toggle("pagedark")
    labels.forEach(label => {
                label.classList.toggle("light");
            });

  })