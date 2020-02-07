module.exports = (req, res, next) => {
  if (!req.user) {
    // 401 forbidden
    return res
      .status(401)
      .send({ error: "You must be logged in to access this resource" });
  }

  next();
};
