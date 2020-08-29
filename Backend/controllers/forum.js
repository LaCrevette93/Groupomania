const mysql = require('mysql');
var connection = mysql.createConnection({host:"localhost", user:"admin", password:"gl45@group", database: "groupomania"});
const {base64encode , base64decode} = require('nodejs-base64');

                //Controller for display forum CRUD (read forum)
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

                //Controller for display all forums according data in the search form CRUD (read forum)
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