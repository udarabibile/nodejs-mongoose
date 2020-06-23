var mongoose = require('mongoose');
var Book = require('./Book');
 
var AuthorSchema = mongoose.Schema({
    name: { type: String, required: true},
    books: [{type : mongoose.Schema.ObjectId, ref : 'Book'}],
});

AuthorSchema.post('save', async (doc, next) => {
    const author = doc;
    // console.log(`AuthorSchema middleware on post save for author: ${author._id}`);
    // console.log(`Updating books for ids: ${author.books}`);

    const books_status = await Book.updateMany({ _id: { $in: author.books } }, { $push: { 'authors': author._id}}); // , { 'new': true }
    // console.log(`Updating status: ${JSON.stringify(books_status)}`);

    next();
});

// AuthorSchema.pre('findOneAndUpdate', function(next) {
//     // console.log('findOneAndUpdate pre hook');
//     // console.log(this._update);

//     next();
// });

AuthorSchema.post('findOneAndUpdate', function(doc) {
    // console.log('findOneAndUpdate post hook');

    const originalBookIds = doc.books;
    const updatedBookIds = this._update['$set'].books;

    const addedBookIds = updatedBookIds.filter(b => !originalBookIds.includes(b));
    const removedBookIds = originalBookIds.filter(b => !updatedBookIds.includes(b));

    Promise.all(
        addedBookIds.map(async id => await Book.findByIdAndUpdate(id, { $addToSet: { authors: doc._id }})),
        removedBookIds.map(async id => await Book.findByIdAndUpdate(id, { $pull: { authors: doc._id }}))
    );

    // next();
});

AuthorSchema.post('findOneAndDelete', function(doc) {
    // console.log('findOneAndDelete post hook');

    const originalBookIds = doc.books;
    Promise.all(
        originalBookIds.map(async id => await Book.findByIdAndUpdate(id, { $pull: { authors: doc._id }}))
    );

    // next();
});

var Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;