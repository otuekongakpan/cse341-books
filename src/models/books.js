import { getDb } from '../db/connect.js';

// Keep MongoDB's internal _id out of API responses.
const hideMongoId = { projection: { _id: 0 } };

const getAllBooks = async () => {
  const collection = getDb().collection('books');
  const books = await collection.find({}, hideMongoId).sort({ id: 1 }).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const collection = getDb().collection('books');
  const book = await collection.findOne({ id: bookId }, hideMongoId);
  return book;
};

const createBook = async (book) => {
  const collection = getDb().collection('books');
  // insertOne adds _id to the object it is given, so pass a copy.
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

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};