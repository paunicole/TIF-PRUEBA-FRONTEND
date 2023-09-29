window.addEventListener('load', function () {
    getProfile();
    catchServers();
});

// =========================== MOSTRAR MI PERFIL ===========================

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
                let avatarLink = `../assets/${data.avatar}`;
                const iconUser = document.getElementById("iconUser");
                iconUser.src = avatarLink;            
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

// ======================== MOSTRAR SERVIDORES DE UN USUARIO ========================

let serverBox = document.querySelector(".serverBox");
let chatBox = document.querySelector(".chatBox");
let containerChat = document.getElementById('.conteinerChat');
let serverBtnAdd = document.querySelector(".btonAddServer");
const notServer = document.getElementById('empty');
let inputMessage = document.querySelector(".inputMessage");

inputMessage.style.display = 'none';
notServer.style.display = 'none';

let catchServers = () => {
    
    let url = `http://127.0.0.1:5000/servers/serversuser`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then(res => res.json())
    .then(async data => {
        if (data.length === 0) {
            notServer.style.display = 'block';

        } else {

            // Oculto mensaje en la 3° columna
            notServer.style.display = 'none';
            
            for (let server of data) {  // iteramos los servidores
                
                // Crear elemento de texto para el nombre del servidor
                let serverText = document.createElement("a");
                serverText.classList.add("serverText");

                serverText.setAttribute("data-server-id", server.server_id);
                serverText.textContent = server.name;
                
                // Añadir elementos
                serverText.appendChild(document.createElement("br"));
                serverBox.appendChild(serverText);

                if (!serverText.hasEventListeners) {
                    console.log("ENTROOO AL IF DE SERVERS")
                    serverText.addEventListener('click', function(event) {
                        chatBox.innerHTML = ''              // Borro el chat
                        inputMessage.style.display = 'none' // Oculto el input de message
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
let messageBtnAdd = document.querySelector(".btonAddMessage");
let canalSeleccionado;

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

            // Si no hay canales, muestra un mensaje de advertencia
            channelBox.innerHTML = ''
            const noChannelsMessage = document.createElement("p");
            noChannelsMessage.classList.add("noChannels");
            noChannelsMessage.textContent = "Aún no hay canales en este servidor";
            channelBox.appendChild(noChannelsMessage);
        } else {

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

// ======================== MOSTRAR EL CHAT ====================

let catchChats = (channelID) => {
    let url = `http://127.0.0.1:5000/messages/?channel_id=${channelID}`;
    fetch(url, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            
            chatBox.innerHTML = ''
            
            // Si no hay mensajes, muestra un mensaje de advertencia
            const noMessagesMessage = document.createElement("p");
            noMessagesMessage.classList.add("noMessages");
            noMessagesMessage.textContent = "Aún no hay mensajes en este canal";
            chatBox.appendChild(noMessagesMessage);  
        
        } else {
            chatBox.innerHTML = ''

            // Si hay mensajes, crea contenedores para cada uno
            data.map(chat => {
                createChatContainer(chat);
            });
        }
        inputMessage.style.display = 'block'
        messageBtnAdd.addEventListener("click", () => addMessage(canalSeleccionado));
    })
    .catch(err => console.log(err));
};

let createChatContainer = (chat) =>{

    let cont = document.createElement("div");
    cont.classList.add("contMessage");
    cont.setAttribute("data-chat-id", chat.message_id);//message_id

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
    chatText.textContent = chat.message;

    // Añadir elementos
    cont.appendChild(chatAvatar);
    cont.appendChild(chatUser);
    cont.appendChild(chatDate);
    cont.appendChild(document.createElement("br"));
    cont.appendChild(document.createElement("br"));
    cont.appendChild(chatText);
    chatBox.appendChild(cont);
    modalM(cont)
}
var idMessage;
// ======================== AGREGAR NUEVO MENSAJE ====================
function modalM(chatText){
    //editar o eliminar mensaje

    chatText.addEventListener("click",()=>{
        //traemos es valor (que eria el id del message)
        idMessage=chatText.getAttribute("data-chat-id")
        console.log(" atributo data-chat-id-->",idMessage)
        let mMensaje= document.getElementById("modalDeleteMessage")
        mMensaje.style.display="flex"
        //salir del modal
        document.getElementById("xClose").addEventListener("click",()=>{
            mMensaje.style.display="none"
        });
        
        //eliminar mensaje
        document.getElementById("deleteMessage").addEventListener("click", ()=>{
            eliminarMensaje(mMensaje)

        });

        //editar mensaje
        document.getElementById("ChangeMessage").addEventListener("click", ()=>{
            editarMensaje(mMensaje)

        });

    });
}


// ======================== AGREGAR NUEVO MENSAJE ====================


let addMessage = (channelID) => {

    // Obtener el el elemento input por su id
    var inputMessage = document.getElementById("input");

     // Obtener el valor del input
    var valorMessage = inputMessage.value;

    if (valorMessage.trim() === "") {
        return;
    }

    console.log(valorMessage)
    console.log(channelID)

    let message = {
        message: valorMessage,
        channel_id: channelID
    };

    fetch("http://127.0.0.1:5000/messages/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message),
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        location.reload();
    })
    .catch(err => console.log(err));
}


// ======================== CREAR UN NUEVO SERVIDOR ========================

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


// ======================== INSERTAR UN NUEVO SERVIDOR DESDE EL EXPLORER ========================

let addServerExplore = (serverID) => {
    console.log("VINO POR ADD SERVER");
    let server = {
         server_id: serverID
    };
    console.log(serverID);
    fetch("http://127.0.0.1:5000/servers/explore", {
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

let serversCargados = false;
let visible = false;

serverExplore.addEventListener('click', () => {
    if (!serversCargados) { //Si los servidores aun no están cargdados, los cargo
        showServersExplore();
        serversCargados = true;
    }
    if(visible){
        serverExploreBox.style.display = 'none';
    } else{
        serverExploreBox.style.display = 'grid';
    }
    visible = !visible;
});

const getServersCount = async (serverId) => {
    let url = `http://127.0.0.1:5000/servers/count/${serverId}`;
    const res = await fetch(url, {
         method: 'GET',
         credentials: 'include'
    })
    const data = await res.json();
    return data.count;
    
};

function showServersExplore() {
    fetch('http://127.0.0.1:5000/servers', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(async data => {
        //Ocultar contenedores
        notServer.style.display = 'none';
        chatBox.style.display = 'none';
        inputMessage.style.display = 'none';

        for (let server of data) {

            // Crear elemento p para el nombre del servidor
            let serverExploreText = document.createElement("a");
            serverExploreText.classList.add("categoryText");
            serverExploreText.textContent = server.name;

            // Crear elemento p para el nombre del servidor
            let serverSpan = document.createElement("span");
            let serverDescription = `Descripción: ${server.description}`;
            serverSpan.textContent = serverDescription;
            serverSpan.classList.add("dueTaskSpan");

            // Crear circulo con la cantidad de usuarios en el servidor
            console.log(server.id_server)
            const serverCount = await  getServersCount(server.server_id);
            let serverCountCircle = document.createElement("div");
            serverCountCircle.classList.add("taskCountCircle");
            serverCountCircle.textContent = serverCount;

            // Añadir elemetnos
            serverExploreText.appendChild(document.createElement("br"));
            serverExploreText.appendChild(serverSpan);
            serverExploreText.appendChild(serverCountCircle);
            serverExploreBox.appendChild(serverExploreText);

            if (!serverExploreText.hasEventListeners) {
                
                serverExploreText.addEventListener('click', function(event) {
                    var resultado = window.confirm('¿Quieres unirte a ' + server.name + '?');
                    if (resultado === true) {
                        addServerExplore(server.server_id);
                        location.reload(true);
                    } 
                })
                serverExploreText.hasEventListeners = true; // Marcar que se agregó el evento
            }
        }
    })
    .catch(err => console.log(err));
};

// ======================== BUSCAR SERVIDOR ===================================

// const inputBuscador = document.getElementById('buscador');


// // Agregar un evento de escucha al campo de búsqueda
// inputBuscador.addEventListener('input', function () {
//     console.log("ESCRIBIO")
//     const textoBusqueda = inputBuscador.value.toLowerCase();

//     // Filtrar y mostrar los servidores que coinciden con el texto de búsqueda
//     servidores.forEach(function (servidor) {
//         const nombreServidor = servidor.name.toLowerCase();

//         if (textoBusqueda != ''){
//             if (nombreServidor.includes(textoBusqueda)) {
//                 // Mostramos
//                 servidor.style.display = 'block';
//             } else {
//                 // Sin resultados de la busqueda
//                 const notExist = document.createElement("p");
//                 notExist.classList.add("noMessages");
//                 notExist.textContent = "Sin resultados";
//                 serverExploreBox.appendChild(notExist);  
//             }
//         } else {
//             showServersExplore()
//         }
//     });
// });

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

// ====================== AGREGAR UN MENSAJE ============================

//eliminar mensaje
function eliminarMensaje(div){
    div.style.display="none";
    // alert("eliminando mensaje")
    const url = `http://127.0.0.1:5000/messages/delete/${idMessage}`;
    
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                alert(data.message)
                location.reload()
            });
        }else if(response.status === 403) {
            return response.json().then(data => {
                alert(data.message) 
                // window.location.href="home.html"
                location.reload()
            });
        }
    })
}

//editar mensaje
function editarMensaje(div){
     //MISMO DIV DE EDICION MENSAJE 
    document.getElementById("deleteMessage").style.display="none";
    document.getElementById("ChangeMessage").style.display="none";
    let descri=document.createElement("input")
    descri.id="upDescri"
    let sendDescri=document.createElement("button")
    sendDescri.id="sendDescri"
    sendDescri.innerText="Enviar"

    div.appendChild(descri)
    div.appendChild(sendDescri)

    document.getElementById("sendDescri").addEventListener("click",()=>{
        div.style.display="none";
        // alert("editando mensaje")
        let msj=document.getElementById("upDescri").value
        console.log(msj ==="")//true
        if (msj!=""){
            const url = `http://127.0.0.1:5000/messages/${idMessage}/${msj}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json().then(data => {
                        alert(data.message) 
                        window.location.href="home.html"
                    });
                }
                else if(response.status === 403) {
                    return response.json().then(data => {
                        alert(data.message) 
                        window.location.href="home.html"
                    });
                }
                
            }).catch(err  =>{
                alert(err)
                location.reload()
            });
        }else{
            location.reload()
        }
        
    })
}
// Esto es una Prueba de subido