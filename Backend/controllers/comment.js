const mysql = require('mysql');
const { base64encode , base64decode} = require('nodejs-base64');
var connection = mysql.createConnection({host:"localhost", user:"admin", password:"gl45@group", database: "groupomania"});

                         //Controller for display all comments for the selected forum CRUD (read comment)
exports.allComment = (req,res,next) => {
    connection.query('SELECT * FROM commentaire WHERE publication_id = '+ (req.params.id).split(":")[1], function (err, result, fields) {
        if(err) {
            return res.status(500).json('Une erreur est survenue sur la BDD: ' + err );
        } else {
            if(result.length > 0) {
                var commentTab = [];
                let comment;
                for (let i in result) {
                    let auteur = base64decode(result[i].auteur);
                    comment = {
                        message: result[i].message,
                        auteur: auteur,
                        date: result[i].date.getDate() + "/" + (result[i].date.getMonth() +1) + "/" + result[i].date.getFullYear()
                    }
                    commentTab.push(comment);
                }
                return res.status(200).json(commentTab);
            }
            return res.status(200).json('Aucun commentaire à afficher!');
        }
    });
};

                        //Controller for create a comment for the selected forum CRUD (create comment)
exports.createComment = (req,res,next) => {
    var date = new Date();
    let comment = {
        auteur: base64encode(req.body.auteur),
        message: req.body.message,
        date: date.getFullYear() + "\-" + (date.getMonth() + 1 ) + "\-" + date.getDate(),
        publication_id: req.body.publication_id
    }    
    connection.query('INSERT INTO commentaire SET ? ', comment, (errComment, resultComment) =>  {
        if(errComment) {
            return res.status(500).json('Une erreur est survenue sur la BDD: ' + errComment);
        } else {
            connection.query('UPDATE user SET nb_commentaires = nb_commentaires +1 WHERE id='+req.body.userId, (errUser, resultUser) =>  {
                if(errUser) {
                    return res.status(500).json('Une erreur est survenue sur la BDD: ' + errUser);
                } else {
                    return res.status(200).json('Votre commentaire a été ajouté en base de donnée!');
                }
            });
        }
    });
};