const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user');
const errorUtils = require('../utils/errorUtils');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;

    Post.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res
                .status(200)
                .json({
                    message: 'Fetched posts successfully.',
                    posts: posts,
                    totalItems: totalItems
                });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errorUtils.throwError('Validation failed, entered data is incorrect', 422);
    }

    if (!req.file) {
        errorUtils.throwError('No image provided', 422);
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;

    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });

    post.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorUtils.throwError('Could not find post', 404);
            }

            res.status(200)
                .json({
                    message: 'Post fetched successfully',
                    post: post
                });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        });
}

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errorUtils.throwError('Validation failed, entered data is incorrect', 422);
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }

    if (!imageUrl) {
        errorUtils.throwError('No file picked', 422);
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorUtils.throwError('Could not find post', 404);
            }

            if (post.creator.toString() !== req.userId) {
                errorUtils.throwError('Not authorized', 403);
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;

            return post.save();
        })
        .then(result => {
            res.status(200)
                .json({
                    message: 'Post updated',
                    post: result
                });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorUtils.throwError('Could not find post', 404);
            }

            if (post.creator.toString() !== req.userId) {
                errorUtils.throwError('Not authorized', 403);
            }

            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId)
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save
        })
        .then(result => {
            res.status(200)
                .json({
                    message: "Post was deleted"
                });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        })

}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}