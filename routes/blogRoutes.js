const express = require('express');
const blogController = require('../controllers/blogConrollers');

const router  = express.Router();

router.get('/create', blogController.blog_create_get );
router.get( '/', blogController.blogs_index );
router.post('/', blogController.blog_create_post );
router.get('/:id', blogController.blog_details);
router.delete('/:id', blogController.blog_delete );

module.exports = router;