var express = require('express');
var router = express.Router();
var book = require('../controller/book');
router.get('/boy',book.getBoy);
router.get('/girl',book.getGirl);
router.get('/pub',book.getPub);

module.exports = router;