const express = require('express');
const logoutController = require('../../controllers/auth/logout');

const router = express.Router();

router.post('/logout', logoutController.postLogout);

module.exports = router;