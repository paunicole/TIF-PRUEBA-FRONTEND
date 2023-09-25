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
            taskText.classList.add("serverText");
            taskText.setAttribute("href", `home.html?server_id=${server.server_id}`);
            taskText.setAttribute("data-category-id", server.server_id);
            taskText.textContent = server.name;

            // Crear descripcion
            //let dueTaskSpan = document.createElement("span");
            //let categoryDescription = `Descripción: ${server.description}`;
            //dueTaskSpan.textContent = categoryDescription;
            //dueTaskSpan.classList.add("dueTaskSpan");
            
            // Añadir elementos
            taskText.appendChild(document.createElement("br"));
            //taskText.appendChild(dueTaskSpan);
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

