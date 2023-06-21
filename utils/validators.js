const { ObjectId } = require('mongoose').Types;

/**
 * Original: (https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/)
 */
const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
};

module.exports = { isValidObjectId };
