const express = require('express');
const { check, body } = require('express-validator/check');

const resetController = require('../../controllers/auth/reset');
const router = express.Router();


router.get('/reset', resetController.getReset);
router.post('/reset', resetController.postReset);

module.exports = router;