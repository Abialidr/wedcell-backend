module.exports = function (req, res, next) {
  if (req.user.role !== 'Admin') {
    return res.status(500).send('Forbidened Access');
  }
  next();
};
