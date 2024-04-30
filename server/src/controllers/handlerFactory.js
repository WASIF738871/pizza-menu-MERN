import httpStatus from 'http-status';
import { catchAsync, ApiError, pick, replaceOperators } from '../utils/index.js';
import { customValidations } from '../validations/index.js';

const checkValidObjectId = (id) => {
  if (!customValidations.isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID!');
  }
};

const checkDocExists = (Model, id) => async () => {
  const doc = await Model.findById(id);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found!');
  }
  return doc;
};

const deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;
    checkValidObjectId(id);
    await checkDocExists(Model, id)();
    await Model.findByIdAndDelete(id);
    res.status(httpStatus.NO_CONTENT).json();
  });

const updateOne = (Model, ...fieldsToBeUpdated) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const body = pick(req.body, fieldsToBeUpdated);
    checkValidObjectId(id);
    await checkDocExists(Model, id)();
    const updateDoc = await Model.findByIdAndUpdate(id, body, {
      new: true,
      // runValidators: true,
    });
    res.status(httpStatus.OK).json(updateDoc);
  });

const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(httpStatus.CREATED).json(newDoc);
  });

const getAll = (Model, ...queryOptions) =>
  catchAsync(async (req, res) => {
    let filter = replaceOperators(pick(req.query, queryOptions));
    if (req.params.tourId) {
      checkValidObjectId(req.params.tourId);
      filter.tour = req.params.tourId;
    }
    let options = pick(req.query, ['fields', 'limit', 'page', 'sortBy']);

    let docs = await Model.docList(filter, options);
    res.status(httpStatus.OK).json(docs);
  });

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;
    checkValidObjectId(id);
    let doc;
    if (!populateOptions) doc = await checkDocExists(Model, id)();
    else {
      doc = await checkDocExists(Model, id)();
      doc = await doc.populate(populateOptions);
    }

    // const doc = await query;
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Document not found!');
    }
    res.status(httpStatus.OK).json(doc);
  });

export default {
  createOne,
  deleteOne,
  updateOne,
  getOne,
  getAll,
};
