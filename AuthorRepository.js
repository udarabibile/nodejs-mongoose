var Author = require('./author');
var Book = require('./book');

exports.create = async (author) => {
    const authorObj = await Author.create(author);
    const bookStatus = await Book.updateMany({ _id: { $in: authorObj.books } }, { $push: { 'authors': authorObj._id}});
    console.log(`Updating Book objects status: ${bookStatus}`);
    return authorObj;
}

exports.read = async (authorObjId) => {
    return await Author.findById(authorObjId).populate('books');
}

exports.update = async (author) => {
    const authorObj = await Author.findByIdAndUpdate(author._id, author); // Returns original document.

    const updatedBookIds = author.books.map(b => b.toString());
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
    const authorObj = await Author.findByIdAndDelete(authorObjId); // Returns original document.

    const bookIds = authorObj.books.map(b => b.toString());
    Promise.all(
        bookIds.map(async id => await Book.findByIdAndUpdate(id, { $pull: { authors: authorObj._id }}))
    );

    return authorObj
}
