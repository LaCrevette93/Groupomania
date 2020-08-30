const fs = require('fs');

                //Middleware to control the form before creation by the controller
module.exports = (req,res,next) => {
    let bool = true;
    const expRegex = {
        titre: "^[^\\s][a-zA-Zéèàêûçàôë\\s-]{2,40}$",
        description: "^[^\\s][a-zA-Zéèàêûçàôëî.':,!\\s\\d-]{10,1000}$"
    };
    for (let i in expRegex) {
        const pattern = new RegExp(expRegex[i]);
        const string = req.body[i];
        if (pattern.test(string) == false) {
            req.body.errorMessage = "Erreur de saisie dans le champ " + i ;
            bool = false;
        }
        i++;
    }
    if (req.body.type == "" || req.body.theme == "") {
        req.body.errorMessage = "Des champs à choix multiples sont mal renseignés!"
        bool = false;
    }
    if ((bool == false) && (req.file)) {
        fs.unlink(`medias/${req.file.filename}`, () => {
            console.log("Média supprimée car la requête ne correspond pas aux informations attendues");
        });
    }
    next();
}