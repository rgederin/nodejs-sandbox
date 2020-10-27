const express = require ('express');

const router = express.Router();

router.get ("/", (req, res, next) => {
    res.send('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create user</button></form></body>');
});


module.exports = router;