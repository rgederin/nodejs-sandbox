import express from 'express';

import { getPosts, createPost, getPost, updatePost, deletePost } from '../controllers/feed.js'
import { isAuthMiddelware } from '../utils/middlewareUtils.js'
import validator from 'express-validator'
const { body, validationResult } = validator

const router = express.Router();

router.get('/posts', isAuthMiddelware, getPosts);

router.post('/post', isAuthMiddelware, [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], createPost);

router.get('/post/:postId', isAuthMiddelware, getPost);

router.put('/post/:postId', isAuthMiddelware, [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], updatePost);

router.delete('/post/:postId', isAuthMiddelware, deletePost);

export default router;