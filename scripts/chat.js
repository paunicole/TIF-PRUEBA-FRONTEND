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

    // Crear elemento de texto de servidor
    let chatText = document.createElement("p");   // Elemento de texto para representar el nombre del canal
    chatText.classList.add("chatText");        // Agrega la clase "messageText" a este elemento
    chatText.textContent = chat.message;          // Establece su contenido de texto con el nombre de la tarea obtenido de la variable chat.message

    // Añadir elementos
    chatText.appendChild(document.createElement("br"));
    chatBox.appendChild(chatText);
    chatText.setAttribute("data-chat-id", chat.message_id);
}

// CONTROL
if (channelID) {
    catchChats(channelID);
} else {
    console.log("No se ha proporcionado un ID de canal.");
}