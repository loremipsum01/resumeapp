bookshelf = require('../config/bookshelf');

var position = bookshelf.Model.extend({
    tableName: 'app_positions'
});

module.exports = position;