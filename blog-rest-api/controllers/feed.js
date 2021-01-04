import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import validator from 'express-validator';
import { User } from '../models/user.js';
import { Post } from '../models/post.js';
import { handleError, throwError } from '../utils/errorUtils.js';

const { validationResult } = validator;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;

    try {
        const documentCount = await Post.find()
            .countDocuments();
        const posts = await Post.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200)
            .json({
                message: 'Fetched posts successfully.',
                posts: posts,
                totalItems: documentCount
            });
    } catch (err) {
        handleError(err, next);
    }
};

export const createPost = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throwError('Validation failed, entered data is incorrect', 422);
    }

    if (!req.file) {
        throwError('No image provided', 422);
    }

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path,
        creator: req.userId
    });

    try {
        await post.save();
        const user = await User.findById(req.userId);

        user.posts.push(post);
        await user.save();

        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (err) {
        handleError(err, next);
    }
};

export const getPost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            throwError('Could not find post', 404);
        }

        res.status(200)
            .json({
                message: 'Post fetched successfully',
                post: post
            });
    } catch (err) {
        handleError(err, next);
    }
};

export const updatePost = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throwError('Validation failed, entered data is incorrect', 422);
    }

    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }

    if (!imageUrl) {
        throwError('No file picked', 422);
    }

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            throwError('Could not find post', 404);
        }

        if (post.creator.toString() !== req.userId) {
            throwError('Not authorized', 403);
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }

        post.title = req.body.title;
        post.imageUrl = imageUrl;
        post.content = req.body.content;

        const updatedPost = await post.save();
        res.status(200)
            .json({
                message: 'Post updated',
                post: updatedPost
            });

    } catch (err) {
        handleError(err, next);
    }
}

export const deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            throwError('Could not find post', 404);
        }

        if (post.creator.toString() !== req.userId) {
            throwError('Not authorized', 403);
        }

        clearImage(post.imageUrl);

        await Post.findByIdAndRemove(postId);

        const user = await User.findById(req.userId);
        user.posts.pull(postId);
        await user.save();

        res.status(200)
            .json({
                message: "Post was deleted"
            });
    } catch (err) {
        handleError(err, next);
    }
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}