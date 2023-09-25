document.getElementById("myform").addEventListener("submit", function (event) {
    event.preventDefault();

    register();
    document.getElementById("myform").reset()//resetear el formulario
});

function register() {
    
    let first_name=document.getElementById("first_name").value;
    let last_name= document.getElementById("last_name").value;
    
    var data = {
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        birthdate: document.getElementById("birthdate").value
        }

    if (first_name != ""){ 
        data["first_name"]=first_name
    }
    if (last_name != "") {
        data["last_name"]=last_name
    }
    
    data["avatar"]="avatar.png"
    fetch("http://127.0.0.1:5000/users/register", {
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
                window.location.href = "login.html";
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
