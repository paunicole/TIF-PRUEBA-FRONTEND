const urlParams2 = new URLSearchParams(window.location.search);
const channelID = urlParams2.get("channel_id");

let chatBox = document.querySelector(".chatBox");

console.log("holaaa chat")

let catchChats = (channelID) => {
    let url = `http://127.0.0.1:5000/messages/?channel_id=${channelID}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            // Si no hay mensajes, muestra un mensaje de advertencia
            const noMessagesMessage = document.createElement("p");
            noMessagesMessage.classList.add("noMessages");
            noMessagesMessage.textContent = "Aún no hay mensajes en este canal";
            chatBox.appendChild(noMessagesMessage);
        } else {
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

// CONTROL
if (channelID) {
    catchChats(channelID);
} else {
    console.log("No se ha proporcionado un ID de canal.");
}