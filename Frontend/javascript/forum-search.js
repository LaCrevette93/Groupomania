errorView = document.getElementsByClassName("groupomania__views__content__error");

controlSession();
accesAdmin();

sendRequest("POST","http://localhost:3000/api/forum/search",tempoData.getItem("dataRequest"))
.then(data => {
    addBlocsViews(data);
})
.catch(error => {
    errorView[0].innerHTML = error;
});

