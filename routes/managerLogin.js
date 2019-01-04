var express = require('express');
var router = express();



router.get('/',function(req, res, next){
    console.log("Loading manager page now");
    res.render('manager');
});

/*router.get('/', passport.authenticate('local', {
        successRedirect: '/', failureRedirect: '/login'
    }
)); 

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        console.log("Authenticated");
        return next();
    } else {
        res.redirect('/');
    }
} */

module.exports = router;