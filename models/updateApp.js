var resumes = require('../models/resume');

//Soft delete Resume
var updateApplicant = function (req, res) {
    var b_id = req.params.id;
    resumes.forge({
        id: b_id
    })
    .fetch()
    .then(function (resumes) {
        resumes.save({
            display: 'false'
        })
        .then(function () {
            res.json({
                error: false,
                data: {
                    message: 'deleted'
                }
            });
        })
        .catch(function (err) {
            res.status(500).json({
                error: true,
                data: {
                    message: err.message
                }
            })
        });
    })
}

module.exports = updateApplicant;