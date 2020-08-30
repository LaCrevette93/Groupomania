                    //Error element declaration
errorView = document.getElementsByClassName("groupomania__views__form__error");

clickToCreateForum();
controlSession();
accesAdmin();

                    //Function to create a new forum
function clickToCreateForum() {
    document.getElementById('submit').addEventListener("click", function(event) {
        var formData = new FormData(document.getElementById("forumForm"));
        formData.append("userId",JSON.parse(tempoData.getItem("user")).userId);
        formData.append("action","create");
        sendRequest("POST", "http://localhost:3000/api/forum", formData)
        .then(data => {
            document.location.href = "forum-list.html";
        })
        .catch(error => {
            errorView[0].innerHTML = error;
        });
    });
}