import {getDb} from "../db/connect.js";

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
        const book = await getDb().collection('books').findOne({ id: id });
        return book;
    } catch (error) {
        console.error(`Failed to fetch book with id ${id}:`, error);
        throw new Error('Unable to retrieve book');
    }
}

export { getAllBooks, getAllBookById };