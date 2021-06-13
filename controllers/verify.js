var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
verifyToken = (req, res, next) => {
next();
};

module.exports = verifyToken;
