const express = require('express');
const { body } = require('express-validator/check');
const feedController = require('../controllers/feed');
const middlewareUtils = require('../utils/middlewareUtils');
const router = express.Router();

router.get('/posts', middlewareUtils.isAuthMiddelware, feedController.getPosts);

router.post('/post', middlewareUtils.isAuthMiddelware, [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], feedController.createPost);

router.get('/post/:postId', middlewareUtils.isAuthMiddelware, feedController.getPost);

router.put('/post/:postId', middlewareUtils.isAuthMiddelware, [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], feedController.updatePost);

router.delete('/post/:postId', middlewareUtils.isAuthMiddelware, feedController.deletePost);

module.exports = router;