const jwt = require("jsonwebtoken");

// middlewares/isAdmin.js
module.exports = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }
  next();
};

