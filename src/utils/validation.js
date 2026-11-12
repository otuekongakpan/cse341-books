const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};

const isValidId = (value) => {
  return typeof value === 'string' && /^[A-Za-z0-9]+$/.test(value);
};

const isPlainObject = (value) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

export {
  isNonEmptyString,
  isValidId,
  isPlainObject,
  findUnknownField,
  validateAuthorBody
};