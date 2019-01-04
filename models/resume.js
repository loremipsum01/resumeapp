bookshelf = require('../config/bookshelf');

var resume = bookshelf.Model.extend({
    tableName: 'resumes'
});

module.exports = resume;