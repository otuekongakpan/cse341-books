import express from "express";
import { getBooksHandler, getBookByIdHandler } from "./controllers/books.js";

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 *     description: Fetches all available books from the database.
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: A list of books successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64a2b1c3d4e5f67890123456"
 *                   title:
 *                     type: string
 *                     example: "The Pragmatic Programmer"
 *                   author:
 *                     type: string
 *                     example: "Andrew Hunt and David Thomas"
 *       500:
 *         description: Internal server error.
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     description: Retrieves detailed information about a specific book using its unique ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the book.
 *         example: "64a2b1c3d4e5f67890123456"
 *     responses:
 *       200:
 *         description: Book details successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64a2b1c3d4e5f67890123456"
 *                 title:
 *                   type: string
 *                   example: "The Pragmatic Programmer"
 *                 author:
 *                   type: string
 *                   example: "Andrew Hunt and David Thomas"
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book with given ID not found"
 *       500:
 *         description: Internal server error.
 */
router.get('/books/:id', getBookByIdHandler);

export default router;