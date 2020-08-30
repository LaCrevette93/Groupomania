const express = require('express');
const router = express.Router();
const forumController = require("../controllers/forum");

            //specific middleware declaration for forum routes Express App
const auth = require('../middleware/auth');

            //Routes for forum Express App
router.get('/', auth, forumController.allForum);
router.post('/search/', auth, forumController.allSearch);
router.delete('/:id', auth, forumController.deleteForum);
router.get('/:id', auth, forumController.oneForum);

module.exports = router;