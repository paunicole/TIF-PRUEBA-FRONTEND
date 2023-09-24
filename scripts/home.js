window.addEventListener('load', function () {
    getProfile();
});

function getProfile() {
    const url = "http://127.0.0.1:5000/users/profile";
    
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                // Mostrar la imagen de avatar
                // if( data.avatar!==""){
                let avatarLink=`../assets/${data.avatar}`;
                const iconUser=document.getElementById("iconUser");
                iconUser.src=avatarLink;             
                document.getElementById("UserName").innerText = data.username;
            });
        } else {
            return response.json().then(data => {
                document.getElementById("message").innerHTML = data.message;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}


let serverBox = document.querySelector(".serverBox");

let catchServers = () => {
    fetch("http://127.0.0.1:5000/servers/") //Extraer datos
    .then(res => res.json())
    .then(async data => {                   // 'data' contendrá los datos JSON obtenidos del servidor.
        if (data.length === 0) {
            // No se encontraron servidores, muestra un mensaje
            const noServersMessage = document.createElement("p");
            noServersMessage.textContent = "No se encontraron servidores.";
            serverBox.appendChild(noServersMessage);
        } else {
            for (let server of data) {  // iteramos los servidores
                // Crear elemento de texto para el nombre del servidor
                let serverText = document.createElement("a");
                serverText.classList.add("serverText");
                serverText.setAttribute("href", `home.html?server_id=${server.server_id}`);
                serverText.setAttribute("data-server-id", server.server_id);
                serverText.textContent = server.name;
                
                // Añadir elementos
                serverText.appendChild(document.createElement("br"));
                serverBox.appendChild(serverText);
            }
        }

    })
    .catch(err => console.log(err));
};

catchServers();

// ======================== MODALES =========================
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

// // modal user
// const open = document.getElementById('open');
// const modal_container = document.getElementById('modal_container');
// const close = document.getElementById('close');

// open.addEventListener('click', () => {
//   modal_container.classList.add('show');  
// });

// close.addEventListener('click', () => {
//   modal_container.classList.remove('show');
// });

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

// ====================== CHAT ============================
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

