var express = require('express');
var router = express();

router.get('/', function(req, res, next) {
    res.render('resumeSubmit'); //Application Complete
});

module.exports = router;