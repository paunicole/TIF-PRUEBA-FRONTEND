const urlParams = new URLSearchParams(window.location.search);
const serverID = urlParams.get("server_id");

console.log("holaaa channel")

let channelBox = document.querySelector(".channelBox");
let channelBtnAdd = document.querySelector(".btonAddChannel");

let catchChannels = (serverID) => {
    let url = `http://127.0.0.1:5000/channels/?server_id=${serverID}`;
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            // Si no hay canales, muestra un mensaje de advertencia
            const noChannelsMessage = document.createElement("p");
            noChannelsMessage.classList.add("noChannels");
            noChannelsMessage.textContent = "Aún no hay canales en este servidor";
            channelBox.appendChild(noChannelsMessage);
        } else {
            // Si hay canales, crea contenedores para cada uno
            data.map(channel => {
                createChannelContainer(channel);
            });
        }

        channelBtnAdd.addEventListener("click", () => addChannel());
    })

    .catch(err => console.log(err));
};

let createChannelContainer = (channel) =>{

    // Crear elemento de texto para el nombre del canal
    let channelText = document.createElement("a");
    channelText.classList.add("channelText");

    channelText.setAttribute("href", `home.html?server_id=${serverID}&channel_id=${channel.channel_id}`);
    channelText.setAttribute("data-channel-id", channel.channel_id);

    let channel_hashtag = `#${channel.name}`;
    channelText.textContent = channel_hashtag;

    // Añadir elementos
    channelText.appendChild(document.createElement("br"));
    channelBox.appendChild(channelText);
}

let addChannel = () => {
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

// CONTROL
if (serverID) {
    catchChannels(serverID);
} else {
    console.log("No se ha proporcionado un ID de servidor.");
}