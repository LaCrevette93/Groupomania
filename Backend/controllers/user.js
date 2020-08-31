const mysql = require('mysql');
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');
const { base64encode , base64decode} = require('nodejs-base64');
var connection = mysql.createConnection({host:"localhost", user:"admin", password:"gl45@group", database: "groupomania"});

                //Controller for fignup user CRUD (create user)
exports.signup = (req,res,next) => { 
    bcrypt.hash(req.body.signupForm.motDePasse,10)
    .then(hash => {
        const user =  {
            prenom: base64encode(req.body.signupForm.prenom),
            nom: base64encode(req.body.signupForm.nom),
            email: base64encode(req.body.signupForm.email),
            date_inscription: req.body.date,
            imageUrl: "http://localhost:3000/medias/unknown-user.jpg",
            motDePasse: hash
        };
        connection.query("SELECT * FROM user WHERE email = '" + user.email + "'", function (err, search)  {
            if(err) {
                res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
            } else if (search.length > 0) {
                    res.status(400).json('Votre compte existe déjà!');
                } else {
                    connection.query('INSERT INTO user SET ? ', user, (err, result) =>  {
                    if(err) {
                        res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
                    } else {
                        const userAuth = {email: req.body.signupForm.email, motDePasse: req.body.signupForm.motDePasse};
                        return res.status(200).json(userAuth);
                    }
                });
            }
        });
    })
    .catch(error => res.status(500).json({message:error}));   
};

                //Controller for login user CRUD (read user)
exports.login = (req,res,next) => { 
    const user =  {
        email: base64encode(req.body.email),
        password: req.body.motDePasse
    };
    connection.query("SELECT * FROM user WHERE email = '" +  user.email + "'", function (err, search)  {
        if(err) {
            res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
        } 
        if (search.length > 0) {
            bcrypt.compare(user.password , search[0].motDePasse )
            .then(valid => {
                if(!valid) {
                    return res.status(401).json('Authentification incorrecte!');
                }
                return res.status(200).json({
                    role: search[0].role,
                    userId: search[0].id,
                    firstname: base64decode(search[0].prenom),
                    lastname: base64decode(search[0].nom),
                    token: token.sign(
                        { userId: search[0].id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '1h' }
                    )
                });
            })
            .catch(error => res.status(500).json('Une erreur est survenue: '+error));
        }
        else {
            return res.status(401).json('Authentification incorrecte!');
        }
    });
};       

                //Controller for recover one user according to the userId passed in parameters CRUD (read user)
exports.oneUser = (req, res, next) => {
    connection.query('SELECT * FROM user WHERE id = '+ (req.params.id).split(":")[1], function (err, result)  {
        if(err) {
            res.status(500).json('Une erreur est survenue sur la BDD: ' + err);
        } else {
            if(result.length > 0 ) {
                let author = base64decode(result[0].nom) + " " + base64decode(result[0].prenom);
                let userInfos = {
                    nb_publications: result[0].nb_publications,
                    nb_commentaires: result[0].nb_commentaires,
                    popularity: result[0].popularite,
                    author: author,
                    profil_path: result[0].imageUrl
                }
                return res.status(200).json(userInfos);
            }
            else {
                return res.status(404).json('ressource manquante!');
            }
        }
    });
};