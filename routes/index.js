var express = require('express');
var router = express();

//Index HTML page
router.get('/', sessionChecker, function(req, res, next){
    res.render('index')
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};
module.exports = router;