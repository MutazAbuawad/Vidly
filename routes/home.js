const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index', { title: 'My Vidly App', message: 'Hello From Vidly App' });
});

module.exports = router;