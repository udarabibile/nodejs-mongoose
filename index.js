var mongoose = require('mongoose');
var assert = require('assert');

// Managing two way references through mongodb schema middleware.
// var Author = require('./schema-middleware/Author');
// var Book = require('./schema-middleware/Book');
// var AuthorRepository = require('./schema-middleware/AuthorRepository');

// Managing two way references through mongodb model updates.
var Author = require('./model-updates/Author');
var Book = require('./model-updates/Book');
var AuthorRepository = require('./model-updates/AuthorRepository');

const cleanUp = async () => {
    console.log('DROPPING COLLECTIONS!');
    await Author.collection.drop();
    await Book.collection.drop();
};

(async () => {
    mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    await cleanUp();    

    console.log('CREATING BOOKS!');
    const book1_doc = await Book.create({ title: 'book1' }); console.log(book1_doc._id);
    const book2_doc = await Book.create({ title: 'book2' }); console.log(book2_doc._id);
    const book3_doc = await Book.create({ title: 'book3' }); console.log(book3_doc._id);

    console.log('CREATE AUTHOR!');
    const author1_create = await AuthorRepository.create({ name: 'author1', books: [ book1_doc._id, book2_doc._id ] });
    console.log(`Author created: ${author1_create._id}`);
    await assertAuthorCreate(author1_create);

    console.log('READ AUTHOR!');
    const author1_read = await AuthorRepository.read(author1_create._id);
    console.log(`Author read: ${author1_read._id}`);
    await assertAuthorRead(author1_read);

    console.log('UPDATE AUTHOR!');
    const author1_updated = await AuthorRepository.update(author1_create._id, { name: 'author1_updated', books: [ book3_doc._id, book2_doc._id ] });
    console.log(`Author updated: ${author1_updated._id}`);
    await assertAuthorUpdate(author1_updated); 

    console.log('DELETE AUTHOR!');
    const author1_deleted = await AuthorRepository.delete(author1_create._id);
    console.log(`Author deleted: ${author1_deleted._id}`);
    await assertAuthorDelete(author1_deleted);
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

const assertAuthorRead = async (author) => {
    const { authors, books } =  await fetchCollections();

    const author1 = authors.find(a => a._id.toString() === author._id.toString());

    const book1 = books.find(b => b.title === 'book1');
    const book2 = books.find(b => b.title === 'book2');

    assert(author.name === author1.name);
    assert(author.books.length === 2);
    assert(author.books[0]._id.toString() === book1._id.toString());
    assert(author.books[0].title === book1.title);
    assert(author.books[1]._id.toString() === book2._id.toString());
    assert(author.books[1].title === book2.title);
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
