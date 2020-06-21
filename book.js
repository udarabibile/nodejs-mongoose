var mongoose = require('mongoose');
 
var bookSchema = mongoose.Schema({
    title: { type: String, required: true},
    authors: [{type : mongoose.Schema.ObjectId, ref : 'Author'}],
});
 
var Book = mongoose.model('Book', bookSchema);
 
module.exports = Book;