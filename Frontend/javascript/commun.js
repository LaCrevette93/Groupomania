            //Error view element declaration
let errorView = document.getElementsByClassName("auth__content__log__error");

            //Temporary browser memory declaration
const tempoData = sessionStorage; 

            //Regex object for control form in login and signup page
let expRegex = {
    prenom: /^[^\\s][a-zA-Zéèàêûçàôë\\s-]{2,25}$/,
    nom: /^[^\\s][a-zA-Zéèàêûçàôë\\s-]{2,25}$/,
    email: /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/,
    motDePasse: /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!%*$.?])\S{8,15}$/
}

            //Request function width error handling
const sendRequest = (verb,url,data) => {                    
    return new Promise((resolve,reject) => {                
        const request = new XMLHttpRequest();               
        request.open(verb,url);
        if ((url!="http://localhost:3000/api/auth/login") && (url!="http://localhost:3000/api/auth/signup"))
        {
            request.setRequestHeader("Authorization", "Bearer " + JSON.parse(tempoData.getItem("user")).token);
        }
        if (url!="http://localhost:3000/api/forum")
        {
            request.setRequestHeader("Content-Type", "application/json");
        }
        request.responseType = 'json';
        if (verb == "GET") {                                
            request.send();
        }
        else if (verb == "POST" || verb == "DELETE") {
            request.send(data);
        }
        request.onload = function() {
        switch (request.status) {
            case 200:
                resolve(request.response);
                break;
            case 201:
                resolve(request.response);
                break;
            case 400:
                reject(request.response);
                break;
            case 401:
                reject(request.response);
                break;
            case 404:
                reject("Page introuvable!");
                break;
            case 500:
                reject("Erreur serveur!");
                break;
            default:
                reject("Une erreur inconnue est survenue!");
                break;
            } 
        }
        request.onerror = function() {
            if(request.status===0) {
                reject("Le serveur n'est pas joignable!");
            } else {
                reject("Problème de communication avec le serveur!");
            }
        }
    });
}

            //function to create DOM element according to the arguments passed in parameters
function createObject(target,balise,classe,content,level) {          
    let blockListForum = document.getElementsByClassName(target);     
    let sectionForum = document.createElement(balise); 
    if (classe != null) {
        sectionForum.classList.add(classe);  
    }               
    blockListForum[level].appendChild(sectionForum);
    if (content != null) {
        sectionForum.innerHTML = content;
    }
}

            //Function to control data in signup and login form           
function controlForm(page,dataObject) {
    let bool = true;
    errorView[0].innerHTML = "";
    for (let i in dataObject) {
        const pattern = new RegExp(expRegex[i]);
        const string = document.getElementById(i).value;
        if(pattern.test(string) == false) {
            errorView[0].innerHTML += "Erreur dans le champ "+ "\"" + i + "\"</br>";
            bool = false;
        }
        if (page == "signup") {
            if((document.getElementById("motDePasse").value != document.getElementById("confirmMotDePasse").value)) {
                errorView[0].innerHTML = "Les champs mot de passe ne correspondent pas!";
                bool = false;
            }
        }
    }
    return bool;
}
