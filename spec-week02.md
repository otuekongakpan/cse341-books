# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:

- Status code: `200`
- Response body: an array of book objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:

- Status code: `200`
- Response body: the matching book object

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:

- Status code: `201`
- Response body: the newly created book object

Errors:

- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:

- Status code: `200`
- Response body: the updated book object

Errors:

- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal

Add an `authors` collection and provide all CRUD operations for it, so that books can reference authors by id. Every author route must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required, a four-digit year such as `1975`

Authors will use custom string ids instead of MongoDB `_id` values for route parameters, the same approach used for books.

### Relationship to Books

A book refers to an author through its `authorId` field. An author document does not store a list of its books.

If a client tries to delete an author who still has books, the API should refuse the request with a `400` status code and leave the author in place.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

- Status code: `200`
- Response body: an array of author objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by custom id.

Success:

- Status code: `200`
- Response body: the matching author object

Errors:

- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

Success:

- Status code: `201`
- Response body: the newly created author object

Errors:

- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

```json
{
  "name": "Updated Author Name",
  "birthYear": 1981
}
```

Success:

- Status code: `200`
- Response body: the updated author object

Errors:

- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:

- Status code: `204`
- Response body: none

Errors:

- `400` if the author still has books
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every author route.

### Deployment Expectations

After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Books API Week 02 Spec - Version 2

## General Rules

### Response Format

- Success responses return JSON, except `204` responses, which have no body.
- Error responses always use this shape:

```json
{ "message": "Description of the problem" }
```

- `500` responses always return `{ "message": "Internal server error" }`. Stack traces and database errors are logged on the server and never sent to clients.
- Responses return only the documented fields. MongoDB's `_id` is not included.

### Validation Rules (applied to all POST and PUT requests)

- The request body must be valid JSON. Malformed JSON returns `400`.
- Every field listed for a route must be present and of the correct type. Strings must be non-empty after trimming. Values of the wrong type (such as an object or an array) are rejected with `400`.
- Unknown fields in the request body are rejected with `400`.
- `id` values must be strings of letters and numbers (for example `b1`, `a1`).
- `publicationDate` must be a valid ISO 8601 date string in `YYYY-MM-DD` format.
- `birthYear` must be an integer between `1` and the current year.
- `id` is set when a document is created and cannot be changed. For PUT, the `id` is taken from the URL and must not be in the body.

### Order of Checks for POST and PUT

1. Validate the request body (`400`).
2. For routes with an `:id`, check that the target document exists (`404`).
3. Check references and conflicts: `authorId` must exist (`400`), and a duplicate `id` returns `409`.

### Database

- Database: `cse341-books-db`
- Collections: `books`, `authors`
- A unique index on `id` for both collections.
- An index on `authorId` in `books`, used for author lookups and delete checks.

## Feature 1: Book CRUD Operations and Author References

### Data Model

Book fields:

- `id`: string, required
- `authorId`: string, required, must match the `id` of an existing author
- `title`: string, required
- `publicationDate`: string, required, `YYYY-MM-DD`

Example book:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

### Routes

#### GET /books

- Success `200`: array of book objects, sorted by `id`.
- Error `500`: `{ "message": "Internal server error" }`

#### GET /books/:id

- Success `200`: the matching book object.
- Not found `404`: `{ "message": "Book not found" }`
- Error `500`: `{ "message": "Internal server error" }`

#### POST /books

Request body (all four fields required):

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

- Success `201`: the created book object.
- `400` `{ "message": "Missing or invalid field: title" }` for a missing field, wrong type, empty string, bad date format, or unknown field. The message names the problem field.
- `400` `{ "message": "Author not found" }` if `authorId` does not match an existing author.
- `409` `{ "message": "A book with this id already exists" }` for a duplicate `id`.
- `500` `{ "message": "Internal server error" }`

#### PUT /books/:id

PUT replaces the book's fields. All three fields are required and `id` must not be in the body.

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

- Success `200`: the updated book object.
- `400` `{ "message": "Missing or invalid field: authorId" }` for validation problems.
- `400` `{ "message": "Author not found" }` if `authorId` does not match an existing author.
- `404` `{ "message": "Book not found" }`
- `500` `{ "message": "Internal server error" }`

#### DELETE /books/:id

- Success `204`: no body.
- `404` `{ "message": "Book not found" }`
- `500` `{ "message": "Internal server error" }`

## Feature 2: Author CRUD Operations

### Data Model

Author fields:

- `id`: string, required
- `name`: string, required
- `birthYear`: integer, required

Example author:

```json
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1975
}
```

### Routes

#### GET /authors

- Success `200`: array of author objects, sorted by `id`.
- Error `500`: `{ "message": "Internal server error" }`

#### GET /authors/:id

- Success `200`: the matching author object.
- Not found `404`: `{ "message": "Author not found" }`
- Error `500`: `{ "message": "Internal server error" }`

#### POST /authors

Request body (all three fields required):

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

- Success `201`: the created author object.
- `400` `{ "message": "Missing or invalid field: birthYear" }` for validation problems.
- `409` `{ "message": "An author with this id already exists" }`
- `500` `{ "message": "Internal server error" }`

#### PUT /authors/:id

PUT replaces the author's fields. Both fields are required and `id` must not be in the body.

```json
{
  "name": "Updated Author Name",
  "birthYear": 1981
}
```

- Success `200`: the updated author object.
- `400` `{ "message": "Missing or invalid field: name" }` for validation problems.
- `404` `{ "message": "Author not found" }`
- `500` `{ "message": "Internal server error" }`

#### DELETE /authors/:id

- Success `204`: no body.
- `404` `{ "message": "Author not found" }`
- `409` `{ "message": "Author still has books and cannot be deleted" }` if any book has this `authorId`. The author is not deleted.
- `500` `{ "message": "Internal server error" }`

## Swagger Documentation

- Swagger UI is served at `/api-docs`.
- Every route above (10 routes: 5 for books, 5 for authors) is documented with its parameters, request body, example values, and every status code listed in this spec.
- The `Book` and `Author` schemas are documented, plus an `Error` schema for `{ "message": "..." }`.
- The Swagger server URL works for both local and Render.

## Implementation Notes

- Follow the same MVC structure as Week 01: router, controller, model.
- Migrate the Week 01 seed data: add an `authors` collection with at least 3 authors (`a1`, `a2`, `a3`), and change the existing books from the `author` name field to `authorId`.
- Controllers use `async/await` with `try/catch`, `return` after every response, and the course ESLint rules.
- Environment variables (`MONGODB_URI`, `MONGODB_DB_NAME`) are used for database configuration. No secrets are committed.

## Out of Scope for Week 2

- Authentication and authorization
- Pagination, filtering, and searching
- Cascade deletion of an author's books
