clickToLogin();

                //Function to connect user if no error is detected
function clickToLogin() {
    signup = document.getElementById("login");
    signup.addEventListener("click", function(event) {
        event.preventDefault();
        let loginForm = {
            email: document.getElementById("email").value,
            motDePasse: document.getElementById("motDePasse").value
        }
        if (controlForm("login",loginForm)) {
            var dataRequest = JSON.stringify(loginForm);
            sendRequest("POST", "http://localhost:3000/api/auth/login", dataRequest)
            .then(data => {
                tempoData.setItem("user", JSON.stringify(data));
                document.location.href = "./pages/forum-list.html";
            })
            .catch(error => {
                errorView[0].innerHTML = error;
            });
        }
    });
}

