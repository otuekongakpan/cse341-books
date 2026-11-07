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

export { getAllBooks };