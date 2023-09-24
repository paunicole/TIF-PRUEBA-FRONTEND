const urlParams = new URLSearchParams(window.location.search);
const categoryID = urlParams.get("server_id");

let taskBox = document.querySelector(".taskBox");
let channelBtn = document.querySelector(".addTask");

// let catchTasks = (categoryID) => {
//     let url = `http://127.0.0.1:5000/channels/?server_id=${categoryID}`;
//     fetch(url)
//     .then(res => res.json())
//     .then(data => {
//         data.map(channel => {
//             createTaskContainer(channel)
//         });

//         let addTaskBtn = document.querySelector(".addTask");
//         addTaskBtn.addEventListener("click", () => {
//             addTask(categoryID);
//         });
//     })
//     .catch(err => console.log(err));
// };

let catchTasks = (categoryID) => {
    let url = `http://127.0.0.1:5000/channels/?server_id=${categoryID}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            // Si no hay canales, muestra un mensaje de advertencia
            const noChannelsMessage = document.createElement("p");
            noChannelsMessage.textContent = "Aún no hay canales, crea uno.";
            taskBox.appendChild(noChannelsMessage);
        } else {
            // Si hay canales, crea contenedores para cada uno
            data.map(channel => {
                createTaskContainer(channel);
            });
        }

        let addTaskBtn = document.querySelector(".addTask");
        addTaskBtn.addEventListener("click", () => {
            addTask(categoryID);
        });
    })
    .catch(err => console.log(err));
};

let createTaskContainer = (channel) =>{

    // Crear elemento de texto de servidor
    let taskText = document.createElement("p");    // Elemento de texto para representar el nombre del canal
    taskText.classList.add("channelText");            // Agrega la clase "channelText" a este elemento
    //taskText.textContent = channel.name;           // Establece su contenido de texto con el nombre de la tarea obtenido de la variable tarea.name.
    let canal_hashtag = `#${channel.name}`;
    taskText.textContent = canal_hashtag;
    console.log(canal_hashtag)
    taskText.setAttribute("href", `home.html?server_id=${categoryID}/channel_id=${channel.channel_id}`);
    taskText.setAttribute("data-channel-id", channel.channel_id);

    // Crear descripcion
    //let dueTaskSpan = document.createElement("span");
    //let dueTask = `Descripción: ${channel.descripcion}`;
    //dueTaskSpan.textContent = dueTask;
    //dueTaskSpan.classList.add("dueTaskSpan");

    // Añadir elementos
    taskText.appendChild(document.createElement("br"));
    //taskText.appendChild(dueTaskSpan);
    taskBox.appendChild(taskText);
    taskText.setAttribute("data-channel-id", channel.channel_id);
}

// Función para crear un canal mediante una solicitud POST a una dirección URL local: "http://127.0.0.1:5000/channels/
let addTask = (categoryID) => {
    let taskName = prompt("Ingrese el nombre del canal");
    let taskDescription = prompt("Ingrese la descripción del canal");

    fetch("http://127.0.0.1:5000/channels/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: taskName,
            due_date: taskDescription,
            category_id: +categoryID
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Canal creado:", data);
    })
    .catch(error => {
        console.error("Error al crear el canal:", error);
        alert("El nombre del canal y la fecha no puede estar vacío")
    });
}

// CONTROL
if (categoryID) {
    catchTasks(categoryID);
} else {
    console.log("No se ha proporcionado un ID de servidor.");
}



