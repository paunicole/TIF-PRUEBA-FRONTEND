// modal server
const add= document.getElementById("add");
const modalServer = document.querySelector('#modalServer');
const clos=document.getElementById('btonS');

clos.addEventListener('click', () => {
        modalServer.style.display="none";
        
    });

add.addEventListener("click",(event)=>{
  event.preventDefault();
  modalServer.style.display = 'block';
  
});
// modal user
const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');

open.addEventListener('click', () => {
  modal_container.classList.add('show');  
});

close.addEventListener('click', () => {
  modal_container.classList.remove('show');
});

// modal canal
const btm=document.getElementById("newcanal")
const modal_conta = document.getElementById('modalCanal');
const cv =document.getElementById('btonC');

cv.addEventListener('click', () => {
    //   modal_container.classList.add('show'); 
        modal_conta.style.display="none";
        
    });


btm.addEventListener('click', () => {
//   modal_container.classList.add('show'); 
    modal_conta.style.display="block";
    
});

// chat
let input= document.getElementById("input")
let boton= document.getElementById("bton")

let ul= document.getElementById("text")
let conteiner= document.getElementsByClassName("conteinerChat")
let div=document.getElementById("chat")


boton.addEventListener("click", () => {
    const mensaje = input.value.trim();

      if (mensaje !== "") {
        let element= document.createElement("li")
    element.innerHTML+=input.value
    element.setAttribute("id","item")
    // lo agregamos como hijo y comienza a tomar los valor que tiene li
    // en la hoja de estilos
    ul.appendChild(element)
    console.log(input.value)
    input.value=""
      }
});

input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        boton.click();
      }
});

// conteiner.appendChild(div)
document.body.appendChild(conteiner)

