import { getAllBooks, getAllBookById, createBook, updateBook, deleteBook } from "../models/books.js";
import { getAuthorById } from '../models/authors.js';
import { validateBookBody } from '../utils/validation.js';


const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await getAllBookById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error(`GET /books/${id} failed:`, error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
  const validationError = validateBookBody(req.body, true);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
 
  const newBook = {
    id: req.body.id,
    authorId: req.body.authorId,
    title: req.body.title.trim(),
    publicationDate: req.body.publicationDate
  };
 
  try {
    const author = await getAuthorById(newBook.authorId);
    if (!author) {
      return res.status(400).json({ message: 'Author not found' });
    }
 
    const existingBook = await getBookById(newBook.id);
    if (existingBook) {
      return res.status(409).json({ message: 'A book with this id already exists' });
    }
 
    const createdBook = await createBook(newBook);
    return res.status(201).json(createdBook);
  } catch (error) {
    // 11000 is MongoDB's duplicate key error (two requests with the same id at once).
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A book with this id already exists' });
    }
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
 
const updateBookHandler = async (req, res) => {
  const requestedId = req.params.id;
 
  const validationError = validateBookBody(req.body, false);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
 
  try {
    const existingBook = await getBookById(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
 
    const author = await getAuthorById(req.body.authorId);
    if (!author) {
      return res.status(400).json({ message: 'Author not found' });
    }
 
    const updatedBook = await updateBook(requestedId, {
      authorId: req.body.authorId,
      title: req.body.title.trim(),
      publicationDate: req.body.publicationDate
    });
    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
 
const deleteBookHandler = async (req, res) => {
  const requestedId = req.params.id;
  try {
    const existingBook = await getBookById(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
 
    await deleteBook(requestedId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };