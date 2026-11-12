import { getDb } from '../db/connect.js';

const hideMongoId = { projection: { _id: 0 } };

const getAllAuthors = async () => {
  const collection = getDb().collection('authors');
  const authors = await collection.find({}, hideMongoId).sort({ id: 1 }).toArray();
  return authors;
};

const getAuthorById = async (authorId) => {
  const collection = getDb().collection('authors');
  const author = await collection.findOne({ id: authorId }, hideMongoId);
  return author;
};

const createAuthor = async (author) => {
  const collection = getDb().collection('authors');
  await collection.insertOne({ ...author });
  return author;
};

const updateAuthor = async (authorId, changes) => {
  const collection = getDb().collection('authors');
  await collection.updateOne({ id: authorId }, { $set: changes });
  const updatedAuthor = await getAuthorById(authorId);
  return updatedAuthor;
};

const deleteAuthor = async (authorId) => {
  const collection = getDb().collection('authors');
  const result = await collection.deleteOne({ id: authorId });
  return result.deletedCount > 0;
};

const authorHasBooks = async (authorId) => {
  const booksCollection = getDb().collection('books');
  const bookCount = await booksCollection.countDocuments({ authorId }, { limit: 1 });
  return bookCount > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};