const replaceOperators = (queryObj) => {
  return JSON.parse(JSON.stringify(queryObj).replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`));
};

export default replaceOperators;
