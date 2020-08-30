const express = require('express');
const router = express.Router();
const forumController = require("../controllers/forum");

            //specific middleware declaration for forum routes Express App
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const controlMedia = require('../middleware/controlMedia');
const controlForm = require('../middleware/controlForm');

            //Routes for forum Express App
router.post('/', auth, multer, controlMedia, controlForm, forumController.createForum);
router.put('/:id', auth, multer, controlMedia, controlForm, forumController.modifyForum);
router.get('/', auth, forumController.allForum);
router.post('/search/', auth, forumController.allSearch);
router.get('/admin/', auth, forumController.allValidateForum);
router.get('/admin/validate/:id', auth, forumController.validateForum);
router.delete('/:id', auth, forumController.deleteForum);
router.get('/:id', auth, forumController.oneForum);

module.exports = router;