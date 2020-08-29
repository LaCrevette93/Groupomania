clickToSignup();

                //Function to create user account if no error is detected
function clickToSignup() {
    const date = new Date();
    signup = document.getElementById("signup");
    signup.addEventListener("click", function(event) {
        event.preventDefault();
        let signupForm = {
            prenom: document.getElementById("prenom").value,
            nom: document.getElementById("nom").value,
            email: document.getElementById("email").value,
            motDePasse: document.getElementById("motDePasse").value
        }
        let date_inscription = date.getFullYear() + "\-" + (date.getMonth() + 1 ) + "\-" + date.getDate();
        if (controlForm("signup",signupForm)) {
            var dataRequest = '{"signupForm": '+ JSON.stringify(signupForm)+ ', "date": '+ JSON.stringify(date_inscription)+'}';
            sendRequest("POST", "http://localhost:3000/api/auth/signup", dataRequest)
            .then(data => {
                dataRequest =  JSON.stringify(data);
                sendRequest("POST", "http://localhost:3000/api/auth/login", dataRequest)
                .then(data => {
                    tempoData.setItem("user", JSON.stringify(data));
                    document.location.href = "forum-list.html";
                })
                .catch(error => {
                    errorView[0].innerHTML = error;
                });
            })
            .catch(error => {
                errorView[0].innerHTML = error;
            });
        }
    });
}
    