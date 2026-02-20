const jwt = require("jsonwebtoken");
var config = require("../config/config");
const moment = require("moment");
module.exports = async function (req, res, next) {
  let token = req.header("authorization")
    ? req.header("authorization")
    : req.header("Authorization");
  const currentDateTime = moment();
  if (!token) {
    token = req.body.token;
  }
  if (!token)
    return res.status(400).send({
      success: false,
      message: "Access denied. No token Provided.",
    });
  try {
    jwt.verify(token, config.secret, function (error, decoded) {
      if (decoded) {
        console.log("🚀 ~ decoded:", decoded);
        const specificDate = moment(decoded.lastLoggedIn, "YYYY-MM-DD HH:mm");
        const hoursDifference = specificDate.diff(currentDateTime, "hours");

        if (hoursDifference <= -6) {
          return res.status(200).send({
            message: "Session Expired",
            success: false,
          });
        }
        req.user = decoded;
        next();
      } else {
        res.status(400).send({
          message: "Invalid token.",
          error,
          decoded,
        });
      }
    });
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
