var mongoose = require('mongoose');
var assert = require('assert');

var Author = require('./author');
var Book = require('./book');

const cleanUp = async () => {
    console.log('DROPPING COLLECTIONS!');
    await Author.collection.drop();
    await Book.collection.drop();
};

const printCollections = async () => {
    console.log(`Authors:\n${await Author.find({})}\n`);
    console.log(`Books:\n${await Book.find({})}\n`);
}

(async () => {
    mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    await cleanUp();    

    console.log('CREATING BOOKS!');
    const book1_doc = await Book.create({ title: 'book1' }); console.log(book1_doc._id);
    const book2_doc = await Book.create({ title: 'book2' }); console.log(book2_doc._id);
    const book3_doc = await Book.create({ title: 'book3' }); console.log(book3_doc._id);


    console.log('CREATE AUTHOR!');
    const author1_create = await Author.create({ name: 'author1', books: [ book1_doc._id, book2_doc._id ] });
    console.log(`Author created: ${author1_create._id}`);
    await assertAuthorCreate(author1_create);

    console.log('READ AUTHOR!');
    // console.log(`Authors:\n${await Author.find({}).populate('books')}\n`);


    console.log('UPDATE AUTHOR!');
    const author1_updated = await Author.findOneAndUpdate({ _id: author1_create._id }, { name: 'author1_updated', books: [ book3_doc._id, book2_doc._id ] });
    // const author1_updated = await Author.updateOne({ _id: author1_create._id }, { name: 'author1_updated', books: [ book3_doc._id, book2_doc._id ] });
    console.log(`Author updated: ${author1_updated._id}`);
    await assertAuthorUpdate(author1_updated); // author1_updated is original document before update! Use { new: true } for new document.


    console.log('DELETE AUTHOR!');
    const author1_deleted = await Author.findOneAndDelete({ _id: author1_create._id }); // Return original document.
    console.log(`Author deleted: ${author1_deleted._id}`);
    await assertAuthorDelete(author1_deleted);


    // console.log('CREATE BOOK!');
    // const book1_doc = await Book.create({ title: 'book1', authors });
    // await printCollections();
})();

const fetchCollections = async (isPrint) => {
    const authors = await Author.find({});
    const books = await Book.find({});

    if (isPrint) {
        console.log(`Authors:\n${authors}\n`);
        console.log(`Books:\n${books}\n`);
    }
    return { authors, books };
}

const assertAuthorCreate = async (author) => {
    const { authors, books } =  await fetchCollections();

    const author1 = authors.find(a => a._id.toString() === author._id.toString());

    const book1 = books.find(b => b.title === 'book1');
    const book2 = books.find(b => b.title === 'book2');
    const book3 = books.find(b => b.title === 'book3');

    assert(author1.books.includes(book1._id) === true);
    assert(author1.books.includes(book2._id) === true);
    assert(author1.books.includes(book3._id) === false);
    assert(author1.name === author.name);

    assert(book1.authors.includes(author1._id) === true);
    assert(book2.authors.includes(author1._id) === true);
    assert(book3.authors.includes(author1._id) === false);
}

const assertAuthorUpdate = async (author) => {
    const { authors, books } = await fetchCollections();

    const author1 = authors.find(a => a._id.toString() === author._id.toString());

    const book1 = books.find(b => b.title === 'book1');
    const book2 = books.find(b => b.title === 'book2');
    const book3 = books.find(b => b.title === 'book3');

    assert(author1.books.includes(book1._id) === false);
    assert(author1.books.includes(book2._id) === true);
    assert(author1.books.includes(book3._id) === true);
    assert(author1.name === 'author1_updated');

    assert(book1.authors.includes(author1._id) === false);
    assert(book2.authors.includes(author1._id) === true);
    assert(book3.authors.includes(author1._id) === true);
}

const assertAuthorDelete = async (author) => {
    const { authors, books } = await fetchCollections();

    const author1 = authors.find(a => a._id.toString() === author._id.toString());

    const book1 = books.find(b => b.title === 'book1');
    const book2 = books.find(b => b.title === 'book2');
    const book3 = books.find(b => b.title === 'book3');

    assert(author1 === undefined);

    assert(book1.authors.includes(author._id) === false);
    assert(book2.authors.includes(author._id) === false);
    assert(book3.authors.includes(author._id) === false);
}
