var bookshelf = require('../config/bookshelf')

var User = bookshelf.Model.extend({
    tableName: 'managers'
});

module.exports = User;