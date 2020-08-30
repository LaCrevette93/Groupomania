
                    //URL parameter and error element declaration
var param = new URL(document.location).searchParams.get("id");
errorView = document.getElementsByClassName("groupomania__views__error");

controlSession();
accesAdmin();

sendRequest("GET", "http://localhost:3000/api/forum/:"+param, null)
.then(dataForum => {
    addBlocsViews(dataForum);
    addUserInfos(dataForum);
    addInfoForum(dataForum);
    controlView(dataForum);
    controlViewLikes(dataForum);
    clickToDeleteForum(param);
    clickToValidate(param);
    clickToModifyForum(param);
    clickToLikeForum(dataForum,param);
    clickToDislikeForum(dataForum,param);
    ClickToForumList();
    sendRequest("GET", "http://localhost:3000/api/comment/:"+param, null)
    .then(dataComments => {
        addBlocsComments(dataComments);
        clickToAddComment();        
    })
    .catch(commentsError => {
        errorView[1].innerHTML = commentsError;
    });
})
.catch(forumError => {
    errorView[0].innerHTML = forumError;
});

                    //Function for display one forum in forum-view page
function addBlocsViews(responseRequest) {
    let addBlocs = [
        ["groupomania__views__forum","header","groupomania__views__title","<h2 class=\"groupomania__title\">"+responseRequest.theme+"</h2>"],
        ["groupomania__views__forum","article","groupomania__views__forum__content",null],
    ];
    let addContent = [
        ["groupomania__views__forum__content","section","content","<h3>"+responseRequest.title+"</h3><p>"+responseRequest.description+"</p>"],
        ["groupomania__views__forum__content","aside","media",null]
    ];
    for (let i = 0; i < addBlocs.length; i++) 
    {
        createObject(addBlocs[i][0],addBlocs[i][1],addBlocs[i][2],addBlocs[i][3],0);
        if (i==1) {
            insertMedia(responseRequest,addContent);
            for (let j = 0; j < addContent.length; j++) 
            {
                createObject(addContent[j][0],addContent[j][1],addContent[j][2],addContent[j][3],0);
            }
        }
    }
} 

                    //Function to insert media according this type in the forum bloc
function insertMedia(responseRequest,contentTab) {
    let media_type = responseRequest.type;
    switch (media_type) {
        case "video":
            contentTab[1][3] = "<video title=\"media\" preload=\"auto\" autoplay controls source src="+
            responseRequest.pathMedia+"></video>";
        break;
        case "image":
            contentTab[1][3] = "<img src="+responseRequest.pathMedia+" alt=\"media du forum\">";
        break;
        default:
            console.log("Aucun media à ajouter!");
        break;
    }
}

                    //Function to display comments for the selected forum
function addBlocsComments(responseRequest) {
    if (responseRequest == 'Aucun commentaire à afficher!') {
        errorView[1].innerHTML = 'Aucun commentaire à afficher!';
        document.getElementById("title_comment").innerText = "Commentaires (0)";
    } else {
        document.getElementById("title_comment").innerText = "Commentaires ("+responseRequest.length+")";
        for (let i = 0; i < responseRequest.length; i++) { 
            let addContent = ["groupomania__views__comments__list__content","div","comment","<p>"+responseRequest[i].auteur+" "+responseRequest[i].date+" "+responseRequest[i].message+"</p>"];
            createObject(addContent[0],addContent[1],addContent[2],addContent[3],0);
        }
    }
}

                    //Function to display author informations in forum-view page
function addUserInfos(responseRequest) {
    let profilUserTab = [
        ["groupomania__tools__userInfos__infos--posts","Publications crées: "+responseRequest.nb_publications],
        ["groupomania__tools__userInfos__infos--comments","Commentaires rédigés: "+responseRequest.nb_comments],
        ["groupomania__tools__userInfos__infos--popularity","Popularité: "+responseRequest.popularity],
        ["groupomania__tools__userInfos__author",responseRequest.author]
    ];
    for (let i = 0; i < 4; i++) 
    {
        let elt = document.getElementsByClassName(profilUserTab[i][0]);
        elt[0].innerText = profilUserTab[i][1];
    }
    let img = document.getElementById("imageUrl");
    img.setAttribute("src", responseRequest.profilPath);
}

                    //Function to display forum informations in forum-view page
function addInfoForum(responseRequest) {
    forumInfoArea = [
        ["fas fa-comments",responseRequest.nb_commentsForum],
        ["far fa-thumbs-up",responseRequest.nb_likes_forum],
        ["far fa-thumbs-down",responseRequest.nb_dislikes_forum]
    ];
    for (let i in forumInfoArea) { 
        let elt = document.getElementsByClassName(forumInfoArea[i][0]);
        elt[0].innerText = forumInfoArea[i][1];
    }
}

                    //Function to leave the forum-view page
function ClickToForumList() {
    homeButton = document.getElementById("come-back");
    homeButton.addEventListener("click", function() {
        document.location.href = "forum-list.html";
    });
}

                    //Function to add comment for the forum
function clickToAddComment() {
    let submitComment = document.getElementById('submitComment');
    submitComment.addEventListener("click", function(event) {
        event.preventDefault();
        let comment = {
            message: document.getElementById("addComment").value,
            auteur: JSON.parse(tempoData.getItem("user")).firstname + " " + JSON.parse(tempoData.getItem("user")).lastname,
            userId: JSON.parse(tempoData.getItem("user")).userId,
            publication_id: param
        }
        var dataRequest = JSON.stringify(comment);
        sendRequest("POST", "http://localhost:3000/api/comment", dataRequest)
        .then(dataComments => {
            location.reload();
        })
        .catch(commentsError => {
            errorView[1].innerHTML = commentsError;
        });
    });
}

                    //Function to control access for update data
function controlView(responseRequest) {
    if ((responseRequest.userId != JSON.parse(tempoData.getItem("user")).userId)) {
        document.getElementById("delete").disabled = true;
        document.getElementById("modify").disabled = true;
    }
    if((JSON.parse(tempoData.getItem("user")).role) == "user") {
        document.getElementById("Validate").disabled = true;
    }
}

                    //Function to control likes for the current forum
function controlViewLikes(responseRequest) {
    let positif = document.getElementsByClassName("fa-thumbs-up");
    let negatif = document.getElementsByClassName("fa-thumbs-down");
    if(((responseRequest.likesForum).indexOf(JSON.parse(tempoData.getItem("user")).userId)) != -1) {
        positif[0].style.color = "green";
    }
    else {
        positif[0].style.color = "white";
    }
    if(((responseRequest.dislikesForum).indexOf(JSON.parse(tempoData.getItem("user")).userId)) != -1) {
        negatif[0].style.color = "red";
    }
    else {
        negatif[0].style.color = "white";
    }
}

                    //Function to delete the current forum
function clickToDeleteForum(forumId) {
    document.getElementById("delete").addEventListener("click", function(event) {
        event.preventDefault();
        sendRequest("DELETE", "http://localhost:3000/api/forum/:"+ forumId,null)
        .then(data => {
            document.location.href = "forum-list.html";
        })
        .catch(error => {
            errorView[0].innerHTML = error;
        });
    });
}

                    //Function to validate forum
function clickToValidate(forumId) {
    document.getElementById("Validate").addEventListener("click", function(event) {
        event.preventDefault();
        sendRequest("GET","http://localhost:3000/api/forum/admin/validate/:"+ forumId,null)
        .then(data => {
            document.location.href = "admin.html";
        })
        .catch(error => {
            errorView[0].innerHTML = error;
        });
    });
}

                    //Function to modify forum
function clickToModifyForum(modifyId) {
    document.getElementById("modify").addEventListener("click", function(event) {
        event.preventDefault();
        document.location.href = "forum-modify.html?id="+modifyId;
    });
}

                    //Function to add a like
function clickToLikeForum(responseRequest,forumId) {
    let action = 1;
    let elt = document.getElementsByClassName("fa-thumbs-up");
    elt[0].addEventListener("click", function(event) {
        event.preventDefault();
        if(((responseRequest.dislikesForum).indexOf(JSON.parse(tempoData.getItem("user")).userId)) == -1) {
            if(((responseRequest.likesForum).indexOf(JSON.parse(tempoData.getItem("user")).userId)) != -1) {
                action = 0;
            }
            addRemoveLikes(action,forumId);
        }
    })
}

                    //Function to add a dislike
function clickToDislikeForum(responseRequest,forumId) {
    let action = -1;
    let elt = document.getElementsByClassName("fa-thumbs-down");
    elt[0].addEventListener("click", function(event) {
        event.preventDefault();
        if(((responseRequest.likesForum).indexOf(JSON.parse(tempoData.getItem("user")).userId)) == -1) {
            if(((responseRequest.dislikesForum).indexOf(JSON.parse(tempoData.getItem("user")).userId)) != -1) {
                action = 0;
            }
            addRemoveLikes(action,forumId);
        }
    })
}

                    //Function to add a reaction for the current forum
function addRemoveLikes(action,forumId) {
    let like = {
        type: action,
        publication_id: forumId,
        user_id: JSON.parse(tempoData.getItem("user")).userId
    }
    dataRequest = JSON.stringify(like);
    sendRequest("POST", "http://localhost:3000/api/like/:"+ forumId,dataRequest)
    .then(dataLikes => {
        location.reload();
    })
    .catch(errorLikes => {
        errorView[0].innerHTML = errorLikes;
    })
}