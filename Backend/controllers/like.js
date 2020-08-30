const mysql = require('mysql');
var connection = mysql.createConnection({host:"localhost", user:"admin", password:"gl45@group", database: "groupomania"});

exports.likeForum = (req,res,next) => {
    connection.query('SELECT * FROM publication WHERE publication.id = '+ (req.params.id).split(":")[1], function (err, result)  {
        if(err) {
            res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
        } else {
            if (result.length > 0) {
                let likes = {
                    userId_positif_reaction: result[0].userId_positif_reaction,
                    userId_negatif_reaction: result[0].userId_negatif_reaction,
                    nb_negatif_reaction: result[0].nb_negatif_reaction,
                    nb_positif_reaction: result[0].nb_positif_reaction
                }
                switch (req.body.type) {
                    case 1:
                        likes.nb_positif_reaction ++;
                        likes.userId_positif_reaction += " "+req.body.user_id;
                    break;
                    case -1:
                        likes.nb_negatif_reaction ++;
                        likes.userId_negatif_reaction += " "+req.body.user_id;  
                    break;  
                    case 0:
                        if(((likes.userId_positif_reaction).indexOf(req.body.user_id)) != -1) {
                            likes.userId_positif_reaction = (likes.userId_positif_reaction).replace(req.body.user_id,"");
                            likes.nb_positif_reaction --;
                        }
                        if(((likes.userId_negatif_reaction).indexOf(req.body.user_id)) != -1) {
                            likes.userId_negatif_reaction = (likes.userId_negatif_reaction).replace(req.body.user_id,"");
                            likes.nb_negatif_reaction --;
                        }
                    break;
                    default:
                        console.log("Une erreur inconnue est survenue!");
                    break;
                } 
                connection.query('UPDATE publication SET ? WHERE publication.id = '+ (req.params.id).split(":")[1], likes, function (updateError, updateResult) {
                    if(updateError) {
                        res.status(500).json('Une erreur est survenue sur la BDD: ' + updateError);
                    } else {
                        let likeTab = {
                            type: req.body.type,
                            publication_id: req.body.publication_id,
                            user_id: req.body.user_id
                        }
                        if ((req.body.type == 1) || (req.body.type == -1)) {
                            connection.query('INSERT INTO likes SET ? ', likeTab, function (likeTabError, likeTabResult) {
                                if(likeTabError) {
                                    res.status(500).json('Une erreur est survenue sur la BDD: ' + likeTabError);
                                } else {
                                    res.status(200).json(likes); 
                                }
                            });
                        }
                        else if (req.body.type == 0) {
                            connection.query('DELETE FROM likes WHERE publication_id = '+ (req.params.id).split(":")[1] + ' AND user_id = '+req.body.user_id, function (deleteError, deleteResult)  {
                                if(deleteError) {
                                    res.status(500).json('Une erreur est survenue sur la BDD: ' + deleteError);
                                } else {
                                    res.status(200).json(likes); 
                                }
                            });
                        }
                    }
                });
            } else {
                res.status(404).json("ressource forum introuvable!");
            } 
        }
    });
}
