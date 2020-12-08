const express = require('express');
const newPasswordController = require('../../controllers/auth/new-password');

const router = express.Router();


router.get('/reset/:token', newPasswordController.getNewPassword);
router.post('/new-password', newPasswordController.postNewPassword);

module.exports = router;