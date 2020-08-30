const express = require('express');
const router = express.Router();
const commentController = require("../controllers/comment");

const auth = require('../middleware/auth');
const controlFormComment = require('../middleware/controlFormComment');

                 //Routes for comments Express App
router.get('/:id', auth, commentController.allComment);
router.post('/', auth, controlFormComment, commentController.createComment);

module.exports = router;