import mongoose from 'mongoose'

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

export default {
    isValidObjectId,
};