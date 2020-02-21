module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    // 403 forbidden
    return res
      .status(403)
      .send({ error: "You do not have enough credits to access this resource" });
  }

  next();
};
