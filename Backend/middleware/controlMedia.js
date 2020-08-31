const fs = require('fs');

                        //Middleware to control type of file before creation by controller
module.exports = (req,res,next) => {
    var media_type = req.body.type;
    let bool = true;
    if (!req.file) {
        if ((media_type == "image" || media_type == "video") && (req.body.action == "create")) {
            req.body.errorMessage = "Le fichier media est manquant!";
        } else if (media_type == "image") {
            req.body.fond_logo_path = "http://localhost:3000/medias/logo_forum_image.png";
        } else if (media_type == "video") {
            req.body.fond_logo_path = "http://localhost:3000/medias/logo_forum_video.png";
        } else if (media_type == "texte") {
            req.body.fond_logo_path = "http://localhost:3000/medias/logo_forum_texte.png";
            req.body.pathMedia = 'Pas de media';
        }
    } else {
        var extension = req.file.filename.split('.')[1];
        switch (media_type) {
            case "texte":
                req.body.errorMessage = "Les pièces jointes ne sont pas autorisées pour ce type de média!";
                bool = false;
            break;
            case "video":
                if (extension!="mp4") {
                    req.body.errorMessage = "Seul le format mp4 est accepté";
                    bool = false;
                } else {
                    req.body.pathMedia = `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`;
                    req.body.fond_logo_path = "http://localhost:3000/medias/logo_forum_video.png";
                }
            break;
            case "image":
                if (extension!="jpg" && extension!="jpeg" && extension!="png" && extension!="gif") {
                    req.body.errorMessage = "Seul les formats jpg, jpeg, png et gif sont acceptés";
                    bool = false;
                } else {
                    req.body.pathMedia = `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`;
                    req.body.fond_logo_path = "http://localhost:3000/medias/logo_forum_image.png";
                }
            break;
        } 
    }
    if (bool == false) {
        fs.unlink(`medias/${req.file.filename}`, () => {
            console.log("Média supprimée car le fichier ne correspond pas a la demande!");
        });
    }
    next();
};



