var mongoose = require('mongoose');

var Author = require('./author');
var Book = require('./book');
var AuthorRepository = require('./AuthorRepository');

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
    mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
    await cleanUp();    

    console.log('CREATING BOOKS!');
    const book1_doc = await Book.create({ title: 'book1' });
    const book2_doc = await Book.create({ title: 'book2' });
    const book3_doc = await Book.create({ title: 'book3' });


    console.log('CREATE AUTHOR!');
    const author1_create = await AuthorRepository.create({ name: 'author1', books: [ book1_doc._id, book2_doc._id ] });
    console.log(`Author created: ${author1_create._id}`);
    await printCollections();


    console.log('READ AUTHOR!');
    console.log(`Authors:\n${await AuthorRepository.read(author1_create._id)}\n`);


    console.log('UPDATE AUTHOR!');
    const author1_updated = await AuthorRepository.update({ _id: author1_create._id, name: 'author1_updated', books: [ book3_doc._id, book2_doc._id ] });
    console.log(`Author updated: ${author1_updated._id}`);
    await printCollections();


    console.log('DELETE AUTHOR!');
    const author1_deleted = await AuthorRepository.delete(author1_create._id);
    console.log(author1_deleted);
    console.log(`Author deleted: ${author1_deleted._id}`);
    await printCollections();
})();
