import crypto from 'node:crypto';

const createRandomString = () => {
  return crypto.randomBytes(32).toString('hex');
};

const createHash = (randomString) => {
  return crypto.createHash('sha256').update(randomString).digest('hex');
};

export default { createRandomString, createHash };
