window.addEventListener('load', function () {
    getProfile();
});

var datosUser;
document.getElementById("logout").addEventListener("click", logout);

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
                console.log(data)
                // Mostrar la imagen de avatar
                const avatarImage = document.getElementById("avatar");
                const avatarFileName = data.avatar;
                const avatarUrl = `/assets/${avatarFileName}`;
                avatarImage.src = avatarUrl; // Asignar la URL de la imagen al atributo src
                avatarImage.alt = "Avatar"; // Agregar un atributo alt para accesibilidad
                document.getElementById("avatar").innerText = data.avatar;
                document.getElementById("username").innerText = data.username;
                document.getElementById("email").innerText = data.email;
                document.getElementById("first_name").innerText = data.first_name;
                document.getElementById("last_name").innerText = data.last_name;

                //Formateo la Fecha
                let originalDate = new Date(data.birthdate); // Convertir la fecha de texto a objeto Date 
                let day = originalDate.getDate();            // Obtener el día del mes
                let month = originalDate.getMonth();         // Obtener el mes
                let year = originalDate.getFullYear();       // Obtener el año

                let monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                let monthName = monthNames[month];
                let formattedDate = `${day} de ${monthName} del ${year}`;

                document.getElementById("birthdate").innerText = formattedDate;

                datosUser= updateCampos(data.user_id,data.email,data.username,data.password,data.first_name,data.last_name,data.birthdate,data.avatar)

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
var inputAvatar;
function logout() {
    const url = "http://127.0.0.1:5000/users/logout";
    
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                window.location.href = "login.html";
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

// almacenar los datos del usuario
function updateCampos(user_id,email,user,password,firstName,lastName,cumple, img){
    user={"id":user_id,"e":email,"u":user,"p":password,"f":firstName,"l":lastName,"c":cumple,"i":img}
    return user
}

// boton edit - MODAL
const open = document.getElementById('editUser');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');

open.addEventListener('click', (event) => {
    event.preventDefault()
     console.log("datos del user: ",datosUser)
    //  agregando botones y parrafo
     const divParent=document.getElementById("message")
     let h1Text=document.getElementById("h1Text")

    h1Text.innerHTML="Editar perfil"
    // eliminar contenido
    divParent.removeChild(document.getElementById("padre1"))
    divParent.removeChild(document.getElementById("padre2"))
    divParent.removeChild(document.getElementById("padre3"))
    divParent.removeChild(document.getElementById("padre4"))
    divParent.removeChild(document.getElementById("padre5"))
    

    crearFomulario(divParent)

    //cuando le damos click al boton de cambiar avatar, crea y abre un modal
    document.getElementById("upAvatar").addEventListener("click",(eve)=>{
        eve.preventDefault()
        //crea el modal
        modalAvatars(divParent)
        document.getElementById("conteiner-avatars").style.display="block"
        //click en avatar dispara al input y va hacer que cambie el avatar
        document.getElementById("avatar0").addEventListener("click",()=>{
            document.getElementById("seleccion").value="avatar.png"
        })
        document.getElementById("avatar1").addEventListener("click",()=>{
            document.getElementById("seleccion").value="avatar1.png"
        })
        document.getElementById("avatar2").addEventListener("click",()=>{
            document.getElementById("seleccion").value="avatar2.png"
        })
        document.getElementById("avatar3").addEventListener("click",()=>{
            document.getElementById("seleccion").value="avatar3.png"
        })
        document.getElementById("avatar4").addEventListener("click",()=>{
            document.getElementById("seleccion").value="avatar4.png"
        })
        document.getElementById("avatar5").addEventListener("click",()=>{
            document.getElementById("seleccion").value="avatar5.png"
        })
        document.getElementById("listo").addEventListener("click",()=>{
            // se cierra el modal de elegir avatar
            document.getElementById("conteiner-avatars").style.display="none"
        })
    })
    document.getElementById("send").addEventListener("click",(e)=>{
        e.preventDefault()
        const upEmail=document.getElementById("upEmail").value
        const upUser=document.getElementById("upUser").value
        const upNombre=document.getElementById("upNombre").value
        const upApellido=document.getElementById("upApellido").value
        const upBirthdate=document.getElementById("upBirthdate").value
        // console.log("what is--",upEmail)
        inputAvatar= document.getElementById("seleccion").value

        update(upUser,datosUser.p ,upEmail, upNombre , upApellido ,inputAvatar,upBirthdate)
    })
    
});
function modalAvatars(divParent){
    const divA=document.createElement("div")
    divA.id="conteiner-avatars"
    divA.innerHTML=`<ul><li id="avatar0"><img src="/assets/avatar.png" widht="32px">
    <li id="avatar1"><img src="/assets/avatar1.png" widht="32px"></li>
    <li id="avatar2"><img src="/assets/avatar2.png" widht="32px"></li>
    <li id="avatar3"><img src="/assets/avatar3.png" widht="32px"></li>
    <li id="avatar4"><img src="/assets/avatar4.png" widht="32px"></li>
    <li id="avatar5"><img src="/assets/avatar5.png" widht="32px"></li></ul>
    <input id="seleccion"><button id="listo">Confirmar</button>`
    

    divParent.appendChild(divA)
}

function crearFomulario(divParent){
    const formUp=document.createElement("form")
    formUp.id="updateUser"

    const btonChange=document.createElement("button")
    btonChange.id="upAvatar"
    btonChange.innerHTML="Cambiar Avatar"
    // const avatar=document.getElementById("avatar")
    //label e input para usuario - email -firstName lastName- birthdate 
    const label1=document.createElement("label")
    label1.setAttribute("for","upUser")
    label1.textContent="Usuario: "
    const input1=document.createElement("input")
    input1.id="upUser";
    input1.name="upUser"

    const label2=document.createElement("label")
    const input2=document.createElement("input")
    label2.setAttribute("for","upEmail")
    label2.textContent="Email: "
    input2.id="upEmail" 
    input2.name="upEmail"

    const label3=document.createElement("label")
    label3.setAttribute("for","upNombre")
    label3.textContent="Nombre: "
    const input3=document.createElement("input")
    input3.id="upNombre" 
    input3.name="upNombre"
    const label4=document.createElement("label")
    label4.setAttribute("for","upApellido")
    const input4=document.createElement("input")
    label4.textContent="Apellido: "
    input4.id="upApellido" 
    input4.name="upApellido"
    input4.type="text"

    const label5=document.createElement("label")
    label5.setAttribute("for","upBirthdate")
    const input5=document.createElement("input")
    label5.textContent="Cumpleaños: "
    input5.id="upBirthdate" 
    input5.name="upBirthdate"
    input5.setAttribute("type","Date")

    formUp.appendChild(btonChange)
    // formUp.appendChild(document.createElement("br"))
    formUp.appendChild(label1)
    formUp.appendChild(input1)
    formUp.appendChild(label2)
    formUp.appendChild(input2)
    formUp.appendChild(label3)
    formUp.appendChild(input3)
    formUp.appendChild(label4)
    formUp.appendChild(input4)
    formUp.appendChild(label5)
    formUp.appendChild(input5)
    // boton de enviar
    const btonSend=document.createElement("button")
    btonSend.id="send"
    btonSend.type="submit"
    btonSend.innerHTML="Actualizar Datos"
    formUp.appendChild(btonSend)
    divParent.appendChild(formUp)
    document.getElementById("upEmail").placeholder=datosUser.e
    document.getElementById("upNombre").placeholder=datosUser.f
    document.getElementById("upUser").placeholder=datosUser.u
    document.getElementById("upApellido").placeholder=datosUser.l
    
    
};

// actualizar en la base de datos
function update(user,pass_user,email_user,firstname,lastname,avatar,birthdate) {  
    console.log("usuario-->",document.getElementById("upUser").value)  
    console.log("com",birthdate)
    var data = {
        "user_id":datosUser.id,
        password: pass_user
        }
    //comprueba si hay algo en el input
    if (birthdate.length>0){
        data["birthdate"]=birthdate
    }
        
    
    // comprobar si contiene algo el input caso contrario se queda con el valor que tenia
    if (user!="" && user!=datosUser.u){
        data["username"]=user
    }else{
        data["username"]=datosUser.u
    }

    if (email_user != "" && email_user != datosUser.e){
        data["email"]=email_user
    }else{
        data["email"]=datosUser.e
    }

    if (firstname != "" && firstname != datosUser.f){ 
        data["first_name"]=firstname
    }else{
        data["first_name"]=datosUser.f
    }

    if (lastname != "" && lastname!= datosUser.l) {
        data["last_name"]=lastname
    }else{
        data["last_name"]=datosUser.l
    }

    // if (birthdate!="" && birthdate!=datosUser.c ){
    //     data["birthdate"]=birthdate
    // }else{
    //     data["birthdate"]=datosUser.c }
    
    if (avatar!="" && avatar!=datosUser.i ){
        data["avatar"]=avatar
    }else{
        data["avatar"]=datosUser.i
    }
    
    
    fetch("http://127.0.0.1:5000/users/update", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        // credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            // Redirect to profile page if login is successful
            return response.json().then(data => {
                // window.location.href = "profile.html";
                window.location.href="profile.html"; 
                //document.getElementById("message").innerHTML = "EXITO!";
            });
        } else {
            return response.json().then(data => {
                console.log(data.message)
                document.getElementById("message").innerHTML = data.message;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}

