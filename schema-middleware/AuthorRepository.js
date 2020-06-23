var Author = require('./Author');

exports.create = async (author) => {
    return await Author.create(author);
}

exports.read = async (authorObjId) => {
    return await Author.findById(authorObjId).populate('books');
}

exports.update = async (authorObjId, updatedAuthor) => {
    return await Author.findOneAndUpdate({ _id: authorObjId }, updatedAuthor);
}

exports.delete = async (authorObjId) => {
    return await Author.findOneAndDelete({ _id: authorObjId });
}
