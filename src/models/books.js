import {getDb} from "../db/connect.js";

const hideMongoId = { projection: { _id: 0 } };

const getAllBooks = async () => {
    try {
        const books = await getDb().collection('books').find().toArray();
        return books;
    } catch (error) {
        console.error('Failed to fetch books:', error);
        throw new Error('Unable to retrieve books');
    }
}

const getAllBookById = async (id) => {
    try {
        const book = await getDb().collection('books').findOne({ id: id }, hideMongoId);
        return book;
    } catch (error) {
        console.error(`Failed to fetch book with id ${id}:`, error);
        throw new Error('Unable to retrieve book');
    }
}

const createBook = async (book) => {
  const collection = getDb().collection('books');
  await collection.insertOne({ ...book });
  return book;
};
 
const updateBook = async (bookId, changes) => {
  const collection = getDb().collection('books');
  await collection.updateOne({ id: bookId }, { $set: changes });
  const updatedBook = await getBookById(bookId);
  return updatedBook;
};
 
const deleteBook = async (bookId) => {
  const collection = getDb().collection('books');
  const result = await collection.deleteOne({ id: bookId });
  return result.deletedCount > 0;
};

export { getAllBooks, getAllBookById, createBook, updateBook, deleteBook };