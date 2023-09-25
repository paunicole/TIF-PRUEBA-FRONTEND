window.addEventListener('load', function () {
    getProfile();
});

var datosUser;
document.getElementById("logout").addEventListener("click", logout);

function getProfile() {
    const url = "http://127.0.0.1:5000/users/profile";
    
    fetch(url, {
        method: 'GET',
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
                document.getElementById("birthdate").innerText = data.birthdate;
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

// boton edit - MODAL
const open = document.getElementById('editUser');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');

open.addEventListener('click', () => {
     console.log("datos del user: ",datosUser)
    //  agregando botones y parrafo
     const divParent=document.getElementById("message")
    divParent.innerHTML+=`<p id="padre6"></p>`
    divParent.innerHTML+=`<p id="pBtn1"></p>`
    divParent.innerHTML+=`<p id="pBtn2"></p>`
 
    // uso de los p para ingresar los nuevo valores con input
    let padre1= document.getElementById("padre1")
    let padre2= document.getElementById("padre2")
    let padre3= document.getElementById("padre3")
    let padre4= document.getElementById("padre4")
    let padre5= document.getElementById("padre5")
    let padre6= document.getElementById("padre6")
    
    // 0-user_id 1-username 2-email 3-name 4-appe 5-cumple 6-avatar
    padre1.innerHTML=`<strong>Usuario: </strong><input id="upUsername" placeholder=${datosUser.u} type="text">`
    padre2.innerHTML=`<strong>Email: </strong><input id="upEmail" placeholder=${datosUser.e} type="email">`
    // console.log(datosUser.f)
    padre3.innerHTML=`<strong>Nombre: </strong><input id="upName" placeholder=${datosUser.f}  type="text">`
    padre4.innerHTML=`<strong>Apellido: </strong><input id="upLastname" placeholder=${datosUser.l} type="text">`
    // padre5.innerHTML=`<strong>Cumpleaños: </strong><input id="upBirthdate" placeholder=${datosUser.c} type="Date">`
    padre6.innerHTML=`<strong>Avatar: </strong><input id="upImg" placeholder=${datosUser.i} type="file">`

    document.getElementById("padre5").style.display="none"; //esconder el cumple
    
    // botones de enviar y volver
    let pBtn1=document.getElementById("pBtn1")
    pBtn1.innerHTML=`<button id="updateUser" type="submit">Enviar</button>`
    let pBtn2=document.getElementById("pBtn2")

    // se pasan el value de los input y se envian para ser actualizados a la base
    document.getElementById("updateUser").addEventListener("click",()=> {
        
        user=document.getElementById("upUsername").value;
        // console.log("Usernmae_:",user)
        email_user=document.getElementById("upEmail").value;
        firstname=document.getElementById("upName").value;
        lastname=document.getElementById("upLastname").value;
        // birthdate=document.getElementById("upBirthdate").value;
        avatar=document.getElementById("upImg").value;

        update(user,datosUser.p,email_user,firstname,lastname,avatar,birthdate);
    })
    
    pBtn2.innerHTML=`<button id="volver">Volver</button>`

    document.getElementById("volver").style.backgroundColor="black";
    document.getElementById("volver").style.color="white"; 

    document.getElementById("volver").addEventListener('click', () => {
        window.location.href="profile.html"
    });
    
});


// almacenar los datos del usuario
function updateCampos(user_id,email,user,password,firstName,lastName,cumple, img){
    user={"id":user_id,"e":email,"u":user,"p":password,"f":firstName,"l":lastName,"c":cumple,"i":img}
    return user
}

// actualizar en la base de datos
function update(user,pass_user,email_user,firstname,lastname,avatar,birthdate=null) {    
    var data = {
        "user_id":datosUser.id,
        password: pass_user
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
                window.location.href = "profile.html";
            });
        } else {
            return response.json().then(data => {
                // console.log(data.message)
                alert(data.message);
            });
        }
    })
    .catch(error => {
        alert("An error occurred.");
    });
}