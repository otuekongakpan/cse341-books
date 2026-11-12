const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};

const isValidId = (value) => {
  return typeof value === 'string' && /^[A-Za-z0-9]+$/.test(value);
};

const isPlainObject = (value) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isValidIsoDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.toISOString().slice(0, 10) === value;
};

const findUnknownField = (body, allowedFields) => {
  const unknownField = Object.keys(body).find((key) => {
    return !allowedFields.includes(key);
  });
  return unknownField;
};

const validateAuthorBody = (body, requireId) => {
  if (!isPlainObject(body)) {
    return 'Request body must be a JSON object';
  }
 
  const allowedFields = requireId ? ['id', 'name', 'birthYear'] : ['name', 'birthYear'];
  const unknownField = findUnknownField(body, allowedFields);
  if (unknownField) {
    return `Missing or invalid field: ${unknownField}`;
  }
 
  if (requireId && !isValidId(body.id)) {
    return 'Missing or invalid field: id';
  }
 
  if (!isNonEmptyString(body.name)) {
    return 'Missing or invalid field: name';
  }
 
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(body.birthYear) || body.birthYear < 1 || body.birthYear > currentYear) {
    return 'Missing or invalid field: birthYear';
  }
 
  return null;
};
 
const validateBookBody = (body, requireId) => {
  if (!isPlainObject(body)) {
    return 'Request body must be a JSON object';
  }
 
  const allowedFields = requireId
    ? ['id', 'authorId', 'title', 'publicationDate']
    : ['authorId', 'title', 'publicationDate'];
  const unknownField = findUnknownField(body, allowedFields);
  if (unknownField) {
    return `Missing or invalid field: ${unknownField}`;
  }
 
  if (requireId && !isValidId(body.id)) {
    return 'Missing or invalid field: id';
  }
 
  if (!isValidId(body.authorId)) {
    return 'Missing or invalid field: authorId';
  }
 
  if (!isNonEmptyString(body.title)) {
    return 'Missing or invalid field: title';
  }
 
  if (!isValidIsoDate(body.publicationDate)) {
    return 'Missing or invalid field: publicationDate';
  }
 
  return null;
};

export {
  isNonEmptyString,
  isValidId,
  isPlainObject,
  findUnknownField,
  isValidIsoDate,
  validateAuthorBody,
  validateBookBody
};