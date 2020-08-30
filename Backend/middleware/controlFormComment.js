
                        //Middleware to secure the form for adding comments
module.exports = (req,res,next) => {
    const regexComment = "^[^\\s][a-zA-Zéèàêûçàôëî.'():?,!\\s\\t\\n\\r\\d]{10,10000}$";
    const pattern = new RegExp(regexComment);
    if(pattern.test(req.body.message)) {
        next();
    } else {
        return res.status(400).json("Erreur de saisie dans le champ commentaire!");
    }
}