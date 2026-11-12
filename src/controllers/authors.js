import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
} from '../models/authors.js';
import { validateAuthorBody } from '../utils/validation.js';

const getAllAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('GET /authors failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  const requestedId = req.params.id;
  try {
    const author = await getAuthorById(requestedId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error('GET /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthorHandler = async (req, res) => {
  const validationError = validateAuthorBody(req.body, true);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const newAuthor = {
    id: req.body.id,
    name: req.body.name.trim(),
    birthYear: req.body.birthYear
  };

  try {
    const existingAuthor = await getAuthorById(newAuthor.id);
    if (existingAuthor) {
      return res.status(409).json({ message: 'An author with this id already exists' });
    }

    const createdAuthor = await createAuthor(newAuthor);
    return res.status(201).json(createdAuthor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An author with this id already exists' });
    }
    console.error('POST /authors failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;

  const validationError = validateAuthorBody(req.body, false);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingAuthor = await getAuthorById(requestedId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const updatedAuthor = await updateAuthor(requestedId, {
      name: req.body.name.trim(),
      birthYear: req.body.birthYear
    });
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('PUT /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;
  try {
    const existingAuthor = await getAuthorById(requestedId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const hasBooks = await authorHasBooks(requestedId);
    if (hasBooks) {
      return res.status(409).json({ message: 'Author still has books and cannot be deleted' });
    }

    await deleteAuthor(requestedId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getAllAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
};