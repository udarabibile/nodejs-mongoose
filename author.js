var mongoose = require('mongoose');
 
var AuthorSchema = mongoose.Schema({
    name: { type: String, required: true},
    books: [{type : mongoose.Schema.ObjectId, ref : 'Book'}],
});

var Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;