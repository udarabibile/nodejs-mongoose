var Author = require('./Author');
var Book = require('./Book');

exports.create = async (author) => {
    const authorObj = await Author.create(author);
    const bookStatus = await Book.updateMany({ _id: { $in: authorObj.books } }, { $push: { 'authors': authorObj._id}});
    return authorObj;
}

exports.read = async (authorObjId) => {
    return await Author.findById(authorObjId).populate('books');
}

exports.update = async (authorObjId, updatedAuthor) => {
    const authorObj = await Author.findByIdAndUpdate(authorObjId, updatedAuthor);

    const updatedBookIds = updatedAuthor.books.map(b => b.toString());
    const originalBookIds = authorObj.books.map(b => b.toString());

    const addedBookIds = updatedBookIds.filter(b => !originalBookIds.includes(b));
    const removedBookIds = originalBookIds.filter(b => !updatedBookIds.includes(b));

    Promise.all(
        addedBookIds.map(async id => await Book.findByIdAndUpdate(id, { $addToSet: { authors: authorObj._id }})),
        removedBookIds.map(async id => await Book.findByIdAndUpdate(id, { $pull: { authors: authorObj._id }}))
    );

    return authorObj;
}

exports.delete = async (authorObjId) => {
    const authorObj = await Author.findByIdAndDelete(authorObjId);

    const bookIds = authorObj.books.map(b => b.toString());
    Promise.all(
        bookIds.map(async id => await Book.findByIdAndUpdate(id, { $pull: { authors: authorObj._id }}))
    );

    return authorObj;
}
