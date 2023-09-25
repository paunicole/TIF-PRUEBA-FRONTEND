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
            noMessagesMessage.textContent = "No hay mensajes. Escribe uno...";
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

    /// Crear elemento de texto para el nombre de usuario
    let chatUser = document.createElement("span");
    chatUser.textContent = chat.user_id;
    
    // Crear elemento de texto para la fecha
    let chatDate = document.createElement("span");
    let originalDate = new Date(chat.date_time); // Convertir la fecha de texto a objeto Date 
    let day = originalDate.getDate();            // Obtener el día del mes
    let month = originalDate.getMonth();         // Obtener el mes
    let year = originalDate.getFullYear();       // Obtener el año
    let hours = originalDate.getHours().toString().padStart(2, '0');         // Obtener la hora
    let minutes = originalDate.getMinutes().toString().padStart(2, '0');     // Obtener los minutos
    let formattedDate = `${day}/${month + 1}/${year} ${hours}:${minutes}`;
    chatDate.textContent = formattedDate;

    // Crear elemento de texto para el mensaje
    let chatText = document.createElement("p");
    chatText.classList.add("chatText");
    chatText.textContent = chat.message;

    // Añadir elementos
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