const mysql = require('mysql');
var connection = mysql.createConnection({host:"localhost", user:"admin", password:"gl45@group", database: "groupomania"});
const {base64encode , base64decode} = require('nodejs-base64');
const fs = require('fs');

                //Controller to create a new forum CRUD (create forum)
exports.createForum = (req,res,next) => {
    var date = new Date();
    if (!req.body.errorMessage) { 
        connection.query('SELECT * FROM user WHERE id = '+ req.body.userId, function (err, result)  {
            if(err) {
                return res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
            } else {
                if(result.length > 0 ) {
                    let forum = {
                        nom_Id: req.body.userId,
                        auteur: result[0].nom +" "+result[0].prenom,
                        titre: req.body.titre,
                        thematique: req.body.theme,
                        description: req.body.description,
                        userId_positif_reaction: "No-likes",
                        userId_negatif_reaction: "No-likes",
                        nb_negatif_reaction: 0,
                        nb_positif_reaction: 0,
                        type: req.body.type,
                        date_emission: date.getFullYear() + "\-" + (date.getMonth() + 1 ) + "\-" + date.getDate(),
                        media_path: req.body.pathMedia,
                        fond_publication_path: req.body.fond_logo_path
                    }
                    connection.query('INSERT INTO publication SET ? ', forum, (errCreation, resultCreation) =>  {
                        if(errCreation) {
                            return res.status(500).json('Une erreur est survenue sur la BDD: ' + errCreation);
                        } else {
                            connection.query('UPDATE user SET nb_publications = nb_publications +1 WHERE id='+req.body.userId , (errUpdateUser, resultUpdateUser) =>  {
                                if(errUpdateUser) {
                                    return res.status(500).json('Une erreur est survenue sur la BDD: ' + errUpdateUser);
                                } else {
                                    return res.status(200).json('Votre forum ' + forum.titre + ' a été ajouté en base de donnée!');
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    else {
        return res.status(400).json(req.body.errorMessage);
    }
};

                //Controller to display forums with the statut ("check") CRUD (read forum)
exports.allForum = (req,res,next) => {
    connection.query('SELECT * FROM publication WHERE statut = \'check\'', function (err, result, fields) {
        if(err) {
            return res.status(500).json('Une erreur est survenue sur la BDD: ' + err );
        } else {
            if(result.length > 0) {
               var forumTab = [];
               let forum;
               for (let i in result) {
                    forum = {
                        id: result[i].id,
                        theme: result[i].thematique,
                        title: result[i].titre,
                        description: result[i].description,
                        author: base64decode(result[i].auteur),
                        background: result[i].fond_publication_path,
                        date: result[i].date_emission.getDate() + "/" + (result[i].date_emission.getMonth() +1) + "/" + result[i].date_emission.getFullYear()
                    }
                    forumTab.push(forum);
                }
                return res.status(200).json(forumTab);
            }
            return res.status(200).json('Aucun forum dans la base de données!');
        }
    });
};

                //Controller to display all forums according data in the search form CRUD (read forum)
exports.allSearch = (req,res,next) => {
    const sqlRequest = req.body.sqlSearch+base64encode(req.body.sqlAuthor)+req.body.sqlSearch2;
    connection.query(sqlRequest, function (err, result, fields) {
        if(err) {
            return res.status(500).json('Une erreur est survenue sur la BDD: ' + err );
        } else {
            if(result.length > 0) {
                var forumTab = [];
                let forum;
                for (let i in result) {
                    forum = {
                        id: result[i].id,
                        theme: result[i].thematique,
                        title: result[i].titre,
                        description: result[i].description,
                        author: base64decode(result[i].auteur),
                        background: result[i].fond_publication_path,
                        date: result[i].date_emission.getDate() + "/" + (result[i].date_emission.getMonth() +1) + "/" + result[i].date_emission.getFullYear()
                    }
                    forumTab.push(forum);
                }
                return res.status(200).json(forumTab);
            }
            return res.status(200).json('Aucun forum dans la base de données!');
        }
    });
};

                //Controller to display forum selected by user in forum-list page CRUD (read forum)
exports.oneForum = (req, res, next) => {
    connection.query('SELECT * FROM publication INNER JOIN user ON publication.nom_id = user.id WHERE publication.id = '+ (req.params.id).split(":")[1], function (err, result)  {
        if(err) {
            res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
        } else {
            if(result.length > 0 ) {
                connection.query('SELECT * FROM commentaire WHERE publication_id = '+ (req.params.id).split(":")[1], function (errComments, resultComments)  {
                    if(errComments) {
                        res.status(500).json('Une erreur est survenue sur la BDD: ' + errComments);
                    } else {
                        forum = {
                            userId: result[0].nom_id,
                            theme: result[0].thematique,
                            title: result[0].titre,
                            type:result[0].type,
                            description: result[0].description,
                            author: base64decode(result[0].nom) + " " + base64decode(result[0].prenom),
                            pathMedia: result[0].media_path,
                            profilPath: result[0].imageUrl,
                            likesForum: result[0].userId_positif_reaction,
                            nb_likes_forum: result[0].nb_positif_reaction,
                            dislikesForum: result[0].userId_negatif_reaction,
                            nb_dislikes_forum: result[0].nb_negatif_reaction,
                            nb_publications: result[0].nb_publications,
                            nb_comments: result[0].nb_commentaires,
                            nb_commentsForum: resultComments.length,
                            popularity: result[0].popularité
                        }
                        return res.status(200).json(forum);
                    }
                });
            }
            else {
                return res.status(404).json('Une ressource est manquante!');
            }
        }
    });
};

                //Controller to delete the current forum  CRUD (delete forum)
exports.deleteForum = (req, res, next) => {
    connection.query('SELECT * FROM publication WHERE publication.id = '+ (req.params.id).split(":")[1], function (err, result)  {
        if(err) {
            res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
        } else {
            if(result.length > 0 ) {
                var deleteMediaPath;
                if (deleteMediaPath != "Pas de media") {
                    deleteMediaPath = result[0].media_path.split("medias/")[1];
                } 
                connection.query('DELETE FROM publication WHERE publication.id = '+ (req.params.id).split(":")[1], function (deleteError, deleteResult)  {
                    if(deleteError) {
                        res.status(500).json('Une erreur est survenue sur la BDD: ' + deleteError);
                    } else {
                        fs.unlink(`medias/${deleteMediaPath}`, () => {
                            return res.status(200).json("La publication a été supprimée!");
                        });
                    }
                });
            }
        }
    });
}

                //Controller to display all forum with the statut ("No-check") CRUD (read forum)
exports.allValidateForum = (req,res,next) => {
    connection.query('SELECT * FROM publication WHERE statut = \'no-check\'', function (err, result, fields) {
        if(err) {
            return res.status(500).json('Une erreur est survenue sur la BDD: ' + err );
        } else {
            if(result.length > 0) {
               var forumTab = [];
               let forum;
               for (let i in result) {
                    forum = {
                        id: result[i].id,
                        theme: result[i].thematique,
                        title: result[i].titre,
                        description: result[i].description,
                        author: base64decode(result[i].auteur),
                        background: result[i].fond_publication_path,
                        date: result[i].date_emission.getDate() + "/" + (result[i].date_emission.getMonth() +1) + "/" + result[i].date_emission.getFullYear()
                    }
                    forumTab.push(forum);
                }
                return res.status(200).json(forumTab);
            }
            return res.status(200).json('Aucun forum dans la base de données!');
        }
    });
};

                //Controller to validate forum with the statut ("No-Check") CRUD (update forum)
exports.validateForum = (req, res, next) => {
    connection.query('UPDATE publication SET statut = \'check\' WHERE publication.id = '+ (req.params.id).split(":")[1], function (err, result)  {
        if(err) {
            res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
        } else {
            return res.status(200).json('Le forum a été validé par les modérateurs!');
        }
    });
}

                //Controller to modify the current forum CRUD (update forum)
exports.modifyForum = (req, res, next) => {
    connection.query('SELECT * FROM publication WHERE publication.id = '+ (req.params.id).split(":")[1], function (error, result)  {
        if(error) {
            res.status(500).json('Une erreur est survenue sur la BDD: ' + error);
        } else {
            if(result.length > 0 ) {
                if (req.file) {
                    fs.unlink(`medias/${result[0].media_path.split("medias/")[1]}`, () => {
                        console.log("Le média a été supprimée!");
                    });
                } else {
                    if ((req.body.pathMedia == "Pas de media") && (result[0].media_path != "Pas de media")) {
                        fs.unlink(`medias/${result[0].media_path.split("medias/")[1]}`, () => {
                            console.log("Le média a été supprimée!");
                        });
                    }
                    req.body.pathMedia = result[0].media_path;
                } 
            }
            if (!req.body.errorMessage) { 
                let forum = {
                    titre: req.body.titre,
                    thematique: req.body.theme,
                    description: req.body.description,
                    type: req.body.type,
                    media_path: req.body.pathMedia,
                    fond_publication_path: req.body.fond_logo_path
                }
                connection.query('UPDATE publication SET ? WHERE publication.id = '+ (req.params.id).split(":")[1] , forum, (errUpdate, resultUpdate) =>  {
                    if(errUpdate) {
                        res.status(500).json('Une erreur est survenue sur la BDD: ' + errUpdate);
                    } else {
                        return res.status(200).json('Votre forum ' + forum.titre + ' a été modifié en base de donnée!');
                    }
                });
            } else {
                res.status(400).json(req.body.errorMessage);
            }
        }
    });
};