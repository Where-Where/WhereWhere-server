var express = require('express');
var router = express.Router();

router.use('/main', require('./main'));
router.use('/user', require('./users'));

module.exports = router;
