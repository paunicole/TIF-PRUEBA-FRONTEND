// ======================== MOSTRAR MI PERFIL ========================

window.addEventListener('load', function () {
    catchServers();
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
let chatBox = document.querySelector(".chatBox");
let serverBtnAdd = document.querySelector(".btonAddServer");
const notServer = document.getElementById('empty');

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
                //serverText.setAttribute("href", `home.html?server_id=${server.server_id}`);
                serverText.setAttribute("data-server-id", server.server_id);
                serverText.textContent = server.name;
                
                // Añadir elementos
                serverText.appendChild(document.createElement("br"));
                serverBox.appendChild(serverText);

                if (!serverText.hasEventListeners) {
                    console.log("ENTROOO AL IF DE SERVERS")
                    serverText.addEventListener('click', function(event) {
                        chatBox.innerHTML = ''
                        catchChannels(server.server_id);
                        console.log("CLICK EN", server.server_id)
                    });
                    serverText.hasEventListeners = true; // Marcar que se agregó el evento
                }

            }
        }

        serverBtnAdd.addEventListener("click", () => addServer());
    })
    .catch(err => console.log(err));
};

// ======================== MOSTRAR CANALES ========================
let channelBox = document.querySelector(".channelBox");
let channelBtnAdd = document.querySelector(".btonAddChannel");

let catchChannels = (serverID) => {
    let url = `http://127.0.0.1:5000/channels/${serverID}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            console.log("NO HAY CANALES EN ", serverID)
            // Si no hay canales, muestra un mensaje de advertencia
            channelBox.innerHTML = ''
            const noChannelsMessage = document.createElement("p");
            noChannelsMessage.classList.add("noChannels");
            noChannelsMessage.textContent = "Aún no hay canales en este servidor";
            channelBox.appendChild(noChannelsMessage);
        } else {
            console.log("SI HAY CANALES EN ", serverID)
            channelBox.innerHTML = ''

            // Si hay canales, crea contenedores para cada uno
            data.map(channel => {
                createChannelContainer(channel);
            });
        }

        channelBtnAdd.addEventListener("click", () => addChannel(serverID));
    })

    .catch(err => console.log(err));
};

let canalSeleccionado;

let createChannelContainer = (channel) =>{

    // Crear elemento de texto para el nombre del canal
    let channelText = document.createElement("a");
    channelText.classList.add("channelText");

    //channelText.setAttribute("href", `home.html?server_id=${serverID}&channel_id=${channel.channel_id}`);
    channelText.setAttribute("data-channel-id", channel.channel_id);

    let channel_hashtag = `#${channel.name}`;
    channelText.textContent = channel_hashtag;

    // Añadir elementos
    channelText.appendChild(document.createElement("br"));
    channelBox.appendChild(channelText);

    if (!channelText.hasEventListeners) {
        channelText.addEventListener('click', function(event) {
            notServer.style.display = 'none';
            canalSeleccionado = channel.channel_id;
            console.log("CANAL SELECCIONADO:", channel.channel_id)
            catchChats(channel.channel_id);
        });
        channelText.hasEventListeners = true; // Marcar que se agregó el evento
    }
}

let addChannel = (serverID) => {
    console.log("CLICK EN AGREGAR CANAL AL SERVIDOR: ", serverID)

    // Obtener el elemento input por su id
    var inputNameC = document.getElementById("nameC");
    var inputDescriptionC = document.getElementById("descriptionC");

     // Obtener el valor del input
    var valorNameC = inputNameC.value;
    var valorDescriptionC = inputDescriptionC.value;

    console.log(valorNameC)
    console.log(valorDescriptionC)

    let channel = {
        name: valorNameC,
        description: valorDescriptionC,
        server_id: serverID
    };

    fetch("http://127.0.0.1:5000/channels/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(channel)
    })
    .then(res => res.json())
    .then(data => {
        location.reload();
    })
    .catch(err => console.log(err));
}

// ======================== CHAT ====================



let catchChats = (channelID) => {
    console.log("LLEGÓ A CATCHCHATS. Canal:", channelID)
    let url = `http://127.0.0.1:5000/messages/?channel_id=${channelID}`;
    fetch(url, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            console.log("NO HAY MENSAJES")
            chatBox.innerHTML = ''

            // Si no hay mensajes, muestra un mensaje de advertencia
            const noMessagesMessage = document.createElement("p");
            noMessagesMessage.classList.add("noMessages");
            noMessagesMessage.textContent = "Aún no hay mensajes en este canal";
            chatBox.appendChild(noMessagesMessage);
        } else {
            console.log("SI HAY MENSAJES")
            chatBox.innerHTML = ''

            // Si hay mensajes, crea contenedores para cada uno
            data.map(chat => {
                createChatContainer(chat);
            });
        }
    })
    .catch(err => console.log(err));
};

let createChatContainer = (chat) =>{
    // Crear elemento img para el avatar del usuario
    let chatAvatar = document.createElement("img");
    chatAvatar.classList.add("chatAvatar");
    let formattedAvatar = `/assets/${chat.user_id["avatar"]}`;
    chatAvatar.src = formattedAvatar;
    chatAvatar.alt = "Avatar";
    
    // Crear elemento de texto span para el nombre de usuario
    let chatUser = document.createElement("span");
    chatUser.classList.add("chatUsername");
    chatUser.textContent = chat.user_id["username"];
    
    // Crear elemento de texto span para la fecha
    let chatDate = document.createElement("span");
    chatDate.classList.add("chatDate");
    let originalDate = new Date(chat.date_time); // Convertir la fecha de texto a objeto Date 
    let day = originalDate.getDate();            // Obtener el día del mes
    let month = originalDate.getMonth();         // Obtener el mes
    let year = originalDate.getFullYear();       // Obtener el año
    let hours = originalDate.getHours().toString().padStart(2, '0');         // Obtener la hora
    let minutes = originalDate.getMinutes().toString().padStart(2, '0');     // Obtener los minutos
    let formattedDate = `${day}/${month + 1}/${year} ${hours}:${minutes}`;
    chatDate.textContent = formattedDate;

    // Crear elemento de texto p para el mensaje
    let chatText = document.createElement("p");
    chatText.classList.add("chatText");
    chatText.textContent = chat.message;

    // Añadir elementos
    chatBox.appendChild(chatAvatar);
    chatBox.appendChild(chatUser);
    chatBox.appendChild(chatDate);
    chatBox.appendChild(chatText);
    chatText.setAttribute("data-chat-id", chat.message_id);
}

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

