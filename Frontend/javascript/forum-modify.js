var param = new URL(document.location).searchParams.get("id");
errorView = document.getElementsByClassName("groupomania__views__form__error");

controlSession();
accesAdmin();

sendRequest("GET", "http://localhost:3000/api/forum/:"+param, null)
.then(data => {
    autocomplete(data);
    sendmodifyData();
})
.catch(error => {
    errorView[0].innerHTML = error;
});

                //Function to retrieve the known elements of the selected forum
function autocomplete(responseRequest) {
    for (let index = 0; index < 4; index++) {
        let typeArray = ["choisissez","texte","image","video"];
        if(responseRequest.type==typeArray[index]) {
            document.getElementById("type").options[index].selected = true; 
        }
    }
    for (let index = 0; index < 13; index++) {
        let themeArray = ["Choisissez","Animaux","Formation","Emploi","Economie","Evenements","Immobilier","Services","Rencontres","Loisirs","Environnement","Politique","Actualité"];
        if(responseRequest.theme==themeArray[index]) {
            document.getElementById("theme").options[index].selected = true; 
        }
    }
    document.getElementById("titre").value = responseRequest.title;
    document.getElementById("description").value = responseRequest.description;
}

                //Function to send data for forum modification
function sendmodifyData() {
    document.getElementById('submit').addEventListener("click", function(event) {
        var formData = new FormData(document.getElementById("forumForm"));
        formData.append("userId",JSON.parse(tempoData.getItem("user")).userId);
        formData.append("action","modify");
        var request = new XMLHttpRequest();
        request.open("PUT","http://localhost:3000/api/forum/:"+param);
        request.setRequestHeader("Authorization", "Bearer " + JSON.parse(tempoData.getItem("user")).token);
        request.onreadystatechange = function() {
            if(request.status != 200 && request.status != 201) {
                errorView[0].innerHTML = request.response;
            } else {
               document.location.href = "forum-list.html";
            }
        }
        request.send(formData);
    });
}

