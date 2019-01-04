var express = require('express');
var knex = require('../config/bookshelf').bookshelf;
var router = express();
var positions = require('../models/position');
var resumes = require('../models/resume');
//var users = require('../models/user');

router.get('knex', function (req, res, next) {
    //get database
    knex('myresume_app')
    .select()
    .where('display', true)
    .then(resume => {
        res.json(resume)
    });
});

router.get('/positions', function(req, res, next) {
    positions.fetchAll().then(positions => {
        console.log(positions);
        res.json(positions)
    });
});

router.get('/resumes', function (req, res, next) {
    resumes.fetchAll().then(resumes => {
        res.json(resumes)
    });
});

/*
router.get('/users', function(req, res, next) {
    users.fetchAll().then(users => {
        res.json(users)
    });
});
*/

module.exports = router;