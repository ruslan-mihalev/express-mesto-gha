const { ObjectId } = require('mongoose').Types;

const IMAGE_URL_REGEX = /^https?:\/\/[w{3}]?[\w\-.]+\.[a-z]{2,}[\(\)\[\]\w\.,;:'~\-\+\*\/=\?!@\$&#]*$/i; //eslint-disable-line

/**
 * Original: (https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/)
 */
const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
};

module.exports = { isValidObjectId, IMAGE_URL_REGEX };
