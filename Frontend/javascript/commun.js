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

            //Function to generate a list of forums saved in the database
function addBlocsViews(responseRequest) {   
    if (responseRequest == 'Aucun forum dans la base de données!') {
        errorView[0].innerHTML = responseRequest;
    } else {
        for (let i = 0; i < responseRequest.length; i++) 
        {
            let blockRacine = ["groupomania__views__content__list","a","groupomania__views__content__list__article-link"];
            let addBlocs = ["groupomania__views__content__list__article-link","article","article"];                    
            createObject(blockRacine[0],blockRacine[1],blockRacine[2],null,0);
            generateLinkForum(blockRacine[2],i,responseRequest);
            createObject(addBlocs[0],addBlocs[1],addBlocs[2],null,i); 
            let addContent = [
                ["article","header","article__header","<h4>"+responseRequest[i].theme+"</h4>"],
                ["article","section","article__content","<p>"+responseRequest[i].title+"</p><p>"+responseRequest[i].description+"</p>"],
                ["article","footer","article__footer","<p>"+responseRequest[i].author+"</br>"+responseRequest[i].date+"</p>"]
            ]; 
            for (let j in addContent) 
            {
                createObject(addContent[j][0],addContent[j][1],addContent[j][2],addContent[j][3],i);
            }
        }
    }
    var element = document.getElementsByClassName("article");
    for (let i = 0; i < element.length; i++) {
        element[i].setAttribute("style", "background-image: url(\""+responseRequest[i].background+"\"");
    }
}  

            //Function to generate link for each forum in forum-list page
function generateLinkForum(target,level,data) {                                               
    let blockListForum = document.getElementsByClassName(target);                             
    blockListForum[level].setAttribute("href","./forum-view.html?id="+data[level].id);
}

            //Function to logout user when click "Deconnexion" button
function clickToLogout() {
    logout = document.getElementById("logoff");
    logout.addEventListener("click", function(event) {
        event.preventDefault();
        document.location.href = "../index.html";
    });
}