// ======================== MOSTRAR MI PERFIL ========================

window.addEventListener('load', function () {
    getProfile();
});

console.log("holaaa channel")

function getProfile() {
    const url = "http://127.0.0.1:5000/users/profile";
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
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
                // console.data("home,",data)         
                document.getElementById("UserName").innerText = data.username;
                // console.data("home,",data)  
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

// ======================== MOSTRAR SERVIDORES DE UN USUARIO ========================

let serverBox = document.querySelector(".serverBox");
let serverBtnAdd = document.querySelector(".btonAddServer");
const notServer = document.getElementById('empty');

// CARGA DE SERVIDORES
let catchServers = () => {
    
    let url = `http://127.0.0.1:5000/servers/serversuser`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Importante estar por las sesiones
    })
    .then(res => res.json())
    .then(async data => {
        if (data.length === 0) {

            // No se encontraron servidores, muestra un mensaje
            //const noServersMessage = document.createElement("p");
            //noServersMessage.classList.add("noServers");
            //noServersMessage.textContent = "No se encontraron servidores.";
            //serverBox.appendChild(noServersMessage);
            
            // Muestro mensaje en la 3° columna
            notServer.style.display = 'block'; 
        } else {

            // Oculto mensaje en la 3° columna
            notServer.style.display = 'none'; 
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

        serverBtnAdd.addEventListener("click", () => addServer());
    })
    .catch(err => console.log(err));
};

catchServers();

// ======================== INSERTAR UN NUEVO SERVIDOR A LA BASE DE DATOS ========================

let addServer = () => {
    
    // Obtener el elemento input por su id
    var inputNameS = document.getElementById("nameS");
    var inputDescriptionS = document.getElementById("descriptionS");

     // Obtener el valor del input
    var valorNameS = inputNameS.value;
    var valorDescriptionS = inputDescriptionS.value;

    let server = {
        name: valorNameS,
        description: valorDescriptionS,
    };

    fetch("http://127.0.0.1:5000/servers/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(server),
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        location.reload();
    })
    .catch(err => console.log(err));
}


// ====================================== EXPLORAR SERVIDORES =====================================

const serverExplore = document.getElementById('explore');
let serverExploreBox = document.querySelector(".serverExploreBox");
let containerChannel = document.getElementById('.conteinerCanales');
let containerChat = document.getElementById('.conteinerChat');

let serversCargados = false;
let visible = false;

serverExplore.addEventListener('click', () => {
    if (!serversCargados) { //Si los servidores aun no están cargdados, los cargo
        addServersExplore();
        serversCargados = true;
    }
    if(visible){
        serverExploreBox.style.display = 'none';
        notServer.style.display = 'block';
    } else{
        serverExploreBox.style.display = 'grid';
    }
    visible = !visible;
});

function addServersExplore() {
    fetch('http://127.0.0.1:5000/servers', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(async data => {

        for (let server of data) {
            //Ocultar mensaje de unirse a un servidor
            notServer.style.display = 'none';

            // Crear elemento p para el nombre del servidor
            let serverExploreText = document.createElement("a");
            serverExploreText.classList.add("serverExploreText");
            serverExploreText.textContent = server.name;
            serverExploreBox.appendChild(serverExploreText);
        }
    })
    .catch(err => console.log(err));
};

// ======================== MODALES =========================

// MODAL Server
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

// MODAL Channel
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
// document.body.appendChild(conteiner)

