const mysql = require('mysql');
var connection = mysql.createConnection({host:"localhost", user:"admin", password:"gl45@group", database: "groupomania"});
const {base64encode , base64decode} = require('nodejs-base64');
const fs = require('fs');

                //Controller to display forum CRUD (read forum)
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