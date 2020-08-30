
                            //configuration of HTTP requests to accept incoming files
const multer = require("multer");

const MIME_TYPES = {
    "image/jpg":"jpg",
    "image/jpeg":"jpeg",
    "image/png":"png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/quicktime":"mov",
    "video/x-msvideo":"avi",
    "video/mp4":"mp4",
    "video/x-flv": "flv",
    "video/x-ms-wmv": "wmv"
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'medias')
    },
    filename: (req, file, callback) => {
        var extension = MIME_TYPES[file.mimetype];
        var name = file.originalname.split(".")[0].split(' ').join('_');
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage:storage}).single("userFile");
