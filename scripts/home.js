let categoryBox = document.querySelector(".categoryBox");
let serverBtn = document.querySelector(".addCategory");

//Función para 
let catchServers = () => {
    fetch("http://127.0.0.1:5000/servers/") //Extraer datos
    .then(res => res.json())
    .then(async data => {   // data contendrá los datos JSON obtenidos del servidor.
        for (let server of data) {  // iteramos los servidores
            
            // Crear elemento de texto de servidor
            let taskText = document.createElement("a");
            taskText.classList.add("categoryText");
            taskText.setAttribute("href", `channels.html?server_id=${server.server_id}`);
            taskText.setAttribute("data-category-id", server.server_id);
            taskText.textContent = server.name;

            // Crear descripcion
            let dueTaskSpan = document.createElement("span");
            let categoryDescription = `Descripción: ${server.description}`;
            dueTaskSpan.textContent = categoryDescription;
            dueTaskSpan.classList.add("dueTaskSpan");
            
            // Añadir elementos
            taskText.appendChild(document.createElement("br"));
            taskText.appendChild(dueTaskSpan);
            categoryBox.appendChild(taskText);
        }

        // Llamado para agregar un nuevo servidor
        serverBtn.addEventListener("click", () => addCategory());
    })
    .catch(err => console.log(err));
};

catchServers();


// Agrega un nuevo servidor
let addCategory = () => {
    let categoryName = prompt("Ingrese el nombre del servidor");
    let categoryDescription = prompt("Ingrese la descripción del servidor");
    let category = {
        name: categoryName,
        description: categoryDescription
    };
    fetch("http://127.0.0.1:5000/servers/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    })
    .then(res => res.json())
    .then(data => {
        location.reload();
    })
    .catch(err => console.log(err));
}