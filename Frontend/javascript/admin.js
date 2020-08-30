
                    //Error element declaration
errorView = document.getElementsByClassName("groupomania__views__content__error");

sendRequest("GET", "http://localhost:3000/api/forum/admin/", null)
.then(data => {
    addBlocsViews(data);
})
.catch(error => {
    errorView[0].innerHTML = error;
});