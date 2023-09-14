// let bton=document.getElementById("edit")
// bton.addEventListener("click", function(event){
//     document.getElementById("message").innerHTML = "An error occurred.";
// })
document.getElementById("edit").addEventListener('click', function(event){
    event.preventDefault();
    view();
});

function view() {
    const url = "http://127.0.0.1:5000/users/welcome";
    
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                cargarFormulario(data)
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

function cargarFormulario(data){
    console.log(data)
    const user=data.username
    const pass_user=data.password
    const email_user= data.email
    const firstname=data.first_name
    const lastname= data.last_name
    const birthdate= data.birthdate
    document.getElementById("msj").style.display="none";
    document.getElementById("edit").style.display="none";
    document.getElementById("myform").style.display="block";
    document.getElementById("username").value=user
    document.getElementById("email").value=email_user
    document.getElementById("first_name").value=firstname
    document.getElementById("last_name").value=lastname
    // document.getElementById("password").value=data.password
    document.getElementById("birthdate").value=birthdate

    document.getElementById("myform").addEventListener("submit", function (event) {
        event.preventDefault();
        update(user,pass_user,email_user,firstname,lastname,birthdate);
})

}    
    // document.getElementById("myform").reset()//resetear el formulario


function update(user,pass_user,email_user,firstname,lastname,birthdate) {
    let first_name=document.getElementById("first_name").value;
    let last_name= document.getElementById("last_name").value;
    let username=document.getElementById("username").value;
    let email= document.getElementById("email").value;
    let fecha=document.getElementById("birthdate").value;
    console.log(fecha)
    
    var data = {
        password: pass_user
        }
    if (username!="" && username!=user){
        data["username"]=username
    }else{
        data["username"]=user
    }

    if (email != "" && email != email_user){
        data["email"]=email
    }else{
        data["email"]=email_user
    }

    if (first_name != "" && first_name != firstname){ 
        data["first_name"]=first_name
    }else{
        data["first_name"]=firstname
    }

    if (last_name != "" && last_name!= lastname) {
        data["last_name"]=last_name
    }else{
        data["last_name"]=lastname
    }

    if (fecha!="" && fecha!=birthdate ){
        data["birthdate"]=fecha
    }else{
        data["birthdate"]=birthdate
    }
        
    fetch("http://127.0.0.1:5000/users/update", {
        method: 'POST',
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
                // window.location.href="profile.html"; 
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
