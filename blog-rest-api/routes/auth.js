import express from 'express';
import { User } from '../models/user.js';
import { signup, login, getUserStatus, updateUserStatus } from '../controllers/auth.js'
import { isAuthMiddelware } from '../utils/middlewareUtils.js'
import validator from 'express-validator'
const { body, validationResult } = validator

const router = express.Router();


router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDocument => {
                    if (userDocument) {
                        return Promise.reject('E-Mail address already exists');
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .notEmpty()
], signup);

router.post('/login', login);
router.get('/status', isAuthMiddelware, getUserStatus);
router.patch('/status', isAuthMiddelware, updateUserStatus);

export default router;