var express = require('express');
var router = express();

//Index HTML page
router.get('/', function(req, res, next){
    res.render('index')
});

module.exports = router;