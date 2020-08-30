
            //Error DOM element declaration
errorView = document.getElementsByClassName("groupomania__views__content__error");

controlSession();
accesAdmin();
clickToLogout();
addUserInfos(JSON.parse(tempoData.getItem("user")).userId);    
searchForum(); 

sendRequest("GET","http://localhost:3000/api/forum",null)            //Request function to have a forum list
.then(data => {
    addBlocsViews(data);
})
.catch(error => {
    errorView[0].innerHTML = error;
});

            //Function to add user information in this page
function addUserInfos(userId) {
    sendRequest("GET", "http://localhost:3000/api/auth/:"+userId, null)
    .then(data => {
        let profilUserTab = [
            ["groupomania__tools__userInfos__infos--posts","Publications crées: "+data.nb_publications],
            ["groupomania__tools__userInfos__infos--comments","Commentaires rédigés: "+data.nb_commentaires],
            ["groupomania__tools__userInfos__infos--popularity","Popularité: "+data.popularity],
            ["groupomania__tools__userInfos__author",data.author]
        ];
        for (let i = 0; i < 4; i++) 
        {
            let elt = document.getElementsByClassName(profilUserTab[i][0]);
            elt[0].innerText = profilUserTab[i][1];
        }
        let img = document.getElementById("imageUrl");
        img.setAttribute("src", data.profil_path);
    })
    .catch(error => {
        errorView[0].innerHTML = error;
    });
}
            //Function to search in database forum
function searchForum() {
    buttonSearch = document.getElementById("submitSearch");
    buttonSearch.addEventListener("click", function(event) {
        event.preventDefault();
        var typeSearch = document.getElementById("type");
        var typeSearchValue = typeSearch.options[typeSearch.selectedIndex].text;
        var themeSearch = document.getElementById("theme");
        var themeSearchValue = themeSearch.options[themeSearch.selectedIndex].text;
        var titleSearch = document.getElementById("title").value;
        var auteurSearch = document.getElementById("auteur").value;
        let sql = {
            sqlSearch: "SELECT * FROM publication WHERE",
            sqlAuthor: "",
            sqlSearch2: "",
            userId: JSON.parse(tempoData.getItem("user")).userId
        }
        if (typeSearchValue != "Choisissez") {
            sql.sqlSearch += " type = \'" + typeSearchValue + "\'";
        }
        else {
            sql.sqlSearch += " type IN ('Texte', 'image', 'video')";
        }
        if (themeSearchValue != "Choisissez") {
            sql.sqlSearch += " AND thematique = \'" + themeSearchValue + "\'";
        }
        if(controlSearch(titleSearch) && (auteurSearch.value != "")) {
            sql.sqlSearch += " AND titre LIKE \'\%"+titleSearch+"\%\' ";
        }
        if(controlSearch(auteurSearch) && (auteurSearch.value != "")) {
            sql.sqlSearch += " AND auteur LIKE \'\%";
            sql.sqlAuthor = auteurSearch;
            sql.sqlSearch2 = "\%\' ";
        }
        tempoData.setItem("dataRequest",JSON.stringify(sql));
        document.location.href = "forum-search.html";
    });
}

            //Function to control data in the search form
function controlSearch(string) {
    let bool = true;
    errorView[0].innerHTML = "" ;
    const pattern = new RegExp("^[^\\s][a-zA-Zéèàêûçàôë\\s-]{2,40}$");
    if (pattern.test(string) == false) {
        errorView[0].innerHTML = "Erreur de saisie!";
        bool = false;
    }
    return bool;
}

