var mongoose = require('mongoose');
 
var BookSchema = mongoose.Schema({
    title: { type: String, required: true},
    authors: [{type : mongoose.Schema.ObjectId, ref : 'Author'}],
});
 
var Book = mongoose.model('Book', BookSchema);
 
module.exports = Book;