import jwt from 'jsonwebtoken';

module.exports = (id) => {
  return jwt.sign({ id }, process.env.APP_SECRET);
};
